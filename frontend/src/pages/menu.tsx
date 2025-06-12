import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cart = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Menu - Fetching menu items...');
        const response = await axios.get('http://localhost:5000/api/menu');
        console.log('Menu - Received menu items:', response.data);
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          console.error('Menu - Invalid response format:', response.data);
          setError('Invalid menu data received');
        }
      } catch (error) {
        console.error('Menu - Error fetching menu items:', error);
        setError('Failed to load menu items');
      }
    };
    fetchMenuItems();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    alert('Add to Cart clicked!'); // Basic test
    console.log('Menu - handleAddToCart called with item:', item);
    try {
      if (!item._id || !item.name || typeof item.price !== 'number') {
        throw new Error('Invalid item data');
      }
      const cartItem = { 
        id: item._id, 
        name: item.name, 
        price: item.price, 
        quantity: 1 
      };
      console.log('Menu - Attempting to add item to cart:', cartItem);
      cart.addItem(cartItem);
      console.log('Menu - Item added to cart successfully');
    } catch (error) {
      console.error('Menu - Error adding item to cart:', error);
      setError('Failed to add item to cart');
    }
  };

  // Debug log for cart state
  useEffect(() => {
    console.log('Menu - Current cart state:', cart.items);
  }, [cart.items]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      {menuItems.length === 0 ? (
        <div>Loading menu items...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item._id} className="card p-4 border rounded-lg shadow">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg" />
              <h2 className="text-xl font-semibold mt-2">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
              <button
                type="button"
                className="btn-primary mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => {
                  alert('Button clicked!'); // Basic test
                  handleAddToCart(item);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 