import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function Checkout() {
  const { items } = useCart();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    deliveryAddress: '',
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.error('Stripe failed to load');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('Card element not found');
      return;
    }

    // Here you would typically create a payment intent on the backend
    // and redirect to Stripe Checkout
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, total }),
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.customerName,
          email: formData.customerEmail,
        },
      },
    });

    if (result.error) {
      console.error(result.error);
    } else {
      // Redirect to order confirmation page
      router.push('/order-confirmation');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="customerName" className="block text-gray-700">Name</label>
          <input id="customerName" name="customerName" type="text" className="input" value={formData.customerName} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="customerEmail" className="block text-gray-700">Email</label>
          <input id="customerEmail" name="customerEmail" type="email" className="input" value={formData.customerEmail} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="deliveryAddress" className="block text-gray-700">Delivery Address</label>
          <textarea id="deliveryAddress" name="deliveryAddress" className="input" value={formData.deliveryAddress} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="cardElement" className="block text-gray-700">Card Details</label>
          <div id="cardElement" className="input"><CardElement /></div>
        </div>
        <div className="mb-4">
          <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>
        <button type="submit" className="btn-primary w-full">
          Place Order
        </button>
      </form>
    </div>
  );
} 