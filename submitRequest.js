const { getSheet } = require('./_google-sheets-api');

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const requestsSheet = await getSheet('Requests');
        
        const rows = await requestsSheet.getRows();
        const newId = `REQ${String(rows.length + 1).padStart(3, '0')}`;

        const newRow = {
            id: newId,
            date: new Date().toISOString(),
            studentId: data.studentId,
            subjectId: data.subjectId,
            oldGrade: data.oldGrade,
            newGrade: data.newGrade,
            reason: data.reason,
            status: 'pending',
            teacherComment: '',
            adminComment: ''
        };

        await requestsSheet.addRow(newRow);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'ยื่นคำร้องสำเร็จ' })
        };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: e.toString() }) };
    }
};