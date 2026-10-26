import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/products -> list all products
export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT p.id, p.name, c.category, p.description, p.price, p.created_at FROM products p JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC;'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/products -> create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, description, price } = body;

    if (!name || price === undefined || price === '' || !category) {
      return NextResponse.json(
        { error: 'Field "name", "category", dan "price" wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO products (name, category_id, description, price) VALUES (?, ?, ?, ?)',
      [name, category, description || null, price]
    );

    return NextResponse.json(
      { id: result.insertId, name, category, description, price },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
