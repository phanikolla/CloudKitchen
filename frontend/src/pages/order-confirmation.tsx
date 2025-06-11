import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface OrderItem {
  menuItem: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  customerName: string;
  deliveryAddress: string;
  createdAt: string;
}

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
      <div className="card">
        <p className="text-lg"><strong>Order ID:</strong> {order._id}</p>
        <p className="text-lg"><strong>Status:</strong> {order.status}</p>
        <p className="text-lg"><strong>Customer:</strong> {order.customerName}</p>
        <p className="text-lg"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        <p className="text-lg"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <h2 className="text-xl font-semibold mt-4">Order Items</h2>
        <ul className="mt-2">
          {order.items.map((item, index) => (
            <li key={index} className="text-lg">
              {item.menuItem.name} x {item.quantity} - ${(item.menuItem.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="text-2xl font-bold mt-4">Total: ${order.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
} 