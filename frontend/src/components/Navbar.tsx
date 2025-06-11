import Link from 'next/link';

const Navbar = () => {
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
          <Link href="/cart" className="hover:text-primary-200">
            Cart
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