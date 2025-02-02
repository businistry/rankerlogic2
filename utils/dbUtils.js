const ROOM_OBJECT_TYPE = 'hotel_room';
const ROOM_TYPE_OBJECT_TYPE = 'room_type';

// Define default room types based on the hotel's room type codes
const DEFAULT_ROOM_TYPES = [
    'KXTY',   // 1 King bed with sofabed, non-smoking room
    'NKXUE',  // 1 King bed with sofabed, mobility and hearing accessible room with roll-in shower, non-smoking
    'NKXUD',  // 1 King bed with sofabed, mobility and hearing accessible room with tub, non-smoking
    'KXPL',   // 1 King bed with sofabed, large room, non-smoking
    'NKXUG',  // 1 King bed with sofabed, hearing accessible room, non-smoking
    'SXQL',   // 2 Queen beds, non-smoking room
    'NQRUE',  // 2 Queen beds, mobility and hearing accessible room with roll-in shower, non-smoking
    'NQRUD'   // 2 Queen beds, mobility and hearing accessible room with tub, non-smoking
];

async function fixRoomTypes() {
    try {
        const response = await trickleListObjects(ROOM_OBJECT_TYPE);
        let currentRooms = response.items[0]?.objectData?.rooms || [];
        
        // Check if any rooms need updating
        const needsUpdate = currentRooms.some(room => room.type === 'KPXL');
        
        if (!needsUpdate) {
            console.log('No KPXL rooms found, no update needed');
            return false;
        }

        // Update all KPXL rooms to KXPL
        const updatedRooms = currentRooms.map(room => ({
            ...room,
            type: room.type === 'KPXL' ? 'KXPL' : room.type
        }));

        // Save the updated rooms
        await saveRoomsToDB(updatedRooms);
        console.log('Successfully updated KPXL room types to KXPL');
        return true;
    } catch (error) {
        reportError(error);
        throw new Error('Failed to fix room types');
    }
}

async function saveRoomTypesToDB(roomTypes) {
    try {
        // Normalize room types to uppercase
        const normalizedTypes = roomTypes.map(type => type.toUpperCase());
        await trickleCreateObject(ROOM_TYPE_OBJECT_TYPE, { 
            id: 'current',
            types: normalizedTypes,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        reportError(error);
        throw new Error('Failed to save room types to database');
    }
}

async function loadRoomTypesFromDB() {
    try {
        const response = await trickleListObjects(ROOM_TYPE_OBJECT_TYPE);
        const latestTypes = response.items[0]?.objectData?.types;
        
        if (!latestTypes) {
            return DEFAULT_ROOM_TYPES;
        }
        
        // Ensure all types are uppercase
        return latestTypes.map(type => type.toUpperCase());
    } catch (error) {
        reportError(error);
        throw new Error('Failed to load room types from database');
    }
}

async function saveRoomsToDB(rooms) {
    try {
        // Fix any KPXL room types before saving
        const fixedRooms = rooms.map(room => ({
            ...room,
            type: room.type === 'KPXL' ? 'KXPL' : room.type?.toUpperCase()
        }));
        
        console.log('Saving normalized rooms to DB:', fixedRooms);
        
        const timestamp = new Date().toISOString();
        await trickleCreateObject(ROOM_OBJECT_TYPE, {
            id: 'current',
            rooms: fixedRooms,
            updatedAt: timestamp
        });

        localStorage.setItem('lastRoomUpdate', timestamp);
        return true;
    } catch (error) {
        reportError(error);
        throw new Error('Failed to save rooms to database');
    }
}

async function loadRoomsFromDB() {
    try {
        const response = await trickleListObjects(ROOM_OBJECT_TYPE);
        let latestRooms = response.items[0]?.objectData?.rooms;
        
        if (!latestRooms) {
            return [];
        }

        // Fix any KPXL room types when loading
        latestRooms = latestRooms.map(room => ({
            ...room,
            type: room.type === 'KPXL' ? 'KXPL' : room.type?.toUpperCase()
        }));

        console.log('Loaded normalized rooms from DB:', latestRooms);

        const timestamp = response.items[0]?.objectData?.updatedAt;
        if (timestamp) {
            localStorage.setItem('lastRoomUpdate', timestamp);
        }
        
        return latestRooms;
    } catch (error) {
        reportError(error);
        throw new Error('Failed to load rooms from database');
    }
}

async function checkForUpdates() {
    try {
        const lastLocalUpdate = localStorage.getItem('lastRoomUpdate');
        const response = await trickleListObjects(ROOM_OBJECT_TYPE);
        const latestUpdate = response.items[0]?.objectData?.updatedAt;

        return {
            hasUpdates: latestUpdate && lastLocalUpdate !== latestUpdate,
            lastUpdate: latestUpdate
        };
    } catch (error) {
        reportError(error);
        throw new Error('Failed to check for updates');
    }
}

// Room type descriptions for UI display
const ROOM_TYPE_DESCRIPTIONS = {
    'KXTY': '1 King bed with sofabed, non-smoking room',
    'NKXUE': '1 King bed with sofabed, mobility and hearing accessible room with roll-in shower, non-smoking',
    'NKXUD': '1 King bed with sofabed, mobility and hearing accessible room with tub, non-smoking',
    'KXPL': '1 King bed with sofabed, large room, non-smoking',
    'NKXUG': '1 King bed with sofabed, hearing accessible room, non-smoking',
    'SXQL': '2 Queen beds, non-smoking room',
    'NQRUE': '2 Queen beds, mobility and hearing accessible room with roll-in shower, non-smoking',
    'NQRUD': '2 Queen beds, mobility and hearing accessible room with tub, non-smoking'
};

function getRoomTypeDescription(type) {
    const upperType = type?.toUpperCase();
    return ROOM_TYPE_DESCRIPTIONS[upperType] || upperType || type;
}
