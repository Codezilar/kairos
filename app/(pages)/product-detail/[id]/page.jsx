"use client";
import { Container } from "@/components/Contaner";
import ProductDetail from "@/components/ProductDetail";
import { AppleCardsCarouselDemo } from "@/components/ShowCase";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { addToCart, getCartItemCount } = useCart();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/post/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      const post = data.post;
      
      if (!post) {
        throw new Error('Product not found');
      }
      
      const productData = transformPostToProduct(post);
      setProduct(productData);
      
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
      setProduct(null);
      showAlertMessage(error.message || "Failed to load product", "error");
    } finally {
      setLoading(false);
    }
  };

  // Transform post to product format using actual price fields
  const transformPostToProduct = (post) => {
    console.log('Post data from API:', post); // Debug log
    
    // Check if prices exist (not null/undefined and are valid numbers)
    const oldPrice = post.oldPrice;
    const newPrice = post.newPrice;
    const hasPrice = oldPrice != null && newPrice != null && 
                     !isNaN(oldPrice) && !isNaN(newPrice) && 
                     oldPrice > 0 && newPrice > 0;
    
    console.log('Price check:', { oldPrice, newPrice, hasPrice }); // Debug log
    
    return {
      id: post._id,
      name: post.title,
      price: hasPrice ? newPrice : 0, // Current price (discounted price)
      originalPrice: hasPrice ? oldPrice : undefined, // Original price (only show if discounted)
      description: post.excerpt || post.content?.substring(0, 150) + "...",
      fullDescription: post.content || "Product description not available.",
      images: post.images?.map(img => img.url) || ["/placeholder-image.jpg"],
      inStock: true,
      features: extractFeaturesFromPost(post),
      reviews: generateReviewsForPost(post),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100) + 20,
      category: post.category,
      sku: `POST-${post._id?.substring(0, 8)?.toUpperCase() || 'UNKNOWN'}`,
      tags: getTagsFromPost(post),
      discountPercentage: post.discountPercentage || 0,
      isFree: !hasPrice,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isPublished: post.isPublished || false,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      // Include raw prices for debugging
      _debug: {
        hasPrice,
        oldPrice,
        newPrice
      }
    };
  };

  const extractFeaturesFromPost = (post) => {
    const content = post.content?.toLowerCase() || "";
    const features = [];
    
    if (content.includes("cotton") || content.includes("fabric")) {
      features.push("100% Premium Cotton");
    }
    if (content.includes("wash") || content.includes("care")) {
      features.push("Machine Washable");
    }
    if (content.includes("breath") || content.includes("comfort")) {
      features.push("Breathable Fabric");
    }
    if (content.includes("durable") || content.includes("quality")) {
      features.push("Durable Material");
    }
    if (content.includes("fit") || content.includes("size")) {
      features.push("Perfect Fit");
    }
    if (content.includes("organic") || content.includes("natural")) {
      features.push("Organic Material");
    }
    if (content.includes("sustainable") || content.includes("eco")) {
      features.push("Sustainable Product");
    }
    
    if (features.length === 0) {
      return ["Premium Quality", "Excellent Craftsmanship", "Carefully Curated"];
    }
    
    return features.slice(0, 5);
  };

  const getTagsFromPost = (post) => {
    const content = post.content?.toLowerCase() || "";
    const tags = ["Premium", "Euphoria Journal"];
    
    if (content.includes("new") || content.includes("latest")) {
      tags.push("New Arrival");
    }
    if (content.includes("best") || content.includes("top")) {
      tags.push("Bestseller");
    }
    if (content.includes("sale") || content.includes("discount") || (post.discountPercentage > 0)) {
      tags.push("On Sale");
    }
    if (content.includes("limited") || content.includes("exclusive")) {
      tags.push("Limited Edition");
    }
    
    return tags;
  };

  const generateReviewsForPost = (post) => {
    const baseReviews = [
      {
        author: "John Doe",
        rating: 5,
        text: "Great quality and perfect fit! Exactly as described.",
        date: "2024-01-15"
      },
      {
        author: "Jane Smith",
        rating: 4,
        text: "Good product, arrived quickly. Would recommend.",
        date: "2024-01-10"
      },
      {
        author: "Alex Johnson",
        rating: 5,
        text: "Excellent purchase! Better than expected.",
        date: "2024-01-05"
      },
      {
        author: "Mike Wilson",
        rating: 4,
        text: "Happy with the quality. Good value for money.",
        date: "2023-12-28"
      },
      {
        author: "Sarah Miller",
        rating: 5,
        text: "Beautiful piece from Euphoria Journal. Love it!",
        date: "2024-01-20"
      }
    ];
    
    const shuffled = [...baseReviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!product) {
      showAlertMessage("Product information not available", "error");
      return;
    }
    
    if (!product.inStock) {
      showAlertMessage("This product is currently out of stock", "error");
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      image: product.images[0],
      quantity: quantity,
      inStock: product.inStock,
      maxQuantity: 10,
      sku: product.sku
    };
    
    addToCart(cartItem);
    
    // Show success message
    showAlertMessage(`${quantity} × "${product.name}" added to cart!`, "success");
  };

  // Handle quantity change
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    } else {
      showAlertMessage("Maximum quantity is 10 per order", "info");
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getAlertStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-md w-full p-4 rounded-lg shadow-lg transition-all duration-300 transform";
    
    switch (alertType) {
      case "success":
        return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
      case "info":
        return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case "success":
        return (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "info":
        return (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-[500px] bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <a
              href="/shop"  
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Alert Component */}
      {showAlert && (
        <div className={getAlertStyles()}>
          <div className="flex items-start space-x-3">
            {getAlertIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium">{alertMessage}</p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-lg animate-progress" />
        </div>
      )}

      <ProductDetail 
        product={product} 
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
        onIncrementQuantity={incrementQuantity}
        onDecrementQuantity={decrementQuantity}
      />
      <Container categoryName={product.category} />
      <AppleCardsCarouselDemo />

      {/* Add custom animation for progress bar */}
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </>
  );
}