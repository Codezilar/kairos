"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function Nav() {
  const [active, setActive] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActive, setMobileActive] = useState(null);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);
  const { getCartItemsCount } = useCart();
  const session = null; // Replace with actual session retrieval logic

  // Fetch categories and best sellers on component mount
  useEffect(() => {
    fetchCategories();
    fetchBestSellers();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      // Filter only active categories and take only first 4
      const activeCategories = data.categories?.filter(cat => cat.isActive) || [];
      setCategories(activeCategories.slice(0, 4));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchBestSellers = async () => {
    try {
      setLoadingBestSellers(true);
      const response = await fetch('/api/post?limit=20'); // Fetch more to randomize
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      const posts = data.posts || [];
      
      // Get 4 random posts
      const randomPosts = getRandomPosts(posts, 4);
      setBestSellers(randomPosts);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setBestSellers([]);
    } finally {
      setLoadingBestSellers(false);
    }
  };

  // Helper function to get random posts
  const getRandomPosts = (posts, count) => {
    if (posts.length <= count) return posts;
    
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const toggleMobileSubmenu = (item) => {
    setMobileActive(mobileActive === item ? null : item);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Helper function to truncate description to 15 words max
  const truncateDescription = (text, maxWords = 15) => {
    if (!text) return "Explore our amazing collection";
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Helper function to get post excerpt or content preview
  const getPostDescription = (post) => {
    if (post.excerpt) return post.excerpt;
    if (post.content) {
      // Remove HTML tags and get first 50 words
      const plainText = post.content.replace(/<[^>]*>/g, '');
      return truncateDescription(plainText, 15);
    }
    return "Read this interesting post";
  };

  // Helper function to get post image
  const getPostImage = (post) => {
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }
    // Fallback placeholder images based on category or random
    const placeholders = [
      "https://assets.aceternity.com/demos/algochurn.webp",
      "https://assets.aceternity.com/demos/tailwindmasterkit.webp",
      "https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png",
      "https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  return (
    <div className={cn("fixed top-0 inset-x-0 w-full mx-auto z-50")}>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Menu setActive={setActive}>
          {/* <Image src={'/logo.png'} height={80} width={80} alt="logo" /> */}
          <h1 className="logo">0NE STOP SHOP</h1>
          <div className="relative flex justify-center gap-[2rem] items-center h-[4rem]">
            <Link href={'/'} className="nav_items">
              <h1>Home</h1>
            </Link>
            
            {/* Categories Menu Item */}
            <MenuItem setActive={setActive} active={active} item="Categories">
              {loadingCategories ? (
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex space-x-2 p-3">
                      <div className="w-48 h-32 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  {categories.map((category) => (
                    <div key={category._id} className="flex space-x-2">
                      <a 
                        href={`/category/${category._id}`}
                        className="flex space-x-2 group"
                      >
                        <img
                          src={category.image || "https://assets.aceternity.com/demos/tailwindmasterkit.webp"}
                          width={160}
                          height={100}
                          alt={category.name}
                          className="shrink-0 rounded-md shadow-lg w-48 h-32 object-cover group-hover:scale-105 transition-transform duration-200" />
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-bold mb-1">{category.name}</h4>
                          <p className="text-neutral-100 text-xs max-w-[10rem]">
                            {truncateDescription(category.description)}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                  
                  {/* "See All" Button */}
                  <div className="flex space-x-2">
                    <a 
                      href="/categories"
                      className="flex space-x-2 group"
                    >
                      <div className="w-48 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">+</div>
                          <div className="text-xs font-semibold text-purple-600 mt-2">View All</div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold mb-1 text-purple-600">See All Categories</h4>
                        <p className="text-neutral-100 text-xs max-w-[10rem]">
                          Browse all available categories in our store
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  <div className="flex space-x-2">
                    <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl">📂</div>
                        <div className="text-xs font-semibold mt-2">No Categories</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold mb-1">No Categories</h4>
                      <p className="text-neutral-100 text-xs max-w-[10rem]">
                        Check back later for updates
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </MenuItem>
            
            {/* Best Seller Menu Item */}
            <MenuItem setActive={setActive} active={active} item="Best Seller">
              {loadingBestSellers ? (
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex space-x-2 p-3">
                      <div className="w-48 h-32 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : bestSellers.length > 0 ? (
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  {bestSellers.map((post) => (
                    <div key={post._id} className="flex space-x-2">
                      <a 
                        href={`/product-detail/${post._id}`}
                        className="flex space-x-2 group"
                      >
                        <img
                          src={getPostImage(post)}
                          width={160}
                          height={100}
                          alt={post.title}
                          className="shrink-0 rounded-md shadow-lg w-48 h-32 object-cover group-hover:scale-105 transition-transform duration-200" />
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-bold mb-1">{post.title}</h4>
                          <p className="text-neutral-100 text-xs max-w-[10rem]">
                            {getPostDescription(post)}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                  
                  {/* "See All Posts" Button */}
                  <div className="flex space-x-2">
                    <a 
                      href="#"
                      className="flex space-x-2 group"
                    >
                      <div className="w-48 h-32 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">📚</div>
                          <div className="text-xs font-semibold text-blue-600 mt-2">View All</div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold mb-1 text-blue-600">See All Posts</h4>
                        <p className="text-neutral-100 text-xs max-w-[10rem]">
                          Browse all posts in our blog
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  <div className="flex space-x-2">
                    <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl">📝</div>
                        <div className="text-xs font-semibold mt-2">No Posts</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold mb-1">No Posts Available</h4>
                      <p className="text-neutral-100 text-xs max-w-[10rem]">
                        Check back later for updates
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </MenuItem>
            
            <MenuItem setActive={setActive} active={active} item="Help">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/about">About Us</HoveredLink>
                <HoveredLink href="/contact">Contact Us</HoveredLink>
                <HoveredLink href="/support">Support</HoveredLink>
                <HoveredLink href="/faq">FAQ</HoveredLink>
              </div>
            </MenuItem>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/cart" 
              className="flex items-center gap-1 cursor-pointer relative group p-2 rounded-lg transition-colors"
            >
              <div className="relative">
                <AiOutlineShoppingCart className="text-xl group-hover:scale-110 transition-transform" /> 
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {getCartItemsCount() > 99 ? '99+' : getCartItemsCount()}
                  </span>
                )}
              </div>
              <h1 className="font-medium">Cart</h1>
            </Link>
            
            {/* Conditional Account Menu based on authentication */}
            {session ? (
              // User is logged in - show account menu with sign out
              <MenuItem setActive={setActive} active={active} item="Account">
                <div className="flex flex-col space-y-4 text-sm">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">Welcome,</p>
                    <p className="font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                    {session.user.role === 'admin' && (
                      <Link href={'/dashboard'}>
                        <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Admin
                        </span>
                      </Link>
                    )}
                  </div>
                  <HoveredLink href="/account">My Account</HoveredLink>
                  <HoveredLink href="/orders">My Orders</HoveredLink>
                  <HoveredLink href="/settings">Settings</HoveredLink>
                  <HoveredLink href="/favourites">Favourites</HoveredLink>
                  <HoveredLink href="/addresses">Delivery Addresses</HoveredLink>
                  <HoveredLink href="/billing">Billing Data</HoveredLink>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-red-600 hover:text-red-700 transition-colors px-3 py-2 hover:bg-red-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </MenuItem>
            ) : (
              // User is not logged in - show sign in/sign up options
              <div className="flex items-center gap-3">
                <Link 
                  href="/signin" 
                  className="px-4 py-2 text-gray-100 hover:text-green-300 transition-colors font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </Menu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <nav className="nav">
          <div className="flex justify-between items-center w-full">
            <Image src={'/onestopshop.png'} height={60} width={60} alt="logo" />
            
            <div className="flex items-center gap-4">
              <Link 
                href="/cart" 
                className="flex items-center gap-1 cursor-pointer relative p-2 rounded-lg transition-colors"
              >
                <div className="relative">
                  <AiOutlineShoppingCart className="text-xl" /> 
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-semibold">
                      {getCartItemsCount() > 99 ? '99+' : getCartItemsCount()}
                    </span>
                  )}
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <AiOutlineClose className="text-xl" /> : <AiOutlineMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Slide-in Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Slide-in Menu */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 nav_bg shadow-xl z-50 overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <Image src={'/logo.png'} height={50} width={50} alt="logo" />
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-blue-950 transition-colors"
                    >
                      <AiOutlineClose className="text-lg" />
                    </button>
                  </div>
                  
                  {/* User info if logged in */}
                  {session && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Welcome, {session.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{session.user.email}</p>
                      {session.user.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Home */}
                  <Link 
                    href="/" 
                    className="block py-3 px-4 hover:bg-blue-950 rounded-lg font-medium text-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  {/* Categories */}
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleMobileSubmenu("Categories")}
                      className="w-full flex items-center justify-between py-3 px-4 hover:bg-blue-950 rounded-lg font-medium transition-colors"
                    >
                      <span>Categories</span>
                      <motion.span
                        animate={{ rotate: mobileActive === "Categories" ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {mobileActive === "Categories" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-3"
                        >
                          {loadingCategories ? (
                            <div className="grid grid-cols-1 gap-3 p-2">
                              {[1, 2].map((i) => (
                                <div key={i} className="flex space-x-2 p-3">
                                  <div className="w-24 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                                  <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : categories.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 p-2">
                              {categories.map((category) => (
                                <a 
                                  key={category._id}
                                  href={`/category/${category._id}`}
                                  className="flex space-x-2 p-3 hover:bg-gray-50 rounded-lg"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <img
                                    src={category.image || "https://assets.aceternity.com/demos/tailwindmasterkit.webp"}
                                    width={96}
                                    height={64}
                                    alt={category.name}
                                    className="shrink-0 rounded-md shadow-lg w-24 h-16 object-cover" />
                                  <div>
                                    <h4 className="text-sm font-bold mb-1">{category.name}</h4>
                                    <p className="text-neutral-100 text-xs max-w-[10rem]">
                                      {truncateDescription(category.description, 10)}
                                    </p>
                                  </div>
                                </a>
                              ))}
                              
                              {/* "See All" Button in Mobile */}
                              <a 
                                href="#"
                                className="flex space-x-2 p-3 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="w-24 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-md flex items-center justify-center">
                                  <span className="text-2xl">+</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold mb-1 text-purple-600">See All</h4>
                                  <p className="text-neutral-100 text-xs max-w-[10rem]">
                                    Browse all categories in store
                                  </p>
                                </div>
                              </a>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-3 p-2">
                              <a href="#" className="flex space-x-2 p-3 hover:bg-gray-50 rounded-lg">
                                <div className="w-24 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                  <div className="text-xl">📂</div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold mb-1">No Categories</h4>
                                  <p className="text-neutral-100 text-xs max-w-[10rem]">
                                    Check back later for updates
                                  </p>
                                </div>
                              </a>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Best Seller */}
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleMobileSubmenu("Best Seller")}
                      className="w-full flex items-center justify-between py-3 px-4 hover:bg-blue-950 rounded-lg font-medium transition-colors"
                    >
                      <span>Best Seller</span>
                      <motion.span
                        animate={{ rotate: mobileActive === "Best Seller" ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {mobileActive === "Best Seller" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-3"
                        >
                          {loadingBestSellers ? (
                            <div className="grid grid-cols-1 gap-3 p-2">
                              {[1, 2].map((i) => (
                                <div key={i} className="flex space-x-2 p-3">
                                  <div className="w-24 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                                  <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : bestSellers.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 p-2">
                              {bestSellers.slice(0, 2).map((post) => (
                                <a 
                                  key={post._id}
                                  href={`/product-detail/${post._id}`}
                                  className="flex space-x-2 p-3 hover:bg-gray-50 rounded-lg"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <img
                                    src={getPostImage(post)}
                                    width={96}
                                    height={64}
                                    alt={post.title}
                                    className="shrink-0 rounded-md shadow-lg w-24 h-16 object-cover" />
                                  <div>
                                    <h4 className="text-sm font-bold mb-1">{post.title}</h4>
                                    <p className="text-neutral-100 text-xs max-w-[10rem]">
                                      {truncateDescription(getPostDescription(post), 10)}
                                    </p>
                                  </div>
                                </a>
                              ))}
                              
                              {/* "See All Posts" Button in Mobile */}
                              <a 
                                href="#"
                                className="flex space-x-2 p-3 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="w-24 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-md flex items-center justify-center">
                                  <span className="text-2xl">📚</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold mb-1 text-blue-600">See All Posts</h4>
                                  <p className="text-neutral-100 text-xs max-w-[10rem]">
                                    Browse all blog posts
                                  </p>
                                </div>
                              </a>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-3 p-2">
                              <a href="#" className="flex space-x-2 p-3 hover:bg-gray-50 rounded-lg">
                                <div className="w-24 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                  <div className="text-xl">📝</div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold mb-1">No Posts</h4>
                                  <p className="text-neutral-100 text-xs max-w-[10rem]">
                                    Check back later for updates
                                  </p>
                                </div>
                              </a>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Help */}
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleMobileSubmenu("Help")}
                      className="w-full flex items-center justify-between py-3 px-4 hover:bg-blue-950 rounded-lg font-medium transition-colors"
                    >
                      <span>Help</span>
                      <motion.span
                        animate={{ rotate: mobileActive === "Help" ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {mobileActive === "Help" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-2"
                        >
                          <Link href="/about" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            About Us
                          </Link>
                          <Link href="/contact" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            Contact Us
                          </Link>
                          <Link href="/support" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            Support
                          </Link>
                          <Link href="/faq" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            FAQ
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Authentication Section */}
                  {session ? (
                    // User is logged in - show account menu with sign out
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => toggleMobileSubmenu("Account")}
                        className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                      >
                        <span>Account</span>
                        <motion.span
                          animate={{ rotate: mobileActive === "Account" ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          ▼
                        </motion.span>
                      </button>
                      
                      <AnimatePresence>
                        {mobileActive === "Account" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-2"
                          >
                            <Link href="/account" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                              My Account
                            </Link>
                            <Link href="/orders" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                              My Orders
                            </Link>
                            <Link href="/settings" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                              Settings
                            </Link>
                            <Link href="/favourites" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                              Favourites
                            </Link>
                            <Link href="/addresses" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                              Delivery Addresses
                            </Link>
                            <Link href="/billing" className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                              Billing Data
                            </Link>
                            <button
                              onClick={() => {
                                handleSignOut();
                                setMobileMenuOpen(false);
                              }}
                              className="block w-full text-left py-2 px-4 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            >
                              Sign Out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <Link 
                        href="/signin" 
                        className="block w-full text-center py-3 px-4 border border-gray-300 text-gray-100 rounded-lg hover:bg-blue-950 transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/signup" 
                        className="block w-full text-center py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}