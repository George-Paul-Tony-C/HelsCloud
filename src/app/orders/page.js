"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 min-h-screen flex flex-col items-center relative animate-fadeIn">
      <Link href="/">
        <button className="absolute top-8 right-8 bg-black w-12 h-12 text-white text-lg font-bold rounded-full hover:bg-red-600 transition-transform transform hover:scale-105 shadow-lg focus:outline-none">
          X
        </button>
      </Link>
      <h1 className="text-5xl font-bold text-blue-800 mb-12 tracking-wide drop-shadow-md animate-slideIn">
        Your Orders
      </h1>

      {error && (
        <p className="text-red-500 mb-6 animate-fadeIn">
          {error}
        </p>
      )}

      <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-2xl space-y-8 animate-fadeIn">
        {orders.length === 0 ? (
          <p className="text-gray-600 text-lg text-center animate-bounce">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border border-blue-200 rounded-2xl p-6 bg-gradient-to-tr from-blue-50 to-blue-100 shadow-lg space-y-4 transition-transform transform hover:scale-105">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order ID: <span className="text-blue-700">{order._id}</span>
                </h2>
                <p className="text-sm text-gray-500 italic animate-fadeIn">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-700 animate-slideIn">
                Total: <span className="text-green-600">${order.totalPrice.toFixed(2)}</span>
              </p>
              <ul className="space-y-2 mt-4">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between text-gray-700 text-base animate-fadeIn delay-100">
                    <span>{item.name} - <span className="text-gray-500">Quantity: {item.quantity}</span></span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
