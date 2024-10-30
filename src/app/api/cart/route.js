// src/app/api/cart/route.js
import dbConnect from '@/utils/dbConnect';
import Cart from '@/models/Cart';

export async function GET(request, { user }) {
  await dbConnect();
  try {
    const cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching cart', { status: 500 });
  }
}

export async function POST(request, { user }) {
  await dbConnect();
  const { productId, quantity } = await request.json();

  try {
    let cart = await Cart.findOne({ userId: user._id });
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      cart = await Cart.create({ userId: user._id, items: [{ productId, quantity }] });
    }
    await cart.save();
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error updating cart', { status: 500 });
  }
}

export async function DELETE(request, { user }) {
  await dbConnect();
  try {
    await Cart.deleteOne({ userId: user._id });
    return new Response('Cart cleared', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error clearing cart', { status: 500 });
  }
}
