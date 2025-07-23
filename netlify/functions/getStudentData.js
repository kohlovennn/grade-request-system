const { getSheet } = require('./_google-sheets-api.js');

exports.handler = async (event) => {
    try {
        const { id } = JSON.parse(event.body);

        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const gradesSheet = await getSheet('Grades');
        const requestsSheet = await getSheet('Requests');

        const allUsers = (await usersSheet.getRows()).map(({ id, name, role }) => ({ id, name, role }));
        const allSubjects = (await subjectsSheet.getRows()).map(({ id, code, name, semester, teacher }) => ({ id, code, name, semester, teacher }));
        const studentGrades = (await gradesSheet.getRows()).filter(g => g.studentId === id).map(({ studentId, subjectId, grade }) => ({ studentId, subjectId, grade }));
        const studentRequests = (await requestsSheet.getRows()).filter(r => r.studentId === id).map(({ id, date, studentId, subjectId, oldGrade, newGrade, reason, status, teacherComment, adminComment }) => ({ id, date, studentId, subjectId, oldGrade, newGrade, reason, status, teacherComment, adminComment }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                users: allUsers,
                subjects: allSubjects,
                grades: studentGrades,
                requests: studentRequests
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};