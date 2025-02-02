function RoomCard({ room, onAssign }) {
    try {
        const { number, type, grade } = room;
        
        const getGradeClass = (grade) => {
            if (!grade) return 'bg-gray-100 text-gray-800';
            const gradeColors = {
                'A': 'bg-blue-100 text-blue-800',
                'B+': 'bg-indigo-100 text-indigo-800',
                'B': 'bg-purple-100 text-purple-800',
                'C': 'bg-pink-100 text-pink-800'
            };
            return gradeColors[grade] || 'bg-gray-100 text-gray-800';
        };
        
        return (
            <div 
                data-name="room-card"
                className="room-card p-4 m-2 rounded-lg border bg-white shadow-sm"
            >
                <h3 data-name="room-number" className="text-lg font-bold">Room {number}</h3>
                <div data-name="room-type" className="space-y-1">
                    <div className="font-medium">{type}</div>
                    <div className="text-sm text-gray-600">
                        {getRoomTypeDescription(type)}
                    </div>
                </div>
                <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${getGradeClass(grade)}`}>
                        Grade {grade}
                    </span>
                </div>
                <button
                    data-name="assign-button"
                    onClick={() => onAssign(room)}
                    className="mt-4 w-full px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Assign Room
                </button>
            </div>
        );
    } catch (error) {
        reportError(error);
        return <div>Error loading room card</div>;
    }
}
