'use client';

import { registerUser } from '@/app/auth-actions';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res.error) {
        setError(res.error);
    } else {
        router.push('/login?registered=true');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Регистрация</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input name="name" type="text" placeholder="Имя" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" />
              <input name="email" type="email" required placeholder="Email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" />
              <input name="password" type="password" required placeholder="Пароль" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
              Создать аккаунт
            </button>
            
            <div className="text-sm text-center">
                <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500">
                    Уже есть аккаунт? Войти
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
