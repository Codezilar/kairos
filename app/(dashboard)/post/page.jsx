"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  Grid,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  LocalOffer as PriceIcon,
  Percent as PercentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AddPhotoAlternate as AddPhotoIcon
} from '@mui/icons-material';

const AdminPostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    oldPrice: '',
    newPrice: '',
    metaTitle: '',
    metaDescription: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Calculate discount percentage when prices change
  useEffect(() => {
    const oldPrice = parseFloat(formData.oldPrice);
    const newPrice = parseFloat(formData.newPrice);
    
    if (oldPrice && newPrice && oldPrice > newPrice) {
      const discount = ((oldPrice - newPrice) / oldPrice) * 100;
      setDiscountPercentage(Math.round(discount));
    } else {
      setDiscountPercentage(0);
    }
  }, [formData.oldPrice, formData.newPrice]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For price fields, only allow numbers and decimal point
    if (name === 'oldPrice' || name === 'newPrice') {
      // Allow empty string or numbers with optional decimal
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    setError('');

    // Validate required fields
    if (!formData.title || !formData.content || !formData.category) {
      setError('Title, content, and category are required');
      return false;
    }

    // Parse prices for validation
    const oldPrice = formData.oldPrice ? parseFloat(formData.oldPrice) : null;
    const newPrice = formData.newPrice ? parseFloat(formData.newPrice) : null;

    // Check if one price is provided without the other
    if (oldPrice !== null && newPrice === null) {
      setError('New price is required when old price is provided');
      return false;
    }

    if (oldPrice !== null && (isNaN(oldPrice) || oldPrice <= 0)) {
      setError('Old price must be a valid number greater than 0');
      return false;
    }

    if (newPrice !== null && (isNaN(newPrice) || newPrice <= 0)) {
      setError('New price must be a valid number greater than 0');
      return false;
    }

    if (oldPrice !== null && newPrice !== null && newPrice >= oldPrice) {
      setError('New price must be less than old price');
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter for images only and limit to 10 files
    const imageFiles = files
      .filter(file => file.type.startsWith('image/'))
      .slice(0, 10 - images.length);

    // Create previews
    const newPreviews = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      id: Math.random().toString(36).substr(2, 9),
      isExisting: false,
      isFeatured: false,
      url: ''
    }));

    setImages(prev => [...prev, ...imageFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = ''; // Reset file input
  };

  const removeImage = (index) => {
    const preview = imagePreviews[index];
    if (!preview.isExisting && preview.preview) {
      URL.revokeObjectURL(preview.preview);
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const setFeaturedImage = (index) => {
    setImagePreviews(prev => 
      prev.map((img, i) => ({
        ...img,
        isFeatured: i === index
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form data
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      
      // Append optional fields
      if (formData.excerpt) submitData.append('excerpt', formData.excerpt);
      if (formData.metaTitle) submitData.append('metaTitle', formData.metaTitle);
      if (formData.metaDescription) submitData.append('metaDescription', formData.metaDescription);
      
      // Always append price fields, even if empty
      submitData.append('oldPrice', formData.oldPrice || '');
      submitData.append('newPrice', formData.newPrice || '');
      
      // Append images
      images.forEach(image => {
        submitData.append('images', image);
      });

      // Append featured image information if any
      const featuredIndex = imagePreviews.findIndex(img => img.isFeatured);
      if (featuredIndex !== -1) {
        submitData.append('featuredImageIndex', featuredIndex.toString());
      }

      console.log('Submitting form data...');
      console.log('Price values:', {
        oldPrice: formData.oldPrice,
        newPrice: formData.newPrice
      });

      // Make API call
      const response = await fetch('/api/post', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok) {
        setSuccess('Post created successfully!');
        // Reset form
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          category: '',
          oldPrice: '',
          newPrice: '',
          metaTitle: '',
          metaDescription: ''
        });
        setImages([]);
        setImagePreviews([]);
        setDiscountPercentage(0);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to create post');
        console.error('API Error details:', result);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }} className="mt-[3rem]">
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Create New Post
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Basic Information
              </Typography>
              
              <Stack spacing={2}>
                <TextField
                  label="Post Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="Enter a compelling title..."
                />
                
                <TextField
                  label="Excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Brief description of the post..."
                  helperText="Will appear in previews and product listings"
                />
                
                <TextField
                  label="Content *"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  multiline
                  rows={12}
                  fullWidth
                  placeholder="Write your post content here..."
                  helperText="Full product description or article content"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <PriceIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Pricing Information
                </Typography>
              </Stack>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add prices to show discounted offers. Leave empty for free content/blog posts.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Old Price"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    fullWidth
                    type="text"
                    placeholder="Original price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography color="text.secondary">₹</Typography>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Leave empty if no discount"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="New Price"
                    name="newPrice"
                    value={formData.newPrice}
                    onChange={handleChange}
                    fullWidth
                    type="text"
                    placeholder="Discounted price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography color="text.secondary">₹</Typography>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Required if old price is entered"
                  />
                </Grid>
              </Grid>

              {/* Discount Display */}
              {discountPercentage > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip
                      icon={<PercentIcon />}
                      label={`${discountPercentage}% OFF`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ₹{parseFloat(formData.oldPrice).toFixed(2)}
                      </Typography>
                      <Typography variant="h6" color="success.dark" sx={{ fontWeight: 'bold' }}>
                        ₹{parseFloat(formData.newPrice).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Save ₹{(parseFloat(formData.oldPrice) - parseFloat(formData.newPrice)).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              )}

              {!formData.oldPrice && !formData.newPrice && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.dark">
                    No prices set. This will be displayed as free content/blog post.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Post Images
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  disabled={imagePreviews.length >= 10}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {imagePreviews.length > 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {imagePreviews.length} image(s) selected. Click on the star icon to set as featured.
                    </Typography>
                    <Grid container spacing={2}>
                      {imagePreviews.map((preview, index) => (
                        <Grid item xs={6} sm={4} md={3} key={preview.id}>
                          <Box
                            sx={{
                              position: 'relative',
                              border: preview.isFeatured ? '3px solid' : '1px solid',
                              borderColor: preview.isFeatured ? 'primary.main' : 'divider',
                              borderRadius: 1,
                              overflow: 'hidden',
                              aspectRatio: '1',
                              '&:hover .image-actions': {
                                opacity: 1
                              }
                            }}
                          >
                            <img
                              src={preview.preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            
                            {/* Image Actions Overlay */}
                            <Box
                              className="image-actions"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                p: 1,
                                opacity: 0,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between">
                                <Tooltip title={preview.isFeatured ? "Featured Image" : "Set as Featured"}>
                                  <IconButton
                                    size="small"
                                    onClick={() => setFeaturedImage(index)}
                                    sx={{
                                      bgcolor: 'background.paper',
                                      '&:hover': {
                                        bgcolor: preview.isFeatured ? 'warning.light' : 'primary.light',
                                        color: preview.isFeatured ? 'warning.contrastText' : 'primary.contrastText'
                                      }
                                    }}
                                  >
                                    {preview.isFeatured ? (
                                      <StarIcon sx={{ color: 'warning.main' }} />
                                    ) : (
                                      <StarBorderIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Remove Image">
                                  <IconButton
                                    size="small"
                                    onClick={() => removeImage(index)}
                                    sx={{
                                      bgcolor: 'background.paper',
                                      color: 'error.main',
                                      '&:hover': {
                                        bgcolor: 'error.main',
                                        color: 'error.contrastText'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                              
                              <Box sx={{ bgcolor: 'rgba(0,0,0,0.8)', p: 0.5, borderRadius: 0.5 }}>
                                <Typography variant="caption" color="white" display="block" noWrap>
                                  New Image
                                </Typography>
                                {preview.name && (
                                  <Typography variant="caption" color="white" display="block" noWrap>
                                    {preview.name}
                                  </Typography>
                                )}
                                {preview.size && (
                                  <Typography variant="caption" color="white" display="block">
                                    {formatFileSize(preview.size)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 4,
                      textAlign: 'center'
                    }}
                  >
                    <AddPhotoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No images uploaded yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload images to showcase your product. Click "Add Images" above.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Categorization */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Categorization
              </Typography>
              
              <Stack spacing={2}>
                <TextField
                  select
                  label="Category *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={loadingCategories}
                  error={!!error && error.includes('category')}
                  SelectProps={{
                    native: true,
                  }}
                  helperText={
                    loadingCategories 
                      ? 'Loading categories...'
                      : categories.length === 0 
                        ? 'No categories found. Please create categories first.'
                        : ''
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Stack>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                SEO Settings
              </Typography>
              
              <Stack spacing={2}>
                <TextField
                  label="Meta Title"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  fullWidth
                  placeholder="SEO title for search engines..."
                  helperText="Optional: Custom title for search engine results"
                />
                
                <TextField
                  label="Meta Description"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="SEO description for search engines..."
                  helperText="Optional: Custom description for search engine results"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  size="large"
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={isSubmitting || loadingCategories || categories.length === 0}
                  size="large"
                  sx={{
                    minWidth: 140
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </form>
    </Box>
  );
};

export default AdminPostForm;