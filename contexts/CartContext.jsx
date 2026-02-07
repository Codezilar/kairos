// contexts/CartContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productOrItem, selectedColor, selectedSize, quantity) => {
    // Support calling addToCart in two ways:
    // 1) addToCart(product, selectedColor, selectedSize, quantity)
    // 2) addToCart(cartItem) where cartItem already contains final fields

    // If caller passed a fully-formed cart item (has productId or explicit quantity), use it
    if (productOrItem && (productOrItem.productId || (productOrItem.id && productOrItem.quantity))) {
      const incoming = productOrItem;

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === incoming.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === incoming.id
              ? { ...item, quantity: item.quantity + (incoming.quantity || 1) }
              : item
          );
        }
        return [...prevItems, incoming];
      });

      return;
    }

    // Otherwise treat the first argument as a product object and build a cart item
    const product = productOrItem || {};
    const safeImage = (product.images && product.images.length > 0)
      ? product.images[0]
      : (product.image || '/1.jpg');

    const color = selectedColor || null;
    const size = selectedSize || null;
    const qty = typeof quantity === 'number' ? quantity : 1;

    const cartItem = {
      id: `${product.id || product._id || 'unknown'}-${color}-${size}`,
      productId: product.id || product._id || null,
      name: product.name || product.title || 'Unknown Product',
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      image: safeImage,
      color,
      size,
      quantity: qty,
      inStock: product.inStock !== undefined ? product.inStock : true
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};