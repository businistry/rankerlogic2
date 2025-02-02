function RoomForm({ onSubmit, initialData, onCancel, isEditing = false }) {
    const [formData, setFormData] = React.useState(
        initialData || {
            grade: 'A',
            isOccupied: false
        }
    );

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            onSubmit(formData);
        } catch (error) {
            reportError(error);
        }
    };

    const handleChange = (e) => {
        try {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <form data-name="room-form" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Grade:
                    <select
                        data-name="room-grade-select"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                    >
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>
                </label>
            </div>
            <div className="flex space-x-2">
                <button
                    data-name="submit-button"
                    type="submit"
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Update Room
                </button>
                {onCancel && (
                    <button
                        data-name="cancel-button"
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
