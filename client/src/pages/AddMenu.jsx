import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { menuAPI } from '../services/api';

const AddMenu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVegetarian: true,
    isAvailable: true,
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Appetizers', 'Main Course', 'Biryani', 'Pizza', 'Burgers', 'Desserts', 'Beverages'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await menuAPI.create({
        ...formData,
        price: Number(formData.price),
      });
      alert('Menu item added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to add menu:', error);
      alert(error.response?.data?.message || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add New Menu Item
          </h1>
          <p className="text-gray-600 mt-2">Add delicious items to your restaurant menu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Image</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image: '' });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Margherita Pizza"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Describe your delicious item..."
            ></textarea>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="199"
                step="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <span>Vegetarian</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <span>Available</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Adding Item...' : 'Add Menu Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;