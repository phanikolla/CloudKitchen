import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  deliveryAddress: string;
}

export default function OrderTracking() {
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
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
      <div className="card">
        <p className="text-lg"><strong>Order ID:</strong> {order._id}</p>
        <p className="text-lg"><strong>Status:</strong> {order.status}</p>
        <p className="text-lg"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        <p className="text-lg"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
} 