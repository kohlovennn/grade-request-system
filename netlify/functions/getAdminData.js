const { getSheet } = require('./_google-sheets-api.js');

exports.handler = async (event) => {
    // --- ส่วนที่แก้ไขคือตรง catch ด้านล่าง ---
    try {
        const usersSheet = await getSheet('Users');
        const subjectsSheet = await getSheet('Subjects');
        const gradesSheet = await getSheet('Grades');
        const requestsSheet = await getSheet('Requests');

        const allUsers = (await usersSheet.getRows()).map(r => ({...r}));
        const allSubjects = (await subjectsSheet.getRows()).map(r => ({...r}));
        const allGrades = (await gradesSheet.getRows()).map(r => ({...r}));
        const allRequests = (await requestsSheet.getRows()).map(r => ({...r}));

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
        // *** จุดแก้ไขสำคัญ ***
        // แทนที่จะ return null เราจะส่งข้อความ error กลับไปแทน
        console.error("Error in getAdminData:", error);
        return {
            statusCode: 500, // บอกว่ามีข้อผิดพลาดเกิดขึ้น
            body: JSON.stringify({ message: error.toString() }) // ส่งข้อความ error กลับไป
        };
    }
};