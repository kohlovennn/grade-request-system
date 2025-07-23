// netlify/functions/_google-sheets-api.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

// ID ของ Google Sheet ของคุณ (จาก URL)
const SPREADSHEET_ID = '1eJlPRM5b04cpjiWCMlAYosZIqILd2tP4WAJNzr5Tock'; 

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

let isAuthInitialized = false;

async function getSheet(sheetName) {
    if (!isAuthInitialized) {
        // ใช้ Environment Variables ที่ตั้งค่าไว้ใน Netlify
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            // แก้ไข private_key ให้รองรับ newlines ที่มาจาก environment variable
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
        isAuthInitialized = true;
    }
    return doc.sheetsByTitle[sheetName];
}

module.exports = { getSheet };