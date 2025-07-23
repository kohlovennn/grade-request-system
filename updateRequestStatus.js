const { getSheet } = require('./_google-sheets-api');

exports.handler = async (event) => {
    try {
        const { requestId, status, finalGrade, comment } = JSON.parse(event.body);
        const requestsSheet = await getSheet('Requests');
        const rows = await requestsSheet.getRows();

        const rowToUpdate = rows.find(r => r.id === requestId);
        if (rowToUpdate) {
            rowToUpdate.status = status;
            rowToUpdate.teacherComment = comment;
            if (status === 'teacher_approved') {
                rowToUpdate.newGrade = finalGrade;
            }
            await rowToUpdate.save();
            return { statusCode: 200, body: JSON.stringify({ success: true, message: 'อัปเดตสถานะสำเร็จ' }) };
        }
        return { statusCode: 404, body: JSON.stringify({ success: false, message: 'ไม่พบคำร้อง' }) };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: e.toString() }) };
    }
};