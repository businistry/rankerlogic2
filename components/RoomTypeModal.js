function RoomTypeModal({ onClose, onAdd, existingTypes }) {
    const [newType, setNewType] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            
            if (!newType) {
                setError('Room type is required');
                return;
            }

            const formattedType = newType.toUpperCase().trim();
            
            if (existingTypes.includes(formattedType)) {
                setError('This room type already exists');
                return;
            }

            onAdd(formattedType);
            setNewType('');
            setError('');
        } catch (error) {
            reportError(error);
            setError('Failed to add room type');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Add Room Type</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Room Type Code:
                            <input
                                type="text"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                placeholder="e.g., KXTY"
                            />
                        </label>
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Type
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
