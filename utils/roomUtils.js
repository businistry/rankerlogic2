function getNextGrade(currentGrade) {
    try {
        const grades = ['A', 'B+', 'B', 'C'];
        const currentIndex = grades.indexOf(currentGrade);
        return currentIndex < grades.length - 1 ? grades[currentIndex + 1] : null;
    } catch (error) {
        reportError(error);
        return null;
    }
}

function determineActiveGrade(rooms, type) {
    try {
        const grades = ['A', 'B+', 'B', 'C'];
        
        for (const grade of grades) {
            const roomsOfTypeAndGrade = rooms.filter(
                room => (!type || room.type === type) && 
                       room.grade === grade && 
                       !room.isOccupied
            );
            
            if (roomsOfTypeAndGrade.length > 0) {
                return grade;
            }
        }
        
        return null;
    } catch (error) {
        reportError(error);
        return null;
    }
}

function saveRoomsToStorage(rooms) {
    try {
        localStorage.setItem('hotelRooms', JSON.stringify(rooms));
    } catch (error) {
        reportError(error);
    }
}

function loadRoomsFromStorage() {
    try {
        const rooms = localStorage.getItem('hotelRooms');
        return rooms ? JSON.parse(rooms) : [];
    } catch (error) {
        reportError(error);
        return [];
    }
}

function isKingRoom(type) {
    return ['KXTY', 'NKXUE', 'NKXUD', 'KXPL', 'NKXUG'].includes(type);
}

function isQueenRoom(type) {
    return ['SXQL', 'NQRUE', 'NQRUD'].includes(type);
}

function getRoomTypeDescription(type) {
    const descriptions = {
        'KXTY': '1 King bed with sofabed, non-smoking room',
        'NKXUE': '1 King bed with sofabed, mobility and hearing accessible room with roll-in shower, non-smoking',
        'NKXUD': '1 King bed with sofabed, mobility and hearing accessible room with tub, non-smoking',
        'KXPL': '1 King bed with sofabed, large room, non-smoking',
        'NKXUG': '1 King bed with sofabed, hearing accessible room, non-smoking',
        'SXQL': '2 Queen beds, non-smoking room',
        'NQRUE': '2 Queen beds, mobility and hearing accessible room with roll-in shower, non-smoking',
        'NQRUD': '2 Queen beds, mobility and hearing accessible room with tub, non-smoking'
    };
    return descriptions[type] || type;
}
