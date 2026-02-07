"use client";
import { useState } from "react";
import { Star, ShoppingCart, Heart, Share2, Plus, Minus } from "lucide-react";

export default function ProductDetail({ product, quantity, setQuantity, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(10, prev + 1));
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      alert(`❤️ Added to wishlist!`);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen mt-[7rem] bg-gray-50 py-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-purple-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <span className="text-sm text-purple-600 font-semibold">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                  {product.name}
                </h1>
                
                {/* Rating - Simplified */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current text-gray-300" />
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Pricing - Simplified */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-2xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Features - Simplified */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Total - SIMPLIFIED */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Quantity:</h3>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Total Price */}
                <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-700">Total:</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                {/* Action Buttons - ALWAYS ACTIVE */}
                <div className="flex gap-3">
                  <button
                    onClick={onAddToCart}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={handleWishlist}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Tags - Simplified */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}