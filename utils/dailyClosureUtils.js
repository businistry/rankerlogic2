const DAILY_CLOSURE_OBJECT_TYPE = 'hotel_daily_closure';

async function saveDailyClosureData() {
    try {
        const currentRooms = await loadRoomsFromDB();
        const timestamp = new Date().toISOString();
        const dateKey = new Date().toISOString().split('T')[0];

        // Extract only the required room data
        const roomData = currentRooms.map(room => ({
            number: room.number,
            type: room.type,
            grade: room.grade,
            isOccupied: room.isOccupied
        }));

        const closureData = {
            date: dateKey,
            timestamp: timestamp,
            rooms: roomData
        };

        await trickleCreateObject(DAILY_CLOSURE_OBJECT_TYPE, {
            id: dateKey,
            ...closureData
        });

        return closureData;
    } catch (error) {
        reportError(error);
        throw new Error('Failed to save daily closure data');
    }
}

async function loadPreviousDayData() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split('T')[0];

        const response = await trickleListObjects(DAILY_CLOSURE_OBJECT_TYPE);
        const closureData = response.items.find(item => item.objectData.date === yesterdayKey);

        if (!closureData) {
            return null;
        }

        return {
            rooms: closureData.objectData.rooms
        };
    } catch (error) {
        reportError(error);
        throw new Error('Failed to load previous day data');
    }
}

async function getDailyClosureHistory(startDate, endDate) {
    try {
        const response = await trickleListObjects(DAILY_CLOSURE_OBJECT_TYPE);
        return response.items
            .filter(item => {
                const itemDate = new Date(item.objectData.date);
                return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
            })
            .map(item => item.objectData)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        reportError(error);
        throw new Error('Failed to load daily closure history');
    }
}
