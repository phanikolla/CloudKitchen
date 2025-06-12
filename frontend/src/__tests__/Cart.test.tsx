import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../pages/cart';
import { CartItem } from '../store/cartSlice';

jest.mock('../context/CartContext', () => ({
  useCart: jest.fn()
}));

import { useCart } from '../context/CartContext';

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Test Item 1',
    price: 9.99,
    quantity: 2
  },
  {
    id: '2',
    name: 'Test Item 2',
    price: 14.99,
    quantity: 1
  }
];

describe('Cart Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart message when cart is empty', () => {
    (useCart as jest.Mock).mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
    });
    render(<Cart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart items and total when cart has items', () => {
    (useCart as jest.Mock).mockReturnValue({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
    });
    render(<Cart />);
    mockCartItems.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(`$${item.price.toFixed(2)}`)).toBeInTheDocument();
    });
    const total = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    expect(screen.getByText(`Total: $${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('allows updating item quantity', () => {
    const updateQuantity = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity,
    });
    render(<Cart />);
    const quantityInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(quantityInputs[0], { target: { value: '3' } });
    expect(updateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('allows removing items from cart', () => {
    const removeItem = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      items: mockCartItems,
      addItem: jest.fn(),
      removeItem,
      updateQuantity: jest.fn(),
    });
    render(<Cart />);
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);
    expect(removeItem).toHaveBeenCalledWith('1');
  });
}); 