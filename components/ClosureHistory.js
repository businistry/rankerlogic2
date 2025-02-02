function ClosureHistory({ onClose }) {
    const [history, setHistory] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [dateRange, setDateRange] = React.useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    React.useEffect(() => {
        loadHistory();
    }, [dateRange]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getDailyClosureHistory(dateRange.start, dateRange.end);
            setHistory(data);
        } catch (error) {
            reportError(error);
            setError('Failed to load closure history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusCounts = (rooms) => {
        return rooms.reduce((acc, room) => {
            if (room.isOccupied) {
                acc.occupied++;
            } else {
                acc.available++;
            }
            return acc;
        }, { occupied: 0, available: 0 });
    };

    const getGradeCounts = (rooms) => {
        return rooms.reduce((acc, room) => {
            if (room.grade) {
                acc[room.grade] = (acc[room.grade] || 0) + 1;
            }
            return acc;
        }, {});
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl m-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Daily Closure History</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="mb-4 flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({
                                    ...prev,
                                    start: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({
                                    ...prev,
                                    end: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 text-red-600">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-4">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Loading...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Rooms
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grade Distribution
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {history.map((record) => {
                                    const statusCounts = getStatusCounts(record.rooms);
                                    const gradeCounts = getGradeCounts(record.rooms);
                                    
                                    return (
                                        <tr key={record.date}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.rooms.length}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <span className="text-green-600">Available: {statusCounts.available}</span>
                                                    <br />
                                                    <span className="text-red-600">Occupied: {statusCounts.occupied}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {Object.entries(gradeCounts).map(([grade, count]) => (
                                                        <div key={grade} className="text-sm">
                                                            Grade {grade}: {count}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        const csv = record.rooms
                                                            .map(room => 
                                                                `${room.number},${room.type},${room.grade || 'Ungraded'},${room.isOccupied ? 'Occupied' : 'Available'}`
                                                            )
                                                            .join('\n');
                                                        
                                                        const blob = new Blob([`Room Number,Type,Grade,Status\n${csv}`], { type: 'text/csv' });
                                                        const url = window.URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `room-status-${record.date}.csv`;
                                                        a.click();
                                                        window.URL.revokeObjectURL(url);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <i className="fas fa-download mr-1"></i>
                                                    Export
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
