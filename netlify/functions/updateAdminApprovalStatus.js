const { getSheet } = require('./_google-sheets-api');

exports.handler = async (event) => {
    try {
        const { requestId, status, comment } = JSON.parse(event.body);
        
        // อัปเดตชีต Requests
        const requestsSheet = await getSheet('Requests');
        const requestRows = await requestsSheet.getRows();
        const requestToUpdate = requestRows.find(r => r.id === requestId);

        if (!requestToUpdate) {
            return { statusCode: 404, body: JSON.stringify({ success: false, message: 'ไม่พบคำร้อง' }) };
        }

        requestToUpdate.status = status;
        requestToUpdate.adminComment = comment;
        await requestToUpdate.save();

        // ถ้าอนุมัติ (approved) ให้ไปอัปเดตชีต Grades
        if (status === 'approved') {
            const gradesSheet = await getSheet('Grades');
            const gradeRows = await gradesSheet.getRows();
            const gradeToUpdate = gradeRows.find(g => 
                g.studentId === requestToUpdate.studentId && 
                g.subjectId === requestToUpdate.subjectId
            );

            if (gradeToUpdate) {
                gradeToUpdate.grade = requestToUpdate.newGrade;
                await gradeToUpdate.save();
            }
        }

        return { statusCode: 200, body: JSON.stringify({ success: true, message: 'อัปเดตสถานะสำเร็จ' }) };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: e.toString() }) };
    }
};