function RoleSelector({ onSelectRole }) {
    const [showAdminAuth, setShowAdminAuth] = React.useState(false);
    const [adminPassword, setAdminPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleAdminAuth = (e) => {
        try {
            e.preventDefault();
            if (validateAdminPassword(adminPassword)) {
                setError('');
                onSelectRole('admin');
                saveAuthToSession('admin');
            } else {
                setError('Invalid password');
            }
        } catch (error) {
            reportError(error);
            setError('Authentication failed');
        }
    };

    return (
        <div data-name="role-selector" className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
                
                {!showAdminAuth ? (
                    <div className="space-y-4">
                        <button
                            data-name="admin-auth-button"
                            onClick={() => setShowAdminAuth(true)}
                            className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            <i className="fas fa-user-shield mr-2"></i>
                            Admin Dashboard
                        </button>
                        <button
                            data-name="agent-role-button"
                            onClick={() => {
                                onSelectRole('agent');
                                saveAuthToSession('agent');
                            }}
                            className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            <i className="fas fa-user-tie mr-2"></i>
                            Agent Dashboard
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleAdminAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Admin Password
                                <input
                                    data-name="admin-password-input"
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </label>
                            {error && (
                                <p className="mt-2 text-sm text-red-600">{error}</p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                data-name="admin-login-button"
                                type="submit"
                                className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Login
                            </button>
                            <button
                                data-name="admin-cancel-button"
                                type="button"
                                onClick={() => {
                                    setShowAdminAuth(false);
                                    setAdminPassword('');
                                    setError('');
                                }}
                                className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
