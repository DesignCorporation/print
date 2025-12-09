'use client';

import { signIn } from 'next-auth/react';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Неверный email или пароль');
    } else {
      router.push('/account'); // Redirect to dashboard
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Вход в систему</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input 
                type="email" 
                required 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" 
              />
              <input 
                type="password" 
                required 
                placeholder="Пароль" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" 
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
              Войти
            </button>

            <div className="text-sm text-center">
                <Link href="/register" className="font-medium text-brand-600 hover:text-brand-500">
                    Нет аккаунта? Зарегистрироваться
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
