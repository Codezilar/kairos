"use client"
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Categories = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: ''
  });

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell'
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 0.5
          }}
        >
          {params.value ? (
            <Box 
              sx={{ 
                width: 50, 
                height: 50, 
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 1
              }}
            >
              <Image 
                src={params.value} 
                alt="Category" 
                fill
                sizes="50px"
                style={{ 
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          ) : (
            <Box 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: 'grey.100', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 1,
                color: 'grey.500'
              }}
            >
              No Image
            </Box>
          )}
        </Box>
      ),
      sortable: false,
      filterable: false,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell'
    },
    {
      field: 'name',
      headerName: 'Category Name',
      width: 200,
      flex: 1,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.875rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value || 'No description'}
        </Typography>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          size="small" 
          color={params.value ? 'success' : 'default'}
          variant={params.value ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        />
      )
    },
    {
      field: 'postCount',
      headerName: 'Posts',
      width: 100,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Chip 
          label={params.value || 0} 
          size="small" 
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 150,
      type: 'dateTime',
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      valueGetter: (value, row) => new Date(row.createdAt),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton 
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ 
              color: 'primary.main',
              '&:hover': { 
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small"
            onClick={() => handleDelete(params.row._id)}
            disabled={deleteLoading === params.row._id}
            sx={{ 
              color: 'error.main',
              '&:hover': { 
                backgroundColor: 'error.light',
                color: 'white'
              }
            }}
          >
            {deleteLoading === params.row._id ? (
              <CircularProgress size={16} />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>
      ),
      sortable: false,
      filterable: false
    },
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditFormData({
      name: category.name || '',
      description: category.description || '',
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/categories/${currentCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (response.ok) {
        setEditDialogOpen(false);
        fetchCategories(); // Refresh the list
        alert('Category updated successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(categoryId);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(prev => prev.filter(category => category._id !== categoryId));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Failed to update category status. Please try again.');
    }
  };

  // Transform categories for DataGrid
  const rows = categories.map((category, index) => ({
    id: index + 1,
    _id: category._id,
    name: category.name,
    description: category.description,
    image: category.image,
    isActive: category.isActive,
    postCount: category.postCount || 0, // You might want to calculate this from posts
    createdAt: category.createdAt,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription
  }));

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 400,
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading categories...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Categories Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and organize your blog categories
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchCategories}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/catefories')}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                New Category
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchCategories}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Categories Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {categories.length === 0 && !loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              py: 8,
              gap: 2
            }}>
              <Typography variant="h6" color="text.secondary">
                No categories found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get started by creating your first category
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/catefories')}
              >
                Create First Category
              </Button>
            </Box>
          ) : (
            <Box sx={{ 
              height: 600, 
              width: '100%',
              '& .grid-header': {
                backgroundColor: 'grey.50',
                fontWeight: 600,
              },
              '& .grid-cell': {
                borderBottom: '1px solid',
                borderColor: 'grey.200',
              }
            }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'grey.50',
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                  },
                }}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: 'Rows per page:',
                  }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Edit Category
          </Typography>
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Category Name"
                name="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                fullWidth
              />
              
              <TextField
                label="Description"
                name="description"
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
                fullWidth
              />
              
              <TextField
                label="Meta Title"
                name="metaTitle"
                value={editFormData.metaTitle}
                onChange={(e) => setEditFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                fullWidth
              />
              
              <TextField
                label="Meta Description"
                name="metaDescription"
                value={editFormData.metaDescription}
                onChange={(e) => setEditFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                multiline
                rows={2}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setEditDialogOpen(false)}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={<CheckIcon />}
            >
              Update Category
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Categories;