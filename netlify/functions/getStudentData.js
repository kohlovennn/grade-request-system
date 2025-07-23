const { getSheet } = require('./_google-sheets-api');

exports.handler = async (event) => {
    try {
        const { id } = JSON.parse(event.body);

        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const gradesSheet = await getSheet('Grades');
        const requestsSheet = await getSheet('Requests');

        const allUsers = (await usersSheet.getRows()).map(r => ({...r}));
        const allSubjects = (await subjectsSheet.getRows()).map(r => ({...r}));
        const studentGrades = (await gradesSheet.getRows()).filter(g => g.studentId === id).map(r => ({...r}));
        const studentRequests = (await requestsSheet.getRows()).filter(r => r.studentId === id).map(r => ({...r}));

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
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};