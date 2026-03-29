import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Конфигурация навигации (Кириллица, без Аксессуаров)
const SUB_NAV = [
  { name: 'КАМЕРЫ', slug: 'kamery' },
  { name: 'РЕГИСТРАТОРЫ', slug: 'registratory' },
  { name: 'КОРОБКИ', slug: 'korobki' },
  { name: 'КРОНШТЕЙНЫ', slug: 'kronshteiny' },
  { name: 'МИКРОФОНЫ', slug: 'mikrofony' },
];

export default async function CatalogPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  // 1. Распаковка параметров Next.js 15
  const resolvedParams = await params;
  const sParams = await searchParams;
  const category = resolvedParams.category;

  // 2. Логика подмены: если зашли в аксессуары — открываем коробки
  const activeCategory = category === 'aksessuary-video' ? 'korobki' : category;

  // 3. Запрос к базе данных Supabase
  let query = supabase
    .from('products')
    .select('*')
    .eq('category_slug', activeCategory);

  // Фильтрация по Бренду
  if (sParams.brand) {
    query = query.in('brand', sParams.brand.split(','));
  }

  // Динамическая фильтрация по всем остальным параметрам (JSONB колонка specs)
  Object.entries(sParams).forEach(([key, value]) => {
    if (key !== 'brand' && value) {
      const values = value.split(',');
      const formattedValues = `(${values.map(v => `"${v}"`).join(',')})`;
      query = query.filter(`specs->>${key}`, 'in', formattedValues);
    }
  });

  const { data: products } = await query;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-600 overflow-x-hidden">
      {/* Шапка: логотип отцентрован над сайдбаром (320px) */}
      <Navbar />
      
      <div className="flex flex-1 items-start bg-white">
        {/* Сайдбар: 320px, прижат к шапке, содержит 16 фильтров */}
        <Sidebar currentCategory={activeCategory} />
        
        {/* Основной контент: pt-6 и mb-8 поднимают сетку максимально вверх */}
        <main className="flex-1 p-16 pt-6 bg-white min-h-[calc(100vh-80px)]">
          
          {/* Навигация по подразделам */}
          <nav className="flex gap-10 mb-8 border-b border-gray-100 pb-8 items-end">
            {SUB_NAV.map((item) => (
              <Link 
                key={item.slug} 
                href={`/catalog/${item.slug}`}
                className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${
                  activeCategory === item.slug 
                    ? 'text-blue-600 border-b-4 border-blue-600 pb-8 -mb-[36px]' 
                    : 'text-gray-300 hover:text-[#1a1c23]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Сетка товаров YourSystems v2.4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products && products.length > 0 ? (
              products.map((item: any) => (
                <div key={item.id} className="group cursor-pointer">
                  {/* Контейнер карточки */}
                  <div className="aspect-square bg-[#f9fafb] mb-4 flex items-center justify-center border border-gray-100 group-hover:border-blue-600 transition-all relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-[9px] font-black text-gray-200 uppercase tracking-widest italic opacity-40">
                      YourSystems v2.4
                    </div>
                    {/* Линия при ховере */}
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-500" />
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">
                        {item.brand || 'YourSystems'}
                      </span>
                      <h3 className="text-[17px] font-black uppercase tracking-tighter leading-tight text-[#1a1c23]">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-[20px] font-black italic text-[#1a1c23] ml-4 whitespace-nowrap">
                      {item.price ? `${item.price} ₽` : '—'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              /* Состояние: Товары не найдены */
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/10">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 mb-4 italic">
                  Status: Waiting for inventory
                </span>
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-center">
                  Товары в данной категории <br /> отсутствуют или отфильтрованы
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}