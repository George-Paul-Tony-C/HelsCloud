"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const { addToCart, totalItems } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false); // State for back-to-top button

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch product');
          return;
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Show/hide back-to-top button based on scroll position
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wider">HelsClouds Boutique</h1>

        <div className="flex items-center space-x-6">
          <Link href="/add-product">
            <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              Add Product
            </button>
          </Link>
          <Link href="/cart">
            <div className="relative cursor-pointer">
              <FaShoppingCart className="text-white text-2xl hover:text-blue-200 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </nav>

      <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center">
        <div className="max-w-4xl bg-white p-8 rounded-xl shadow-lg relative transform transition-all hover:shadow-2xl">
          {/* Toast Notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-16 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
              >
                Item added to cart!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-shrink-0 md:w-1/2"
            >
              <Image
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                width={500} // Adjust width to fit your layout needs
                height={500} // Adjust height accordingly
                className="w-full h-full object-cover rounded-md shadow-lg transform transition duration-300 hover:scale-110"
              />
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-grow mt-6 md:mt-0 space-y-4"
            >
              <h1 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-2xl text-blue-600 font-semibold mb-2">Price: ${product.price}</p>
              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="space-y-2">
                <p className="text-gray-800 font-semibold">
                  Category: <span className="font-normal">{product.category}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Brand: <span className="font-normal">{product.brand || 'N/A'}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Quantity Available: <span className="font-normal">{product.quantity}</span>
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Specifications:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">{spec.key}:</span> {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                Add to Cart
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </>
  );
}
