function Header({ role, onLogout }) {
    const [showClosureModal, setShowClosureModal] = React.useState(false);
    const [showHistory, setShowHistory] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleDailyClosure = async () => {
        try {
            setError(null);
            await saveDailyClosureData();
        } catch (error) {
            reportError(error);
            setError('Failed to perform daily closure');
            throw error;
        }
    };

    return (
        <header data-name="header" className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Hotel Room Management
                        </h1>
                        <p className="text-sm text-gray-600">
                            {role === 'admin' ? 'Administrator Dashboard' : 'Agent Dashboard'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {role === 'admin' && (
                            <button
                                data-name="view-history"
                                onClick={() => setShowHistory(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                <i className="fas fa-history mr-2"></i>
                                View History
                            </button>
                        )}
                        <button
                            data-name="daily-closure"
                            onClick={() => setShowClosureModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            <i className="fas fa-power-off mr-2"></i>
                            Daily Closure
                        </button>
                        <button
                            data-name="logout-button"
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </div>

            {showClosureModal && (
                <DailyClosureModal
                    onClose={() => setShowClosureModal(false)}
                    onConfirm={handleDailyClosure}
                    role={role}
                />
            )}

            {showHistory && role === 'admin' && (
                <ClosureHistory
                    onClose={() => setShowHistory(false)}
                />
            )}
        </header>
    );
}
