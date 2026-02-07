import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Post } from "@/models/Post"

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt') || '';
    const category = formData.get('category');
    
    // Extract price fields - FIXED: Get as strings then convert
    const oldPriceStr = formData.get('oldPrice');
    const newPriceStr = formData.get('newPrice');
    
    console.log('Received price strings:', { oldPriceStr, newPriceStr });
    
    // Convert to numbers if they exist and are not empty strings
    let oldPrice, newPrice;
    
    if (oldPriceStr && oldPriceStr.trim() !== '') {
      const parsed = parseFloat(oldPriceStr);
      oldPrice = !isNaN(parsed) ? parsed : undefined;
    }
    
    if (newPriceStr && newPriceStr.trim() !== '') {
      const parsed = parseFloat(newPriceStr);
      newPrice = !isNaN(parsed) ? parsed : undefined;
    }
    
    console.log('Parsed prices:', { oldPrice, newPrice });
    
    const metaTitle = formData.get('metaTitle') || '';
    const metaDescription = formData.get('metaDescription') || '';

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

    if (oldPrice !== undefined) {
      if (oldPrice <= 0) {
        return NextResponse.json(
          { error: 'Old price must be greater than 0' },
          { status: 400 }
        );
      }
    }

    if (newPrice !== undefined) {
      if (newPrice <= 0) {
        return NextResponse.json(
          { error: 'New price must be greater than 0' },
          { status: 400 }
        );
      }
    }

    if (oldPrice !== undefined && newPrice !== undefined) {
      if (newPrice >= oldPrice) {
        return NextResponse.json(
          { error: 'New price must be less than old price' },
          { status: 400 }
        );
      }
    }

    // Connect to database
    await connectDB();

    // Upload multiple images to Cloudinary
    const uploadedImages = [];
    const imageFiles = formData.getAll('images');

    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        if (imageFile instanceof Blob && imageFile.size > 0) {
          try {
            // Convert the file to buffer
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to Cloudinary
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

            uploadedImages.push({
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              altText: '',
              isFeatured: uploadedImages.length === 0 // First image as featured
            });

          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            // Continue with other images even if one fails
            continue;
          }
        }
      }
    }

    // Create new post with ALL fields
    const postData = {
      title: title.trim(),
      content,
      excerpt: excerpt.trim(),
      category,
      images: uploadedImages,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      isPublished: true, // Auto-publish posts
      publishedAt: new Date(),
    };

    // Add price fields only if they exist
    if (oldPrice !== undefined) {
      postData.oldPrice = oldPrice;
    }
    
    if (newPrice !== undefined) {
      postData.newPrice = newPrice;
    }

    console.log('Creating post with data:', postData);

    const newPost = new Post(postData);
    await newPost.save();

    return NextResponse.json(
      { 
        message: 'Post created successfully', 
        post: newPost 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Post creation error:', error);
    
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

// GET all posts - Updated to include price fields
export async function GET() {
  try {
    await connectDB();
    
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .select('title category oldPrice newPrice publishedAt images isPublished');
    
    // Add discount percentage to each post
    const postsWithDiscount = posts.map(post => {
      const postObj = post.toObject();
      let discountPercentage = 0;
      
      if (postObj.oldPrice && postObj.newPrice && postObj.oldPrice > postObj.newPrice) {
        discountPercentage = Math.round(
          ((postObj.oldPrice - postObj.newPrice) / postObj.oldPrice) * 100
        );
      }
      
      return {
        ...postObj,
        discountPercentage
      };
    });
    
    return NextResponse.json({ posts: postsWithDiscount }, { status: 200 });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}