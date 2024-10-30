"use client";
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (!userData.name || !userData.email || !userData.address) {
      setOrderError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userData,
          items: cartItems,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      clearCart();
      setOrderSuccess(true);
      setOrderError(null);
      router.push('/orders');
    } catch (error) {
      console.error('Order placement error:', error);
      setOrderError('Checkout failed');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 tracking-wide animate-slideIn">Checkout</h1>

      {orderError && <p className="text-red-500 mb-4 animate-bounce">{orderError}</p>}

      {orderSuccess ? (
        <p className="text-green-500 text-lg">Order placed successfully!</p>
      ) : (
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 animate-slideIn">Order Summary</h2>

          {/* User Info Form */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={userData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <textarea
              name="address"
              placeholder="Your Address"
              value={userData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Cart Items */}
          <div className="mt-8 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <Image
                  src={item.imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                  width={64} // Width and height should match desired dimensions
                  height={64}
                  className="object-cover rounded-lg shadow-md transition-transform transform hover:scale-110"
                />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">${item.price} x {item.quantity}</p>
                </div>
                <p className="text-gray-800 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center font-semibold text-xl mt-8 text-gray-800">
            <span>Total:</span>
            <span className="text-green-600 ">${totalPrice.toFixed(2)}</span>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-105"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
