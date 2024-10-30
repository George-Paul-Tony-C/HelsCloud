"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 tracking-wide animate-slideIn">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg animate-bounce">Your cart is empty.</p>
      ) : (
        <motion.div
          className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl space-y-6 animate-fadeIn"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center space-x-6">
                  <motion.img
                    src={item.imageUrl || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600 font-medium mt-1">${item.price}</p>
                    <motion.button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 text-sm mt-2 hover:underline transition"
                      whileHover={{ color: '#ff4d4f' }}
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <p className="text-gray-800 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Animated Total */}
          <div className="flex justify-between items-center font-semibold text-xl mt-8 text-gray-800">
            <span>Total:</span>
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              key={total}
              className="text-green-600"
            >
              ${total.toFixed(2)}
            </motion.span>
          </div>

          {/* Checkout Button */}
          <Link href="/checkout">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)' }}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
