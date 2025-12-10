import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const params = await searchParams;
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center max-w-lg w-full shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Заказ принят!</h1>
            <p className="text-gray-600 mb-8">
                Спасибо за ваш заказ. <br/>
                Номер заказа: <strong className="text-brand-900">{params.id}</strong>
            </p>

            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    Мы отправили подтверждение на ваш Email. <br/>
                    Менеджер свяжется с вами для проверки макетов.
                </p>
                
                <Link href="/" className="inline-block w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors">
                    Вернуться на главную
                </Link>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
