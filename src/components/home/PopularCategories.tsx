import Link from 'next/link';
import { CreditCard, FileText, Image as ImageIcon, Box, Calendar, Stamp } from 'lucide-react';

const categories = [
  {
    id: 'business-cards',
    title: 'Визитки',
    desc: 'Классические, премиум, с лаком',
    icon: CreditCard,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'flyers',
    title: 'Листовки',
    desc: 'A6, A5, A4, DL',
    icon: FileText,
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 'posters',
    title: 'Плакаты',
    desc: 'Широкоформатная печать',
    icon: ImageIcon,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'packaging',
    title: 'Упаковка',
    desc: 'Коробки, пакеты, этикетки',
    icon: Box,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'calendars',
    title: 'Календари',
    desc: 'Настенные, настольные',
    icon: Calendar,
    color: 'bg-red-50 text-red-600',
  },
  {
    id: 'stickers',
    title: 'Наклейки',
    desc: 'На листе и в рулоне',
    icon: Stamp,
    color: 'bg-teal-50 text-teal-600',
  },
];

export default function PopularCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Популярные категории</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                href={`/products/${cat.id}`}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all text-center flex flex-col items-center bg-white"
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
