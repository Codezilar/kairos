import connectDB from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const metaTitle = formData.get('metaTitle') || '';
    const metaDescription = formData.get('metaDescription') || '';
    const imageFile = formData.get('image');

    // Basic validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check for existing category
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    let imageData = {
      url: '',
      publicId: ''
    };

    // Upload image to Cloudinary if provided
    if (imageFile && imageFile instanceof Blob) {
      try {
        // Convert the file to buffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'categories',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          uploadStream.end(buffer);
        });

        imageData = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };

      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create new category
    const newCategory = new Category({
      name: name.trim(),
      description,
      metaTitle,
      metaDescription,
      image: imageData.url,
      imagePublicId: imageData.publicId, // Store public_id for future operations
      isActive: true,
    });

    await newCategory.save();

    return NextResponse.json(
      { 
        message: 'Category created successfully', 
        category: newCategory 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET all categories (for listing) - remains the same
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}