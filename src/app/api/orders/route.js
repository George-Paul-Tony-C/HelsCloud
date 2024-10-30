// /api/orders.js

import dbConnect from '@/utils/dbConnect';
import Order from '@/models/Order';

export async function POST(request) {
  await dbConnect();

  const { items, totalPrice, user } = await request.json();

  try {
    const order = new Order({
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      user, // Storing user information
    });

    await order.save();

    return new Response(JSON.stringify(order), { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return new Response(JSON.stringify({ message: 'Error creating order', details: error.message }), { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  
  try {
    const orders = await Order.find({})
      .select('_id items totalPrice user createdAt') // Include createdAt and user data
      .sort({ createdAt: -1 }); // Sort by newest orders first

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ message: 'Error fetching orders', details: error.message }), { status: 500 });
  }
}
