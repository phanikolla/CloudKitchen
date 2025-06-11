import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Spice Story | Authentic. Fresh. Delivered</title>
        <meta name="description" content="Order authentic, fresh food delivered to your door." />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-2 text-primary-700">Spice Story</h1>
        <p className="text-lg mb-8 text-secondary-700">Authentic. Fresh. Delivered.</p>
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Menu items will be rendered here */}
          <div className="card flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sample Dish</h2>
            <p className="text-gray-600 mb-2">$12.99</p>
            <button className="btn-primary">Add to Cart</button>
          </div>
        </div>
      </main>
    </>
  );
} 