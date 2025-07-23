// บรรทัดที่ 1: เรียกใช้ไฟล์ตัวช่วย
const { getSheet } = require('./_google-sheets-api.js');

// บรรทัดที่ 4: ส่วนหลักของฟังก์ชัน
exports.handler = async (event) => {
    // ตรวจสอบว่าเป็น POST request
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // ดึงข้อมูล username, password จากที่ส่งมา
        const { username, password } = JSON.parse(event.body);
        
        // เชื่อมต่อกับชีต 'Users'
        const usersSheet = await getSheet('Users');
        const rows = await usersSheet.getRows();

        // หา user ที่มี id และ password ตรงกัน
        const user = rows.find(u => u.id === username && u.password === String(password));

        if (user) {
            // ถ้าเจอ user ให้ส่งข้อมูลกลับไป
            const userData = {
                id: user.id,
                name: user.name,
                role: user.role
            };
            return {
                statusCode: 200,
                body: JSON.stringify(userData)
            };
        } else {
            // ถ้าไม่เจอ ให้ส่งค่า null กลับไป
            return {
                statusCode: 200,
                body: JSON.stringify(null)
            };
        }
    } catch (error) {
        // ถ้าเกิดข้อผิดพลาดระหว่างทำงาน
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};