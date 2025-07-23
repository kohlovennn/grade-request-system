const { getSheet } = require('./_google-sheets-api.js');

exports.handler = async (event) => {
    try {
        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const gradesSheet = await getSheet('Grades');
        const requestsSheet = await getSheet('Requests');

        // --- จุดแก้ไขสำคัญ: เราจะดึงเฉพาะค่าที่ต้องการจริงๆ ---
        const allUsers = (await usersSheet.getRows()).map(({ id, password, name, role }) => ({ id, password, name, role }));
        const allSubjects = (await subjectsSheet.getRows()).map(({ id, code, name, semester, teacher }) => ({ id, code, name, semester, teacher }));
        const allGrades = (await gradesSheet.getRows()).map(({ studentId, subjectId, grade }) => ({ studentId, subjectId, grade }));
        const allRequests = (await requestsSheet.getRows()).map(({ id, date, studentId, subjectId, oldGrade, newGrade, reason, status, teacherComment, adminComment }) => ({ id, date, studentId, subjectId, oldGrade, newGrade, reason, status, teacherComment, adminComment }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                users: allUsers,
                subjects: allSubjects,
                grades: allGrades,
                requests: allRequests
            })
        };
    } catch (error) {
        console.error("Error in getAdminData:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.toString() })
        };
    }
};