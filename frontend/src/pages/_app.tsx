import type { AppProps } from 'next/app';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Only initialize Stripe if we have a publishable key
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <Navbar />
          <Component {...pageProps} />
        </Elements>
      ) : (
        <>
          <Navbar />
          <Component {...pageProps} />
        </>
      )}
    </CartProvider>
  );
}

export default MyApp; 