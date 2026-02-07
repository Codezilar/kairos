'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      if (error) setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append image if exists
      if (image) {
        submitData.append('image', image);
      }

      // Make API call
      const response = await fetch('/api/categories', {
        method: 'POST',
        body: submitData,
        // Don't set Content-Type header for FormData - browser will set it automatically with boundary
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create category');
      }

      // Success - show message and redirect or reset form
      alert('Category created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        metaTitle: '',
        metaDescription: '',
      });
      setImage(null);
      setImagePreview('');
      
      // Optionally redirect to categories list
      // router.push('/dashboard/categories');

    } catch (err) {
      console.error('Category creation error:', err);
      setError(err.message || 'An error occurred while creating the category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='dashboard_landing'>
      <div className="">
        <div className="admin-post-form">
          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <h1 className="form-title">Create New Category</h1>
              <p className="form-subtitle">Add a new category for products</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="post-form">
              {/* Basic Information Card */}
              <div className="form-card">
                <h2 className="card-title">Basic Information</h2>
                
                {/* Category Name */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Enter category name..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Brief description of the category..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Single Image Upload Card */}
              <div className="form-card">
                <h2 className="card-title">Category Image</h2>
                
                <div className="image-upload-section">
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="image-upload" className="file-upload-label">
                      <div className="upload-icon">📁</div>
                      <div className="upload-text">
                        <p>Click to upload category image</p>
                        <span>or drag and drop</span>
                      </div>
                      <p className="upload-hint">PNG, JPG, WEBP up to 10MB</p>
                    </label>
                  </div>

                  {/* Single Image Preview */}
                  {imagePreview && (
                    <div className="image-previews">
                      <h3 className="previews-title">Selected Image</h3>
                      <div className="previews-grid">
                        <div className="image-preview-item">
                          <img 
                            src={imagePreview} 
                            alt="Category preview"
                            className="preview-image"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="remove-image-btn"
                            disabled={isSubmitting}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Card */}
              <div className="form-card">
                <h2 className="card-title">SEO Settings</h2>
                
                <div className="form-group">
                  <label htmlFor="metaTitle" className="form-label">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="SEO title (optional)"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="metaDescription" className="form-label">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="form-textarea"
                    placeholder="SEO description (optional)"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? 'Creating Category...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;