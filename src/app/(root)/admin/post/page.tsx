import ProductForm from '../ui/ProductForm';
import { getCurrentUser } from '@/lib/auth/actions';

export const metadata = {
  title: 'Admin — Create Product',
};

export default async function AdminCreatePostPage() {
  const user = await getCurrentUser();
  const ADMIN_UUID = 'c8b063c3-b812-4db3-a318-7389a4ef62a6';
  const ok = !!(user && user.id === ADMIN_UUID);

  if (!ok) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-heading-2 mb-4">Admin</h1>
        <p className="text-body text-dark-700">You are not authorized to view this page.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-heading-2 mb-4">Admin Dashboard — Create Product</h1>
      <p className="mb-6 text-body text-dark-700">This page is for administrators to create products.</p>
      <ProductForm />
    </main>
  );
}
