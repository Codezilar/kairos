import connectDB from '@/lib/mongodb';
import { Category } from '@/models/Category'; // Use named import
import { NextResponse } from 'next/server';

// GET single category
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error('Fetch category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE category
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    await connectDB();

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check for duplicate name (excluding current category)
    if (data.name && data.name.trim() !== existingCategory.name) {
      const duplicateCategory = await Category.findOne({ 
        name: data.name.trim(),
        _id: { $ne: id }
      });
      
      if (duplicateCategory) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: data.name ? data.name.trim() : existingCategory.name,
        description: data.description || existingCategory.description,
        metaTitle: data.metaTitle || existingCategory.metaTitle,
        metaDescription: data.metaDescription || existingCategory.metaDescription,
        isActive: data.isActive !== undefined ? data.isActive : existingCategory.isActive,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { 
        message: 'Category updated successfully', 
        category: updatedCategory 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Category update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}