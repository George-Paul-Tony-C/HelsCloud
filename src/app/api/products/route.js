// src/app/api/products/route.js
import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product';

export async function GET(request) {
  await dbConnect();
  try {
    const products = await Product.find({});
    return new Response(JSON.stringify(products), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
  }
}


export async function POST(request) {
  await dbConnect();

  const data = await request.json();

  try {
    // Count the products in the same category to generate the Extra ID
    const categoryCount = await Product.countDocuments({ category: data.category });
    const extraID = `${data.category.toUpperCase()}-${categoryCount + 1}`;

    const newProduct = new Product({
      ...data,
      extraID,
    });
    await newProduct.save();

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return new Response(JSON.stringify({ error: 'Failed to add product' }), { status: 500 });
  }
}
