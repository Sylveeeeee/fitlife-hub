// pages/api/foods.js

import mysql2 from 'mysql2';

const mysqlPool = mysql2.createPool({
  host: 'localhost', // เปลี่ยนตามข้อมูลฐานข้อมูลของคุณ
  user: 'root', // ชื่อผู้ใช้ฐานข้อมูล
  password: '1234', // รหัสผ่าน
  database: 'fitlifehub', // ชื่อฐานข้อมูล
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function handler(req, res) {
  try {
    const [rows] = await mysqlPool.promise().execute('SELECT * FROM foods'); // ดึงข้อมูลจากตาราง foods
    res.status(200).json(rows); // ส่งข้อมูลกลับเป็น JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching foods' });
  }
}
