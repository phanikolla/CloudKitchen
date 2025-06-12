import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import Checkout from '../pages/checkout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

const stripePromise = loadStripe('pk_test_dummy');

describe('Checkout Component', () => {
  const renderCheckout = () => {
    return render(
      <Elements stripe={stripePromise}>
        <CartProvider>
          <Checkout />
        </CartProvider>
      </Elements>
    );
  };

  it('renders checkout form with all required fields', () => {
    renderCheckout();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });

  it('allows input changes for form fields', () => {
    renderCheckout();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Test St' } });
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/address/i)).toHaveValue('123 Test St');
  });
}); 