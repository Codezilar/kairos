"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import CategoryDesc from '@/components/CategoryDesc'
import { Container } from '@/components/Contaner'
import { ForYou } from '@/components/ForYou'
import { Grid } from '@/components/Grid'
import { Nav } from '@/components/Nav'
import { AppleCardsCarouselDemo } from '@/components/ShowCase'
import Image from 'next/image'

const CategoryPage = () => {
  const params = useParams();
  const categoryId = params.id; // Get category ID from URL
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch category details by ID
      const response = await fetch(`/api/categories/${categoryId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      
      const data = await response.json();
      setCategory(data.category);
      
    } catch (error) {
      console.error('Error fetching category:', error);
      setError(error.message);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='category'>
        <div className="animate-pulse">
          <div className="h-64 w-full bg-gray-200 mb-8"></div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-10 w-full bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 w-full bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className='category'>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-8">
            {error || "The category you're looking for doesn't exist."}
          </p>
          <a
            href="/shop"  
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Browse All Categories
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='category'>
        <CategoryDesc category={category} />
        <div className='category_container'>
            <Container categoryName={category.name} />
            <ForYou />
            <AppleCardsCarouselDemo />
        </div>
    </div>
  )
}

export default CategoryPage