import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductForm from '../../components/products/ProductForm';
export default function CreateProduct() {
  const router = useRouter();
  const onSubmit = data => {
    fetch('/api/products', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) })
      .then(() => router.push('/products'));
  };
  return (
    <>
      <Head><title>Create Product</title></Head>
      <main className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <ProductForm onSubmit={onSubmit} />
      </main>
    </>
  );
}