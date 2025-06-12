import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } };

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  console.log('Cart Reducer - Current State:', state);
  console.log('Cart Reducer - Action:', action);

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        const newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        console.log('Cart Reducer - Updated State (existing item):', newState);
        return newState;
      }
      const newState = [...state, action.payload];
      console.log('Cart Reducer - Updated State (new item):', newState);
      return newState;
    }
    case 'REMOVE_ITEM': {
      const newState = state.filter(item => item.id !== action.payload);
      console.log('Cart Reducer - Updated State (removed item):', newState);
      return newState;
    }
    case 'UPDATE_QUANTITY': {
      const newState = state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      console.log('Cart Reducer - Updated State (updated quantity):', newState);
      return newState;
    }
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Debug log for cart state changes
  useEffect(() => {
    console.log('CartProvider - Cart state updated:', items);
  }, [items]);

  const addItem = (item: CartItem) => {
    console.log('CartProvider - Adding item:', item);
    try {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        throw new Error('Invalid cart item data');
      }
      dispatch({ type: 'ADD_ITEM', payload: item });
      console.log('CartProvider - Item added successfully');
    } catch (error) {
      console.error('CartProvider - Error adding item:', error);
    }
  };

  const removeItem = (id: string) => {
    console.log('CartProvider - Removing item:', id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('CartProvider - Updating quantity:', { id, quantity });
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity
  };

  console.log('CartProvider - Rendering with items:', items);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 