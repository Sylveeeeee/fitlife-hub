import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // เชื่อมต่อกับ Prisma Client

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get('category') // รับค่าหมวดหมู่จาก query string
    const search = url.searchParams.get('search') // รับค่าคำค้นหาจาก query string

    // สร้าง query หลัก
    let query = {}

    // ถ้าคำค้นหามีการส่งเข้ามาให้กรองด้วยคำค้นหานั้น
    if (search) {
      query = {
        ...query,
        OR: [
          { name: { contains: search, mode: 'insensitive' } }, // ค้นหาจากชื่ออาหาร
          { description: { contains: search, mode: 'insensitive' } }, // ค้นหาจากคำอธิบาย
        ],
      }
    }

    // ถ้า category เป็น "Favorites" กรองเฉพาะรายการที่เป็นโปรด
    if (category === 'Favorites') {
      query = {
        ...query,
        is_favorite: true, // กรองเฉพาะอาหารที่เป็นโปรด
      }
    }

    // ดึงข้อมูลจาก Prisma
    const foods = await prisma.foods.findMany({
      where: query,
    })

    return NextResponse.json(foods) // ส่งข้อมูลกลับในรูปแบบ JSON
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.error()
  }
}
