exports.handler = async (event) => {
  const { username } = JSON.parse(event.body);

  // ไม่ต้องเช็ค password ไม่ต้องต่อ Google Sheet
  // ส่งข้อมูลทดสอบกลับไปทันที เพื่อดูว่าโค้ดใหม่ถูก deploy หรือไม่
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: username,
      name: "USER FROM LATEST CODE", // <-- ข้อความพิสูจน์
      role: "admin",
    }),
  };
};