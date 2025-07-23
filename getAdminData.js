const { getSheet } = require('./_google-sheets-api');

exports.handler = async (event) => {
    try {
        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const gradesSheet = await getSheet('Grades');
        const requestsSheet = await getSheet('Requests');
        
        // ดึงข้อมูลทั้งหมด
        const allUsers = (await usersSheet.getRows()).map(r => ({...r}));
        const allSubjects = (await subjectsSheet.getRows()).map(r => ({...r}));
        const allGrades = (await gradesSheet.getRows()).map(r => ({...r}));
        const allRequests = (await requestsSheet.getRows()).map(r => ({...r}));

        return {
            statusCode: 200,
            body: JSON.stringify({
                users: allUsers,
                subjects: allSubjects,
                grades: allGrades, // ส่งไปทั้งหมดเลยก็ได้เผื่ออนาคต
                requests: allRequests
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};