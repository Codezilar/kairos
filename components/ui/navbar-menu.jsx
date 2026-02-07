"use client";
import React from "react";
import { motion } from "motion/react";
import { FaChevronDown } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";


const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children
}) => {
  return (
    <div 
      onMouseEnter={() => setActive(item)}
        className={`relative ${
        (item === "Categories" || item === "Best Seller" || item === "Help") ? "nav_items" : ""
      }`}>
      <div
        transition={{ duration: 0.3 }}
        className="cursor-pointer hover:opacity-[0.9] flex items-center gap-2">
        <h1>
          {item === "Account" ? <FaRegUser /> : null}
        </h1>
        <h1>
          {item} 
        </h1>
        <h1>
          {item === "Account" ? <FaChevronDown /> : null} 
        </h1>
      </div>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}>
          {active === item && (
            <div
              className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                // layoutId ensures smooth animation
                layoutId="active"
                className="bg-pink-100 backdrop-blur-sm rounded-2xl overflow-hidden border shadow-xl">
                <motion.div
                  // layout ensures smooth animation
                  layout
                  className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children
}) => {
  return (
    <nav
      // resets the state
      onMouseLeave={() => setActive(null)}
      className="nav">
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl" />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({
  children,
  ...rest
}) => {
  return (
    <a
      {...rest}
      className="text-neutral-700  hover:text-black ">
      {children}
    </a>
  );
};
