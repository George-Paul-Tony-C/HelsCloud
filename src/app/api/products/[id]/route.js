// src/app/api/products/[id]/route.js
import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product';

// Fetch a single product by ID
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params; // Await the params destructure here

  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(product), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), { status: 500 });
  }
}

// Update a product by ID
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params; // Await the params destructure here
  const data = await request.json();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedProduct), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to update product' }), { status: 500 });
  }
}

// Delete a product by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params; // Await the params destructure here

  try {
    await Product.findByIdAndDelete(id);
    return new Response('Product deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
  }
}
