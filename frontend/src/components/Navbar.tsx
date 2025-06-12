import Link from 'next/link';
import { useContext } from 'react';
import { CartContext, CartItem } from '../context/CartContext';

const Navbar = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error('CartContext must be used within a CartProvider');
  }
  const { items } = cartContext;
  const itemCount = items.reduce((total: number, item: CartItem) => total + item.quantity, 0);

  return (
    <nav className="bg-primary-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Spice Story
        </Link>
        <div className="space-x-4">
          <Link href="/menu" className="hover:text-primary-200">
            Menu
          </Link>
          <Link href="/cart" className="hover:text-primary-200 relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/checkout" className="hover:text-primary-200">
            Checkout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 