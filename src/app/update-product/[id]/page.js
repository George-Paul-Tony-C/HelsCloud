// src/app/update-product/[id]/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function UpdateProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: '',
    brand: '',
    tags: '',
    specifications: [{ key: '', value: '' }],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch product');
          return;
        }

        const data = await response.json();
        
        // Pre-process tags and specifications
        setProduct({
          ...data,
          tags: data.tags ? data.tags.join(', ') : '',
          specifications: data.specifications.length ? data.specifications : [{ key: '', value: '' }],
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('An unexpected error occurred. Please try again later.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      tags: product.tags.split(',').map(tag => tag.trim()),
      specifications: product.specifications.filter(spec => spec.key && spec.value),
    };

    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      router.push('/');
    } else {
      console.error('Failed to update product');
    }
  };

  const addSpecification = () => setProduct({ 
    ...product, 
    specifications: [...product.specifications, { key: '', value: '' }] 
  });

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...product.specifications];
    updatedSpecifications[index][field] = value;
    setProduct({ ...product, specifications: updatedSpecifications });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Update Product</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-4 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-3 border rounded"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 border rounded"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            className="w-full p-3 border rounded"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 border rounded"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-3 border rounded"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-3 border rounded"
            value={product.imageUrl}
            onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
          />
          <input
            type="text"
            placeholder="Brand"
            className="w-full p-3 border rounded"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-3 border rounded"
            value={product.tags}
            onChange={(e) => setProduct({ ...product, tags: e.target.value })}
          />

          <h3 className="text-lg font-bold mt-4">Specifications</h3>
          {product.specifications.map((spec, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                placeholder="Key"
                className="w-1/2 p-3 border rounded"
                value={spec.key}
                onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                className="w-1/2 p-3 border rounded"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecification}
            className="text-blue-500 hover:underline mt-2"
          >
            + Add Specification
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded mt-4 font-semibold hover:bg-blue-600 transition-colors"
          >
            Update Product
          </button>
        </form>
      )}
    </div>
  );
}
