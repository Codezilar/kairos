"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { LuGrid2X2Plus } from "react-icons/lu";
import { VscTypeHierarchy } from "react-icons/vsc";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { HiMenu, HiTemplate, HiX } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SideBr = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: <MdOutlineDashboard />,
      label: 'Dashboard',
      badge: null
    },
    {
      href: '/post',
      icon: <LuGrid2X2Plus />,
      label: 'Create Post',
      badge: null
    },
    {
      href: '/catefories',
      icon: <VscTypeHierarchy />,
      label: 'Create Category',
      badge: null
    },
    {
      href: '/product',
      icon: <MdOutlineProductionQuantityLimits />,
      label: 'Manage Products',
      badge: '5'
    },
    {
      href: '/categories-list',
      icon: <HiTemplate />,
      label: 'Manage Categories',
      badge: null
    },
    {
      href: '/orders',
      icon: <FaShippingFast />,
      label: 'Orders',
      badge: '12'
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="mobile-overlay active" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`sideBar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sideBar_wrapp">
          {/* Collapse Toggle */}
          <button 
            className="sideBar_toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>

          <h1 className='logo'>One Stop Shop</h1>
          
          <div className="sideBar_container">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <span data-tooltip={collapsed ? item.label : undefined}>
                  {item.icon}
                  <h2>{item.label}</h2>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </span>
              </Link>
            ))}
            
            {/* Optional Separator */}  
            <div className="separator"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBr;