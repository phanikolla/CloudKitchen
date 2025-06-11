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
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item._id} className="card">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg" />
            <h2 className="text-xl font-semibold mt-2">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
            <button
              className="btn-primary mt-4"
              onClick={() => addItem({ id: item._id, name: item.name, price: item.price, quantity: 1 })}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 