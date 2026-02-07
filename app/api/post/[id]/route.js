import connectDB from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// GET single post
export async function GET(request, { params }) {
  try {
    // FIX: Await the params promise
    const { id } = await params;

    await connectDB();

    const post = await Post.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Convert to object and add discount percentage
    const postObj = post.toObject();
    let discountPercentage = 0;
    
    if (postObj.oldPrice && postObj.newPrice && postObj.oldPrice > postObj.newPrice) {
      discountPercentage = Math.round(
        ((postObj.oldPrice - postObj.newPrice) / postObj.oldPrice) * 100
      );
    }
    
    const postWithDiscount = {
      ...postObj,
      discountPercentage
    };

    return NextResponse.json({ post: postWithDiscount }, { status: 200 });
  } catch (error) {
    console.error('Fetch post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE post
export async function PUT(request, { params }) {
  try {
    // FIX: Await the params promise
    const { id } = await params;
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt') || '';
    const category = formData.get('category');
    
    // Extract price fields
    const oldPriceStr = formData.get('oldPrice') || '';
    const newPriceStr = formData.get('newPrice') || '';
    
    // Convert to numbers if they exist and are valid
    let oldPrice = undefined;
    let newPrice = undefined;
    
    if (oldPriceStr !== '') {
      oldPrice = !isNaN(parseFloat(oldPriceStr)) ? parseFloat(oldPriceStr) : undefined;
    }
    
    if (newPriceStr !== '') {
      newPrice = !isNaN(parseFloat(newPriceStr)) ? parseFloat(newPriceStr) : undefined;
    }
    
    const metaTitle = formData.get('metaTitle') || '';
    const metaDescription = formData.get('metaDescription') || '';
    const existingImages = formData.getAll('existingImages');

    // Basic validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Price validation
    if (oldPrice !== undefined && newPrice === undefined) {
      return NextResponse.json(
        { error: 'New price is required when old price is provided' },
        { status: 400 }
      );
    }

    if (oldPrice !== undefined && oldPrice <= 0) {
      return NextResponse.json(
        { error: 'Old price must be greater than 0' },
        { status: 400 }
      );
    }

    if (newPrice !== undefined && newPrice <= 0) {
      return NextResponse.json(
        { error: 'New price must be greater than 0' },
        { status: 400 }
      );
    }

    if (oldPrice !== undefined && newPrice !== undefined && newPrice >= oldPrice) {
      return NextResponse.json(
        { error: 'New price must be less than old price' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find existing post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Handle images - keep existing ones that are specified
    let updatedImages = existingPost.images.filter(img => 
      existingImages.includes(img.publicId)
    );

    // Upload new images to Cloudinary
    const imageFiles = formData.getAll('images');
    const newUploadedImages = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        if (imageFile instanceof Blob && imageFile.size > 0) {
          try {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'posts',
                  resource_type: 'image',
                  quality: 'auto',
                  fetch_format: 'auto',
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              
              uploadStream.end(buffer);
            });

            newUploadedImages.push({
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              altText: '',
              isFeatured: false
            });

          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            continue;
          }
        }
      }
    }

    // Combine existing and new images
    const allImages = [...updatedImages, ...newUploadedImages];
    
    // Set first image as featured if no featured image exists
    if (allImages.length > 0 && !allImages.some(img => img.isFeatured)) {
      allImages[0].isFeatured = true;
    }

    // Delete removed images from Cloudinary
    const removedImages = existingPost.images.filter(img => 
      !existingImages.includes(img.publicId)
    );

    for (const removedImage of removedImages) {
      if (removedImage.publicId) {
        try {
          await cloudinary.uploader.destroy(removedImage.publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting image from Cloudinary:', cloudinaryError);
        }
      }
    }

    // Prepare update object
    const updateData = {
      title: title.trim(),
      content,
      excerpt: excerpt.trim(),
      category,
      images: allImages,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
    };

    // Add price fields if they exist
    if (oldPrice !== undefined) {
      updateData.oldPrice = oldPrice;
    } else if (oldPriceStr === '') {
      // If oldPrice is empty string, set to undefined
      updateData.oldPrice = undefined;
    }
    
    if (newPrice !== undefined) {
      updateData.newPrice = newPrice;
    } else if (newPriceStr === '') {
      // If newPrice is empty string, set to undefined
      updateData.newPrice = undefined;
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { 
        message: 'Post updated successfully', 
        post: updatedPost 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Post update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with similar title already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  try {
    // FIX: Await the params promise
    const { id } = await params;

    await connectDB();

    // Find the post first to get image public IDs
    const post = await Post.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        if (image.publicId) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    // Delete the post from database
    await Post.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}