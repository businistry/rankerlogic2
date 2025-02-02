function BulkUpdateModal({ onClose, onUpdate, selectedRooms, updateType }) {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = () => {
        try {
            if (!value && updateType === 'grade') {
                setError('Please select a grade');
                return;
            }
            onUpdate(value);
            onClose();
        } catch (error) {
            reportError(error);
            setError('Failed to update rooms');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">
                    Bulk Update {updateType === 'grade' ? 'Grade' : 'Status'}
                </h3>
                <p className="mb-4 text-gray-600">
                    Selected rooms: {selectedRooms.length}
                </p>

                {updateType === 'grade' ? (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Grade:
                            <select
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                            >
                                <option value="">Select a grade</option>
                                <option value="A">Grade A</option>
                                <option value="B+">Grade B+</option>
                                <option value="B">Grade B</option>
                                <option value="C">Grade C</option>
                            </select>
                        </label>
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Set Status:
                            <select
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                            >
                                <option value="">Select a status</option>
                                <option value="occupied">Occupied</option>
                                <option value="vacant">Vacant</option>
                            </select>
                        </label>
                    </div>
                )}

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
