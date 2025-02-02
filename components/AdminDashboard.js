function AdminDashboard({ rooms, onUpdateRooms, lastUpdate }) {
    const [selectedRooms, setSelectedRooms] = React.useState([]);
    const [showBulkUploadModal, setShowBulkUploadModal] = React.useState(false);
    const [showBulkUpdateModal, setShowBulkUpdateModal] = React.useState(false);
    const [bulkUpdateType, setBulkUpdateType] = React.useState(null);
    const [showRoomTypeModal, setShowRoomTypeModal] = React.useState(false);
    const [roomTypes, setRoomTypes] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [filterType, setFilterType] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        loadRoomTypes();
    }, []);

    const loadRoomTypes = async () => {
        try {
            const types = await loadRoomTypesFromDB();
            setRoomTypes(types);
        } catch (error) {
            reportError(error);
            setError('Failed to load room types');
        }
    };

    const handleRoomTypeAdd = async (newType) => {
        try {
            const updatedTypes = [...roomTypes, newType];
            await saveRoomTypesToDB(updatedTypes);
            setRoomTypes(updatedTypes);
            setShowRoomTypeModal(false);
        } catch (error) {
            reportError(error);
            setError('Failed to add room type');
        }
    };

    const handleBulkUpload = async (newRooms) => {
        try {
            // Replace all existing rooms with new data
            await onUpdateRooms(newRooms);
            setShowBulkUploadModal(false);
        } catch (error) {
            reportError(error);
            setError('Failed to upload rooms');
        }
    };

    const handleBulkUpdate = async (value) => {
        try {
            const updatedRooms = rooms.map(room => {
                if (selectedRooms.includes(room.number)) {
                    if (bulkUpdateType === 'grade') {
                        return { ...room, grade: value };
                    } else {
                        return { ...room, isOccupied: value === 'occupied' };
                    }
                }
                return room;
            });
            await onUpdateRooms(updatedRooms);
            setSelectedRooms([]);
        } catch (error) {
            reportError(error);
            setError('Failed to update rooms');
        }
    };

    const toggleRoomSelection = (roomNumber) => {
        setSelectedRooms(prev => 
            prev.includes(roomNumber)
                ? prev.filter(num => num !== roomNumber)
                : [...prev, roomNumber]
        );
    };

    const filteredRooms = React.useMemo(() => {
        return rooms.filter(room => {
            const matchesType = filterType === 'all' || room.type === filterType;
            const matchesSearch = room.number.toString().includes(searchQuery) ||
                                room.type.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [rooms, filterType, searchQuery]);

    return (
        <div data-name="admin-dashboard" className="container mx-auto p-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-blue-800 mb-3">Hotel Room Management System - Administrator</h1>
                <p className="text-blue-700 mb-2">
                    Welcome to the administrator dashboard. This system allows you to:
                </p>
                <ul className="list-disc list-inside text-blue-600 ml-4 space-y-1">
                    <li>Manage and monitor all hotel rooms</li>
                    <li>Assign quality grades (A, B+, B, C) to rooms</li>
                    <li>Track room occupancy status</li>
                    <li>Perform bulk updates for room grades and status</li>
                    <li>View daily closure reports and historical data</li>
                </ul>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        data-name="add-room-type-button"
                        onClick={() => setShowRoomTypeModal(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Add Room Type
                    </button>
                    <button
                        data-name="bulk-upload-button"
                        onClick={() => setShowBulkUploadModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <i className="fas fa-upload mr-2"></i>
                        Bulk Upload
                    </button>
                    {selectedRooms.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                data-name="bulk-update-grade-button"
                                onClick={() => {
                                    setBulkUpdateType('grade');
                                    setShowBulkUpdateModal(true);
                                }}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            >
                                Update Grades
                            </button>
                            <button
                                data-name="bulk-update-status-button"
                                onClick={() => {
                                    setBulkUpdateType('status');
                                    setShowBulkUpdateModal(true);
                                }}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Update Status
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="all">All Types</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search rooms..."
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12 px-6 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRooms.length === filteredRooms.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRooms(filteredRooms.map(r => r.number));
                                            } else {
                                                setSelectedRooms([]);
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Room Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Grade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRooms.map(room => (
                                <tr key={room.number}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRooms.includes(room.number)}
                                            onChange={() => toggleRoomSelection(room.number)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4">{room.number}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-medium">{room.type}</div>
                                            <div className="text-gray-500">
                                                {getRoomTypeDescription(room.type)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            room.grade ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {room.grade || 'Ungraded'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            room.isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {room.isOccupied ? 'Occupied' : 'Available'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                const updatedRooms = rooms.map(r =>
                                                    r.number === room.number
                                                        ? { ...r, isOccupied: !r.isOccupied }
                                                        : r
                                                );
                                                onUpdateRooms(updatedRooms);
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <i className="fas fa-exchange-alt mr-1"></i>
                                            Toggle Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showRoomTypeModal && (
                <RoomTypeModal
                    onClose={() => setShowRoomTypeModal(false)}
                    onAdd={handleRoomTypeAdd}
                    existingTypes={roomTypes}
                />
            )}

            {showBulkUploadModal && (
                <BulkUploadModal
                    onClose={() => setShowBulkUploadModal(false)}
                    onUpload={handleBulkUpload}
                    roomTypes={roomTypes}
                />
            )}

            {showBulkUpdateModal && (
                <BulkUpdateModal
                    onClose={() => setShowBulkUpdateModal(false)}
                    onUpdate={handleBulkUpdate}
                    selectedRooms={selectedRooms}
                    updateType={bulkUpdateType}
                />
            )}
        </div>
    );
}
