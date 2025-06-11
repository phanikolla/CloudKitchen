import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <Navbar />
          <Component {...pageProps} />
        </Elements>
      </CartProvider>
    </Provider>
  );
}

export default MyApp; 