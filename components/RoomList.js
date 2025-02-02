function RoomList({ rooms, onAssign }) {
    try {
        if (rooms.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500">
                    No available rooms found
                </div>
            );
        }

        return (
            <div data-name="room-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map(room => (
                    <RoomCard
                        key={room.number}
                        room={room}
                        onAssign={onAssign}
                    />
                ))}
            </div>
        );
    } catch (error) {
        reportError(error);
        return <div>Error loading room list</div>;
    }
}
