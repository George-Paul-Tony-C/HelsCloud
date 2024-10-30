"use client";// src/app/add-product/page.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [brand, setBrand] = useState('');
  const [tags, setTags] = useState('');
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: productName,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl,
      brand,
      tags: tags.split(',').map(tag => tag.trim()),
      specifications: specifications.filter(spec => spec.key && spec.value),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const addSpecification = () => setSpecifications([...specifications, { key: '', value: '' }]);

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = value;
    setSpecifications(updatedSpecifications);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-4 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-3 border rounded"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-3 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          className="w-full p-3 border rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full p-3 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Brand"
          className="w-full p-3 border rounded"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          className="w-full p-3 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <h3 className="text-lg font-bold mt-4">Specifications</h3>
        {specifications.map((spec, index) => (
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
          className="w-full bg-green-500 text-white px-4 py-3 rounded mt-4 font-semibold hover:bg-green-600 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
