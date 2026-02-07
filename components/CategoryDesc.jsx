"use client";
// components/CategoryDesc.js
import Image from 'next/image';

const CategoryDesc = ({ category }) => {
  if (!category) return null;
  
  return (
    <div className="category-hero">
      <div className="category-hero-content">
        {category.image && (
          <div className="category-hero-image">
            <Image
              src={category.image}
              alt={category.name}
              width={1200}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="category-hero-overlay">
          <div className="container mx-auto px-4">
            <h1 className="category-hero-title">{category.name}</h1>
            {category.description && (
              <p className="category-hero-description">{category.description}</p>
            )}
            <div className="category-hero-stats">
              <span className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Products</span>
              </span>
              <span className="stat-item">
                <span className="stat-number">4.5</span>
                <span className="stat-label">Avg Rating</span>
              </span>
              <span className="stat-item">
                <span className="stat-number">New</span>
                <span className="stat-label">Arrivals</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDesc;