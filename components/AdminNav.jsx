"use client"
import Image from 'next/image';
import React, { useState, useRef } from 'react'
import { CiSearch } from "react-icons/ci";
import { MdOutlineDashboard } from 'react-icons/md';

const AdminNav = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement your search logic here
    }
  };

  const handleKeyDown = (e) => {
    // Focus search on Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
    // Clear search on Escape
    if (e.key === 'Escape') {
      setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  return (
    <div className="dashboard_nav">
      <div className="dashboard_nav_container">
        <form 
          className={`search ${isSearchFocused ? 'focused' : ''}`}
          onSubmit={handleSearch}
        >
          <CiSearch className='text-2xl' />
          <input 
            ref={searchInputRef}
            type="text"
            placeholder='Search or type command...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={handleKeyDown}
          />
          <button 
            type="button"
            onClick={() => {
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
            title="Focus search (Ctrl+K)"
          >
            <MdOutlineDashboard />
            <p>K</p>
          </button>
          
          {/* Keyboard shortcut hint */}
          <div className="search-hint">
            <kbd>Ctrl</kbd>
            <span>+</span>
            <kbd>K</kbd>
          </div>
        </form>
        
        <div className="user-menu">
          <Image 
            src={'/onestopshop.png'} 
            alt={'Admin Profile'} 
            height={50} 
            width={50} 
            className="user-avatar"
          />
          {/* Optional notification badge */}
          <span className="notification-badge">3</span>
          
          {/* Optional dropdown menu */}
          <div className="user-dropdown">
            <a href="/profile" className="user-dropdown-item">
              <MdOutlineDashboard />
              <span>Profile</span>
            </a>
            <a href="/settings" className="user-dropdown-item">
              <MdOutlineDashboard />
              <span>Settings</span>
            </a>
            <a href="/logout" className="user-dropdown-item">
              <MdOutlineDashboard />
              <span>Logout</span>
            </a>
          </div>
        </div>
        
        {/* Optional breadcrumbs */}
        <div className="breadcrumbs">
          <span>Dashboard</span>
          <span className="breadcrumbs-separator">/</span>
          <span className="current-page">Overview</span>
        </div>
      </div>
    </div>
  )
}

export default AdminNav;