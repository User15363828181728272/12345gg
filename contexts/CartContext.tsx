
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Package, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (pkg: Package) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  lastAddedItem: string | null;
  setLastAddedItem: (val: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const addToCart = (pkg: Package) => {
    const newItem: CartItem = {
      ...pkg,
      cartId: Math.random().toString(36).substring(7),
    };
    setItems((prev) => [...prev, newItem]);
    setLastAddedItem(`${pkg.ram}GB RAM`);
  };

  const removeFromCart = (cartId: string) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalPrice, lastAddedItem, setLastAddedItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
