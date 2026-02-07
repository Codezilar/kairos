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
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const List = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

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
                alt="Post" 
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
              <ViewIcon fontSize="small" />
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
      field: 'title',
      headerName: 'Title',
      width: 280,
      flex: 1,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 200,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      valueGetter: (value, row) => row.tags ? row.tags.join(', ') : '',
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
          {params.value}
        </Typography>
      )
    },
    {
      field: 'isPublished',
      headerName: 'Status',
      width: 120,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Published' : 'Draft'} 
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
      field: 'publishedAt',
      headerName: 'Published',
      width: 120,
      type: 'dateTime',
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      valueGetter: (value, row) => row.publishedAt ? new Date(row.publishedAt) : null,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      headerClassName: 'grid-header',
      cellClassName: 'grid-cell',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton 
            size="small"
            onClick={() => handleEdit(params.row._id)}
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
            onClick={() => handleView(params.row.slug)}
            sx={{ 
              color: 'info.main',
              '&:hover': { 
                backgroundColor: 'info.light',
                color: 'white'
              }
            }}
          >
            <ViewIcon fontSize="small" />
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/post');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (postId) => {
    router.push(`/post/edit/${postId}`);
  };

  const handleView = (slug) => {
    if (slug) {
      window.open(`/blog/${slug}`, '_blank');
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(postId);
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prev => prev.filter(post => post._id !== postId));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Transform posts for DataGrid
  const rows = posts.map((post, index) => ({
    id: index + 1,
    _id: post._id,
    title: post.title,
    category: post.category,
    tags: post.tags,
    slug: post.slug,
    image: post.images && post.images.length > 0 ? post.images[0].url : null,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt
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
          Loading posts...
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
                Posts Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and organize your blog posts
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchPosts}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/post')}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                New Post
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
              onClick={fetchPosts}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Posts Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {posts.length === 0 && !loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              py: 8,
              gap: 2
            }}>
              <Typography variant="h6" color="text.secondary">
                No posts found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get started by creating your first post
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/admin/posts/create')}
              >
                Create First Post
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
    </Box>
  );
};

export default List;