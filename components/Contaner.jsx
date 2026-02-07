"use client";
import React, { useState, useEffect } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import Link from "next/link";

export function Container({ categoryName }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [categoryName]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/post');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      // Filter posts by category
      const categoryPosts = data.posts?.filter(
        post => post.category === categoryName
      ) || [];
      
      setPosts(categoryPosts.slice(0, 4)); // Get first 4 posts
    } catch (error) {
      console.error('Error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getPostImage = (post) => {
    return post.images?.[0]?.url || "/shoe5.svg";
  };

  // Loading state UI
  const renderLoadingState = () => (
    <div className="flex justify-center">
      <div className="animate-pulse">
        <BackgroundGradient className="flex flex-col items-center rounded-[22px] w-full max-w-[20rem] p-4 sm:p-10 bg-pink-50 dark:bg-zinc-900">
          <div className="w-[400px] h-[400px] bg-gray-200 rounded-md"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mt-4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
          <div className="h-10 bg-gray-200 rounded-full w-32 mt-4"></div>
        </BackgroundGradient>
      </div>
    </div>
  );

  // No posts state UI
  const renderEmptyState = () => (
    <div className="flex justify-center">
      <BackgroundGradient className="flex flex-col items-center rounded-[22px] w-full max-w-[20rem] p-4 sm:p-10 bg-pink-50 dark:bg-zinc-900">
        <img
          src="/shoe5.svg"
          alt="No posts"
          height="400"
          width="400"
          className="object-contain opacity-50"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          No {categoryName} Posts Yet
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
          Check back soon for new {categoryName.toLowerCase()} posts and updates
        </p>
        <button
          onClick={fetchPosts}
          className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800"
        >
          <span>Refresh</span>
        </button>
      </BackgroundGradient>
    </div>
  );

  // Static product card UI (like the shoe example)
  const renderStaticProductCard = () => (
    <div>
      <BackgroundGradient className="flex flex-col items-center rounded-[22px] w-full max-w-[20rem] p-4 sm:p-10 bg-pink-50 dark:bg-zinc-900">
        <img
          src="/shoe5.svg"
          alt="jordans"
          height="400"
          width="400"
          className="object-contain rouded-[10px]"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          Air Jordan 4 Retro Reimagined
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
          February 17, 2024. Your best opportunity to get these.
        </p>
        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span>Buy now </span>
          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
            $100
          </span>
        </button>
      </BackgroundGradient>
    </div>
  );

  // Posts grid UI
  const renderPostsGrid = () => (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-6">
        {categoryName}  
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {posts.map((post) => (
          <div key={post._id} className="transform transition-transform hover:scale-105">
            <Link href={`/product-detail/${post._id}`}>
              <BackgroundGradient className="flex flex-col items-center rounded-[22px] w-full max-w-[20rem] p-4 sm:p-10 bg-pink-50 dark:bg-zinc-900">
                <img
                  src={getPostImage(post)}
                  alt={post.title}
                  height="400"
                  width="400"
                  className="object-contain"
                />
                <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 text-center">
                  {post.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                  {post.content}
                </p>
                <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                  <span>Buy now</span>
                  <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                    →
                  </span>
                </button>
              </BackgroundGradient>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  // Main render logic
  return (
    <div className="contain_wrap">
      <div className='containter_main'>
        {loading ? (
          renderLoadingState()
        ) : posts.length === 0 ? (
          renderEmptyState()
        ) : (
          renderPostsGrid()
        )}
      </div>
    </div>
  );
}

// Alternative version: A static product container component
export function StaticProductContainer() {
  return (
    <div className="contain_wrap">
      <div className='containter_main'>            
        <div className="flex justify-center">
          <div className="transform transition-transform hover:scale-105">
            <BackgroundGradient className="flex flex-col items-center rounded-[22px] w-full max-w-[20rem] p-4 sm:p-10 bg-pink-50 dark:bg-zinc-900">
              <img
                src="/shoe5.svg"
                alt="jordans"
                height="400"
                width="400"
                className="object-contain"
              />
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                Air Jordan 4 Retro Reimagined
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
                February 17, 2024. Your best opportunity to get these.
              </p>
              <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                <span>Buy now </span>
                <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                  $100
                </span>
              </button>
            </BackgroundGradient>
          </div>
        </div>
      </div>
    </div>
  );
}