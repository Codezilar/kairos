"use client";

import React, { useState, useEffect } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      // Filter only active categories
      const activeCategories = data.categories?.filter(cat => cat.isActive) || [];
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate carousel data from ALL categories
  const generateCarouselData = () => {
    if (categories.length === 0) {
      return fallbackData;
    }
    
    return categories.map((category, index) => ({
      category: category.name,
      title: category.description 
        ? truncateText(category.description, 50) 
        : `Explore our ${category.name} collection`,
      src: category.image || getPlaceholderImage(index),
      content: <CategoryContent category={category} index={index} />,
      id: category._id,
      slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  };

  const getPlaceholderImage = (index) => {
    const placeholders = [
      "/6.jpg",
      "/7.jpg",
      "/8.jpg",
      "/9.jpg",
      "/10.jpg",
      "/11.jpg",
    ];
    return placeholders[index % placeholders.length];
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const cardsData = loading ? fallbackData : generateCarouselData();
  
  const cards = cardsData.map((card, index) => (
    <Card key={card.id || `card-${index}`} card={card} index={card.id } layout={true} />
  ));

  if (error) {
    return (
      <div className="w-full h-full py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-8">
            Our Categories
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
            <p className="text-red-600 text-lg mb-4">Failed to load categories</p>
            <button
              onClick={fetchCategories}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (index) => {
    const icons = ["📁", "📱", "🏠", "💄", "⚽", "📚", "👕", "👟", "👜", "💎", "🎧", "🖥️"];
    return icons[index % icons.length];
  };

  const getCategoryColor = (index) => {
    const colors = [
      "from-purple-100 to-pink-100",
      "from-blue-100 to-cyan-100",
      "from-green-100 to-emerald-100",
      "from-yellow-100 to-orange-100",
      "from-red-100 to-pink-100",
      "from-indigo-100 to-purple-100",
      "from-teal-100 to-green-100",
      "from-orange-100 to-red-100",
      "from-cyan-100 to-blue-100",
      "from-pink-100 to-rose-100",
      "from-emerald-100 to-teal-100",
      "from-violet-100 to-purple-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full h-full py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-200 font-sans mb-4">
          Our Categories
        </h2>
        {categories.length > 0 && !loading && (
          <p className="text-neutral-400 text-lg mb-8">
            Explore all {categories.length} categories in our store
          </p>
        )}
      </div>
      
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-3xl p-8 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : cardsData.length > 0 ? (
        <>
          <Carousel items={cards} />
          {categories.length > 6 && (
            <div className="max-w-7xl mx-auto px-4 mt-12 text-center">
              <p className="text-neutral-400 mb-4">
                Showing {cardsData.length} of {categories.length} categories
              </p>
              <a
                href="/categories"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl"
              >
                View All Categories
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-gray-50 rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">📂</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">No Categories Available</h3>
            <p className="text-neutral-600 mb-8">
              There are no categories to display at the moment. Please check back later.
            </p>
            <button
              onClick={fetchCategories}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Category-specific content component
const CategoryContent = ({ category, index }) => {
  const getCategoryIcon = (idx) => {
    const icons = ["📁", "📱", "🏠", "💄", "⚽", "📚", "👕", "👟", "👜", "💎", "🎧", "🖥️"];
    return icons[idx % icons.length];
  };

  const getCategoryColor = (idx) => {
    const colors = [
      "from-purple-100 to-pink-100",
      "from-blue-100 to-cyan-100",
      "from-green-100 to-emerald-100",
      "from-yellow-100 to-orange-100",
      "from-red-100 to-pink-100",
      "from-indigo-100 to-purple-100",
      "from-teal-100 to-green-100",
      "from-orange-100 to-red-100",
      "from-cyan-100 to-blue-100",
      "from-pink-100 to-rose-100",
      "from-emerald-100 to-teal-100",
      "from-violet-100 to-purple-100",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="p-8 md:p-14 rounded-3xl mb-4">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor(index)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <span className="text-3xl">{getCategoryIcon(index)}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-100 mb-2">
            {category.name}
          </h3>
          <p className="text-neutral-100 text-lg">
            {category.description || "Explore our amazing collection of products in this category."}
          </p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600">✓</span>
            </div>
            <h4 className="font-semibold text-neutral-800">Quality</h4>
          </div>
          <p className="text-sm text-neutral-600">Premium quality products</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600">⚡</span>
            </div>
            <h4 className="font-semibold text-neutral-800">Trending</h4>
          </div>
          <p className="text-sm text-neutral-600">Latest styles & trends</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600">💰</span>
            </div>
            <h4 className="font-semibold text-neutral-800">Value</h4>
          </div>
          <p className="text-sm text-neutral-600">Best value for money</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-yellow-600">🚚</span>
            </div>
            <h4 className="font-semibold text-neutral-800">Delivery</h4>
          </div>
          <p className="text-sm text-neutral-600">Fast & free shipping</p>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <p className="text-neutral-600 mb-2">Ready to explore?</p>
            <h4 className="text-xl font-bold text-neutral-800">Shop {category.name} now</h4>
          </div>
          <a
            href={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Shop Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Fallback data in case no categories are available
const fallbackData = [
  {
    category: "Fashion",
    title: "Discover the latest trends in fashion and style",
    src: "/6.jpg",
    content: <CategoryContent category={{ name: "Fashion", description: "Latest fashion trends and styles" }} index={0} />,
    id: "fallback-1",
  },
  {
    category: "Electronics",
    title: "Cutting-edge electronics and gadgets for modern living",
    src: "/7.jpg",
    content: <CategoryContent category={{ name: "Electronics", description: "Latest gadgets and electronic devices" }} index={1} />,
    id: "fallback-2",
  },
  {
    category: "Home & Living",
    title: "Transform your living space with our home collection",
    src: "/8.jpg",
    content: <CategoryContent category={{ name: "Home & Living", description: "Home decor and living essentials" }} index={2} />,
    id: "fallback-3",
  },
  {
    category: "Beauty",
    title: "Premium beauty products for your skincare routine",
    src: "/9.jpg",
    content: <CategoryContent category={{ name: "Beauty", description: "Skincare and beauty products" }} index={3} />,
    id: "fallback-4",
  },
  {
    category: "Sports",
    title: "Gear up for your next adventure with sports equipment",
    src: "/10.jpg",
    content: <CategoryContent category={{ name: "Sports", description: "Sports equipment and accessories" }} index={4} />,
    id: "fallback-5",
  },
  {
    category: "Books",
    title: "Expand your mind with our collection of books",
    src: "/11.jpg",
    content: <CategoryContent category={{ name: "Books", description: "Books and educational materials" }} index={5} />,
    id: "fallback-6",
  },
];