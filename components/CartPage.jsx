// components/CartPage.js
"use client"
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getCartItemsCount 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link 
              href="/"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart ({getCartItemsCount()} items)</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="border-b last:border-b-0">
              <div className="p-6 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <div className="text-gray-600 text-sm mt-1">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.size && <span className="ml-4">Size: {item.size}</span>}
                  </div>
                  <div className="text-lg font-bold text-green-600 mt-1">
                    ${item.price}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Link
              href="/"
              className="flex-1 text-center bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
            >
              Continue Shopping
            </Link>
            <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;