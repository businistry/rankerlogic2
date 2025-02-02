function DailyClosureModal({ onClose, onConfirm, role }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            setError(null);
            await onConfirm();
            onClose();
        } catch (error) {
            reportError(error);
            setError('Failed to perform daily closure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Daily System Closure</h3>
                <p className="text-gray-600 mb-4">
                    {role === 'admin' 
                        ? "This will save the current system state and prepare for the next day's operations."
                        : "This will save today's room assignments and prepare the system for tomorrow."
                    }
                    Are you sure you want to proceed?
                </p>
                
                {error && (
                    <div className="mb-4 text-red-600">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        data-name="cancel-closure"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        data-name="confirm-closure"
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                        ) : (
                            <i className="fas fa-save mr-2"></i>
                        )}
                        Confirm Closure
                    </button>
                </div>
            </div>
        </div>
    );
}
