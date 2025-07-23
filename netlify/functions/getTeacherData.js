const { getSheet } = require('./_google-sheets-api');

exports.handler = async (event) => {
    try {
        const { id } = JSON.parse(event.body);

        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const requestsSheet = await getSheet('Requests');

        const allUsers = (await usersSheet.getRows()).map(r => ({...r}));
        const allSubjects = (await subjectsSheet.getRows()).map(r => ({...r}));
        const allRequests = (await requestsSheet.getRows()).map(r => ({...r}));

        const teacherSubjectIds = allSubjects.filter(s => s.teacher === id).map(s => s.id);
        const teacherRequests = allRequests.filter(r => teacherSubjectIds.includes(r.subjectId));

        return {
            statusCode: 200,
            body: JSON.stringify({
                users: allUsers,
                subjects: allSubjects,
                grades: [], // ครูไม่จำเป็นต้องใช้ข้อมูลนี้
                requests: teacherRequests
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};