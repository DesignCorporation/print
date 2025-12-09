export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-900">Print.DesignCorp</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Современная онлайн-типография для бизнеса.
              Автоматизация заказов, высокое качество и быстрая доставка по всей Европе.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-900">Продукция</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-600">Визитки</a></li>
              <li><a href="#" className="hover:text-brand-600">Листовки</a></li>
              <li><a href="#" className="hover:text-brand-600">Плакаты</a></li>
              <li><a href="#" className="hover:text-brand-600">Наклейки</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-900">Клиентам</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-600">Доставка и оплата</a></li>
              <li><a href="#" className="hover:text-brand-600">Требования к макетам</a></li>
              <li><a href="#" className="hover:text-brand-600">Личный кабинет</a></li>
              <li><a href="#" className="hover:text-brand-600">Контакты</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-900">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>info@designcorp.eu</li>
              <li>+48 123 456 789</li>
              <li>Wroclaw, Poland</li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          &copy; 2025 Print Design Corp. Part of Group Design Corp.
        </div>
      </div>
    </footer>
  );
}
