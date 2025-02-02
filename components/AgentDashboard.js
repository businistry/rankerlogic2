function AgentDashboard({ rooms, onUpdateRooms, lastUpdate }) {
    const [selectedType, setSelectedType] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [error, setError] = React.useState(null);

    const roomTypeCategories = {
        king: ['KXTY', 'NKXUE', 'NKXUD', 'KXPL', 'NKXUG'],
        queen: ['SXQL', 'NQRUE', 'NQRUD']
    };

    React.useEffect(() => {
        console.log('Current rooms:', rooms.map(r => ({ ...r, type: r.type?.toUpperCase() })));
    }, [rooms]);

    const getHighestGradeRooms = (roomType) => {
        try {
            const grades = ['A', 'B+', 'B', 'C'];
            const availableRooms = rooms.filter(room => 
                room.type?.toUpperCase() === roomType.toUpperCase() && 
                !room.isOccupied &&
                room.grade
            );

            console.log(`Available rooms for ${roomType}:`, availableRooms);

            for (const grade of grades) {
                const roomsWithGrade = availableRooms.filter(room => room.grade === grade);
                if (roomsWithGrade.length > 0) {
                    console.log(`Found ${roomsWithGrade.length} rooms with grade ${grade}`);
                    return roomsWithGrade;
                }
            }
            return [];
        } catch (error) {
            reportError(error);
            return [];
        }
    };

    const handleCategorySelect = (category) => {
        try {
            setSelectedCategory(category);
            setSelectedType(null);
        } catch (error) {
            reportError(error);
            setError('Failed to select category');
        }
    };

    const handleTypeSelect = (type) => {
        try {
            setSelectedType(type);
        } catch (error) {
            reportError(error);
            setError('Failed to select room type');
        }
    };

    const handleAssignRoom = async (room) => {
        try {
            const updatedRooms = rooms.map(r =>
                r.number === room.number 
                    ? { ...r, isOccupied: true }
                    : r
            );
            await saveRoomsToDB(updatedRooms);
            onUpdateRooms(updatedRooms);
        } catch (error) {
            reportError(error);
            setError('Failed to assign room');
        }
    };

    const getAvailableRoomCount = (type) => {
        try {
            const availableRooms = rooms.filter(room => 
                room.type?.toUpperCase() === type.toUpperCase() &&
                !room.isOccupied &&
                room.grade
            );
            console.log(`Count for ${type}:`, availableRooms.length, availableRooms);
            return availableRooms.length;
        } catch (error) {
            reportError(error);
            return 0;
        }
    };

    const getCategoryCount = (category) => {
        try {
            const count = rooms.filter(room => 
                roomTypeCategories[category].some(type => 
                    room.type?.toUpperCase() === type.toUpperCase()
                ) &&
                !room.isOccupied &&
                room.grade
            ).length;
            console.log(`Category ${category} count:`, count);
            return count;
        } catch (error) {
            reportError(error);
            return 0;
        }
    };

    React.useEffect(() => {
        if (selectedType) {
            const availableRooms = getHighestGradeRooms(selectedType);
            if (availableRooms.length === 0) {
                setSelectedType(null);
            }
        }
    }, [rooms, lastUpdate]);

    const availableRooms = selectedType ? getHighestGradeRooms(selectedType) : [];
    const currentGrade = availableRooms.length > 0 ? availableRooms[0].grade : null;

    return (
        <div data-name="agent-dashboard" className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-blue-800 mb-3">Hotel Room Management System - Front Desk</h1>
                    <p className="text-blue-700 mb-2">
                        Welcome to the room assignment system. This tool helps you:
                    </p>
                    <ul className="list-disc list-inside text-blue-600 ml-4 space-y-1">
                        <li>Find available rooms by category (King or Queen)</li>
                        <li>View specific room types with their descriptions</li>
                        <li>See only the highest quality grade rooms available for each type</li>
                        <li>Easily assign rooms to guests while maintaining quality standards</li>
                    </ul>
                    <p className="text-blue-700 mt-2">
                        <i className="fas fa-info-circle mr-2"></i>
                        The system automatically shows the best available rooms first, ensuring optimal guest satisfaction.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold mb-4">Room Assignment</h2>
                        
                        {/* Category Selection */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Select Room Category:</h3>
                            <div className="flex gap-4 mb-4">
                                <button
                                    data-name="king-category"
                                    onClick={() => handleCategorySelect('king')}
                                    className={`px-6 py-3 rounded-lg font-bold ${
                                        selectedCategory === 'king'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    King Rooms ({getCategoryCount('king')})
                                </button>
                                <button
                                    data-name="queen-category"
                                    onClick={() => handleCategorySelect('queen')}
                                    className={`px-6 py-3 rounded-lg font-bold ${
                                        selectedCategory === 'queen'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Queen Rooms ({getCategoryCount('queen')})
                                </button>
                            </div>
                        </div>

                        {/* Room Type Selection */}
                        {selectedCategory && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-3">Select Room Type:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {roomTypeCategories[selectedCategory].map(type => {
                                        const availableCount = getAvailableRoomCount(type);

                                        return (
                                            <button
                                                key={type}
                                                data-name={`room-type-${type}`}
                                                onClick={() => handleTypeSelect(type)}
                                                disabled={availableCount === 0}
                                                className={`p-4 rounded-lg ${
                                                    selectedType === type
                                                        ? 'bg-blue-500 text-white'
                                                        : availableCount === 0
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                } transition-colors duration-200`}
                                            >
                                                <div className="text-lg font-bold">
                                                    {type} ({availableCount})
                                                </div>
                                                <div className="text-sm mt-1">
                                                    {getRoomTypeDescription(type)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {currentGrade && (
                        <div className="border-t border-b bg-blue-50 p-4">
                            <div className="text-center text-lg font-semibold text-blue-800">
                                Showing Grade {currentGrade} Rooms
                            </div>
                        </div>
                    )}

                    <div className="p-4">
                        {selectedType ? (
                            availableRooms.length > 0 ? (
                                <RoomList
                                    rooms={availableRooms}
                                    onAssign={handleAssignRoom}
                                />
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No available rooms for {selectedType}
                                </div>
                            )
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {selectedCategory 
                                    ? 'Please select a room type'
                                    : 'Please select a room category'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
