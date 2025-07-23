const { getSheet } = require('./_google-sheets-api.js');

exports.handler = async (event) => {
    try {
        const { id } = JSON.parse(event.body);

        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const requestsSheet = await getSheet('Requests');

        const allUsers = (await usersSheet.getRows()).map(({ id, name, role }) => ({ id, name, role }));
        const allSubjects = (await subjectsSheet.getRows()).map(({ id, code, name, semester, teacher }) => ({ id, code, name, semester, teacher }));
        const allRequests = (await requestsSheet.getRows()).map(({ id, date, studentId, subjectId, oldGrade, newGrade, reason, status, teacherComment, adminComment }) => ({ id, date, studentId, subjectId, oldGrade, newGrade, reason, status, teacherComment, adminComment }));

        const teacherSubjectIds = allSubjects.filter(s => s.teacher === id).map(s => s.id);
        const teacherRequests = allRequests.filter(r => teacherSubjectIds.includes(r.subjectId));

        return {
            statusCode: 200,
            body: JSON.stringify({
                users: allUsers,
                subjects: allSubjects,
                grades: [],
                requests: teacherRequests
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};