import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-brand-900 text-white overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-800 skew-x-12 translate-x-20 opacity-50" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center bg-brand-800/50 rounded-full px-4 py-1.5 text-sm font-medium text-brand-100 mb-6 border border-brand-700">
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            Производство работает 24/7
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Полиграфия для бизнеса <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-white">
              быстро и просто
            </span>
          </h1>
          
          <p className="text-xl text-brand-100 mb-10 leading-relaxed">
            Заказывайте визитки, листовки и рекламные материалы онлайн. 
            Мгновенный расчет цены, проверка макетов и доставка по ЕС.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/products" 
              className="px-8 py-4 bg-white text-brand-900 font-bold rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2 shadow-lg shadow-brand-900/20"
            >
              Перейти в каталог
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/upload" 
              className="px-8 py-4 bg-transparent border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Загрузить макет
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-brand-200">
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                <span>Бесплатная доставка от 500 PLN</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                <span>Проверка макетов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
