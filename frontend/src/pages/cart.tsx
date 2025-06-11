import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 input"
                  />
                  <button
                    className="btn-secondary"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
            <Link href="/checkout" className="btn-primary mt-4 inline-block">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 