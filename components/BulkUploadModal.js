function BulkUploadModal({ onClose, onUpload, roomTypes }) {
    const [csvData, setCsvData] = React.useState('');
    const [previewData, setPreviewData] = React.useState([]);
    const [error, setError] = React.useState('');
    const fileInputRef = React.useRef(null);

    const validateAndParseCSV = (data) => {
        try {
            const lines = data.trim().split('\n');
            const parsedData = [];
            const errors = [];

            lines.forEach((line, index) => {
                if (!line.trim()) return; // Skip empty lines
                
                const [number, type, grade] = line.split(',').map(item => item?.trim() || '');

                if (!number || !type) {
                    errors.push(`Line ${index + 1}: Missing room number or type`);
                    return;
                }

                // Convert KPXL to KXPL automatically
                const normalizedType = type.toUpperCase() === 'KPXL' ? 'KXPL' : type.toUpperCase();

                if (!roomTypes.includes(normalizedType)) {
                    errors.push(`Line ${index + 1}: Invalid room type "${type}"`);
                    return;
                }

                if (grade && !['A', 'B+', 'B', 'C'].includes(grade)) {
                    errors.push(`Line ${index + 1}: Invalid grade "${grade}"`);
                    return;
                }

                parsedData.push({
                    number: parseInt(number),
                    type: normalizedType,
                    grade: grade || null,
                    isOccupied: false
                });
            });

            if (errors.length > 0) {
                setError(errors.join('\n'));
                setPreviewData([]);
            } else {
                setError('');
                setPreviewData(parsedData);
            }
        } catch (error) {
            reportError(error);
            setError('Invalid CSV format');
            setPreviewData([]);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setCsvData(content);
                validateAndParseCSV(content);
            };
            reader.onerror = (e) => {
                reportError(e);
                setError('Failed to read file');
            };
            reader.readAsText(file);
        }
    };

    const handleUpload = async () => {
        try {
            if (previewData.length === 0) {
                setError('No valid data to upload');
                return;
            }

            // Replace all existing rooms with new data
            await onUpload(previewData);
            onClose();
        } catch (error) {
            reportError(error);
            setError('Failed to upload rooms');
        }
    };

    const downloadTemplate = () => {
        const template = 'room_number,room_type,grade\n101,KXTY,A\n102,KXPL,B+\n103,SXQL,B';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'room_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">Bulk Upload Rooms</h3>
                
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Format: room_number,room_type,grade (optional)
                        <br />
                        Example: 101,KXTY,A
                        <br />
                        Note: This will replace all existing room data.
                        <br />
                        Note: KPXL will be automatically converted to KXPL.
                    </p>
                    
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={downloadTemplate}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            <i className="fas fa-download mr-2"></i>
                            Download Template
                        </button>
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".csv"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                <i className="fas fa-file-upload mr-2"></i>
                                Choose CSV File
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Or paste CSV content directly:</p>
                        <textarea
                            rows="6"
                            value={csvData}
                            onChange={(e) => {
                                setCsvData(e.target.value);
                                validateAndParseCSV(e.target.value);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="Enter CSV data here..."
                        />
                    </div>

                    {error && (
                        <div className="mt-2 text-red-500 whitespace-pre-line">{error}</div>
                    )}
                </div>

                {previewData.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Preview ({previewData.length} rooms):</h4>
                        <div className="max-h-48 overflow-y-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2">Room</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((room, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{room.number}</td>
                                            <td className="px-4 py-2">{room.type}</td>
                                            <td className="px-4 py-2">{room.grade || 'Ungraded'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={previewData.length === 0}
                        className={`px-4 py-2 rounded ${
                            previewData.length === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        Upload and Replace All ({previewData.length} rooms)
                    </button>
                </div>
            </div>
        </div>
    );
}
