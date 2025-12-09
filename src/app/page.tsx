import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PopularCategories from '@/components/home/PopularCategories';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PopularCategories />
        
        {/* Simple Trust Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Нам доверяют 500+ компаний</h2>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                    {/* Placeholders for logos */}
                    <div className="font-bold text-2xl">ACME Corp</div>
                    <div className="font-bold text-2xl">Global Tech</div>
                    <div className="font-bold text-2xl">Design Studio</div>
                    <div className="font-bold text-2xl">StartUp Inc</div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}