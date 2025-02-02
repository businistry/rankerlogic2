function App() {
    const [role, setRole] = React.useState(() => getAuthFromSession());
    const [rooms, setRooms] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [lastUpdate, setLastUpdate] = React.useState(Date.now());

    // Fix room types on initial load
    React.useEffect(() => {
        const fixRoomTypesOnLoad = async () => {
            try {
                await fixRoomTypes();
            } catch (error) {
                reportError(error);
                setError('Failed to fix room types');
            }
        };
        fixRoomTypesOnLoad();
    }, []);

    // Poll for updates every 5 seconds
    React.useEffect(() => {
        const loadRooms = async () => {
            try {
                setError(null);
                const loadedRooms = await loadRoomsFromDB();
                setRooms(loadedRooms);
            } catch (error) {
                reportError(error);
                setError('Failed to load rooms data');
            }
        };

        loadRooms();
        const interval = setInterval(() => {
            loadRooms();
        }, 5000);

        return () => clearInterval(interval);
    }, [lastUpdate]);

    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                setError(null);
                // Try to load previous day's data first
                const previousData = await loadPreviousDayData();
                if (previousData) {
                    setRooms(previousData.rooms);
                } else {
                    // If no previous data, load current data
                    const loadedRooms = await loadRoomsFromDB();
                    setRooms(loadedRooms);
                }
            } catch (error) {
                reportError(error);
                setError('Failed to load initial data');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleUpdateRooms = async (updatedRooms) => {
        try {
            setError(null);
            await saveRoomsToDB(updatedRooms);
            setRooms(updatedRooms);
            setLastUpdate(Date.now());
        } catch (error) {
            reportError(error);
            setError('Failed to update rooms');
        }
    };

    const handleLogout = () => {
        try {
            setRole(null);
            clearAuthFromSession();
        } catch (error) {
            reportError(error);
            setError('Failed to logout properly');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl font-semibold text-gray-600">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-red-600 mb-4">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!role) {
        return <RoleSelector onSelectRole={setRole} />;
    }

    return (
        <div data-name="app" className="min-h-screen bg-gray-100">
            <Header role={role} onLogout={handleLogout} />
            {role === 'admin' ? (
                <AdminDashboard 
                    rooms={rooms} 
                    onUpdateRooms={handleUpdateRooms}
                    lastUpdate={lastUpdate}
                />
            ) : (
                <AgentDashboard 
                    rooms={rooms} 
                    onUpdateRooms={handleUpdateRooms}
                    lastUpdate={lastUpdate}
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
