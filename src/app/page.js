"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowUp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for skeletons
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false); // State for back-to-top button
  const { addToCart, totalItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(data);
        setCategories(['All', ...new Set(data.map(product => product.category))]);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchProducts();

    // Show or hide the back-to-top button based on scroll position
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    // Optional: show a confirmation toast or message here
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) setProducts(products.filter(product => product._id !== id));
      else console.error('Failed to delete product');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-500 p-4 text-white flex justify-between items-center shadow-lg transition-all duration-500">
        <h1 className="text-2xl font-extrabold tracking-wide">HelsClouds Boutique</h1>
        <div className="flex items-center space-x-6">
          <Link href="/add-product">
            <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition ease-in-out duration-300">Add Product</button>
          </Link>
          <Link href="/orders">
            <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition ease-in-out duration-300">Your Orders</button>
          </Link>
          <Link href="/cart">
            <div className="relative cursor-pointer">
              <FaShoppingCart className="text-white text-2xl hover:text-indigo-300 transition ease-in-out duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-80 bg-cover bg-center bg-gradient-to-b from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg">
        <div className="text-center text-white space-y-2">
          <motion.h2 
            className="text-5xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Our Store
          </motion.h2>
          <motion.p
            className="text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover our range of products across different categories!
          </motion.p>
        </div>
      </section>

      {/* Category Selection */}
      <section className="px-8 py-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Categories</h2>
        <div className="flex gap-4 overflow-auto p-4">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-lg font-semibold ${
                selectedCategory === category ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
              whileTap={{ scale: 0.95 }}
              animate={selectedCategory === category ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Products</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill().map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg flex flex-col justify-center items-center p-4 space-y-4">
                <div className="w-full h-48 bg-gray-300 rounded-md"></div>
                <div className="w-3/4 h-6 bg-gray-300 rounded-md"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white shadow-lg rounded-lg p-4 relative hover:shadow-xl transition-transform transform hover:scale-105 flex flex-col"
              >
                <div className="relative">
                  <Link href={`/product/${product._id}`}>
                    <motion.img
                      src={product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-md mb-4 transition-transform transform "
                    />
                  </Link>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white font-bold px-3 py-1 rounded-lg shadow">
                    ${product.price}
                  </div>
                  {product.isNew && <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>}
                  {product.isOnSale && <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Sale</span>}
                </div>

                <div className="flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 mb-3">{product.description.slice(0, 50)}...</p>

                  <div className="flex justify-center space-x-4 mt-4">
                    <Link href={`/product/${product._id}`}>
                      <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition">Quick View</button>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition active:bg-black"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Dropdown Menu (3-dot icon) */}
                <button
                  onClick={() => setMenuOpen(menuOpen === product._id ? null : product._id)}
                  className={`absolute top-2 right-2 text-gray-500 hover:text-gray-700 transform transition-transform duration-300 ${
                    menuOpen === product._id ? 'rotate-90' : 'rotate-0'
                  }`}
                                >
                  •••
                </button>
                {menuOpen === product._id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-2 top-10 bg-white border rounded-lg shadow-lg z-10 overflow-hidden"
                  >
                    <Link href={`/update-product/${product._id}`}>
                      <p className="flex items-center p-2 space-x-2 hover:bg-gray-100 cursor-pointer transition-colors">
                        <svg className="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                        <span>Update</span>
                      </p>
                    </Link>
                    <p
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center p-2 space-x-2 hover:bg-gray-100 cursor-pointer text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19a2 2 0 01-2-2V7a2 2 0 012-2h4.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2H6z"></path>
                      </svg>
                      <span>Delete</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            !error && <p className="text-gray-500">No products available in this category.</p>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-6 text-center mt-auto shadow-lg">
        <p>© 2023 HelsClouds Boutique. All rights reserved.</p>
      </footer>
    </div>
  );
}
 