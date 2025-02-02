function GradeIndicator({ activeGrade }) {
    try {
        const grades = ['A', 'B+', 'B', 'C'];
        
        return (
            <div data-name="grade-indicator" className="flex justify-center space-x-4 p-4 bg-gray-50 border-t border-b">
                {grades.map(grade => (
                    <div
                        key={grade}
                        data-name={`grade-${grade}`}
                        className={`grade-indicator px-4 py-2 rounded-full ${
                            grade === activeGrade
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        Grade {grade}
                    </div>
                ))}
            </div>
        );
    } catch (error) {
        reportError(error);
        return <div>Error loading grade indicator</div>;
    }
}
