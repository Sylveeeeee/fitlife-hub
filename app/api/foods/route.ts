import { NextResponse } from 'next/server';
import { mysqlPool } from '@/app/utils/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category'); // รับค่าหมวดหมู่จาก query string

    let query = 'SELECT * FROM foods';
    const queryParams: string[] = [];

    // ถ้า category เป็น "Favorites" ให้กรองเฉพาะสินค้าที่ถูกมาร์คเป็นโปรด
    if (category === 'Favorites') {
      query += ' WHERE is_favorite = ?';  // สมมุติว่า 'is_favorite' เป็นคอลัมน์ในตาราง foods ที่บ่งบอกว่าสินค้าเป็นโปรด
      queryParams.push('1');  // 1 หมายถึงเป็นสินค้าโปรด
    }

    // ใช้ mysqlPool.promise() ในการ execute query
    const promisePool = mysqlPool.promise();
    const [rows] = await promisePool.execute(query, queryParams);

    return NextResponse.json(rows);  // ส่งข้อมูลกลับในรูปแบบ JSON
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.error();
  }
}
