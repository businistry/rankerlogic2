function UnassignedRoomList({ rooms, onAssignGrade }) {
    try {
        const unassignedRooms = rooms.filter(room => !room.grade);

        if (unassignedRooms.length === 0) {
            return (
                <div className="text-center text-gray-500 py-4">
                    No unassigned rooms
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2">Room Number</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unassignedRooms.map(room => (
                            <tr key={room.number} className="border-b">
                                <td className="px-4 py-2">{room.number}</td>
                                <td className="px-4 py-2 capitalize">{room.type}</td>
                                <td className="px-4 py-2">
                                    <select
                                        data-name="grade-select"
                                        className="mr-2 p-1 border rounded"
                                        onChange={(e) => onAssignGrade(room.number, e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select Grade</option>
                                        <option value="A">A</option>
                                        <option value="B+">B+</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } catch (error) {
        reportError(error);
        return <div>Error loading unassigned rooms</div>;
    }
}
