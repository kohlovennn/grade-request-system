const { getSheet } = require('./_google-sheets-api.js');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        const { username, password } = JSON.parse(event.body);
        const usersSheet = await getSheet('Users');
        const rows = await usersSheet.getRows();
        const user = rows.find(u => u.id === username && u.password === String(password));

        if (user) {
            const userData = { id: user.id, name: user.name, role: user.role };
            return { statusCode: 200, body: JSON.stringify(userData) };
        } else {
            return { statusCode: 200, body: JSON.stringify(null) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};