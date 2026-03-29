import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// 1. ВЕТКА: ВИДЕОНАБЛЮДЕНИЕ
const SAFETY_NAV = [
  { name: 'КАМЕРЫ', slug: 'kamery' },
  { name: 'РЕГИСТРАТОРЫ', slug: 'registratory' },
  { name: 'КОРОБКИ', slug: 'korobki' },
  { name: 'КРОНШТЕЙНЫ', slug: 'kronshteiny' },
  { name: 'МИКРОФОНЫ', slug: 'mikrofony' },
];

// 2. ВЕТКА: СЕТЕВОЕ ОБОРУДОВАНИЕ (v2.6.7 - ПОЛНОЕ СООТВЕТСТВИЕ URL)
const NETWORK_NAV = [
  { name: 'КОММУТАТОРЫ', slug: 'kommutatory' },
  { name: 'ПРОМ. КОММУТАТОРЫ', slug: 'promyshlennye-kommutatory' },
  { name: 'МАРШРУТИЗАТОРЫ', slug: 'marshrutizatory' },
  { name: 'РОУТЕРЫ', slug: 'routery' },
  { name: 'ТОЧКИ ДОСТУПА', slug: 'tochki-dostupa' },
  { name: 'WI-FI МОСТЫ', slug: 'wi-fi-mosty' },
  { name: 'SFP МОДУЛИ', slug: 'sfp-moduli' },
  { name: 'POE ИНЖЕКТОРЫ', slug: 'poe-inzhektory' },
  { name: 'АНТЕННЫ', slug: 'antenny' },
  { name: 'ТЕЛЕМЕТРИЯ', slug: 'pogruzhnaya-telemetriya' },
];

export default async function CatalogPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  // 1. Распаковка асинхронных параметров Next.js 15
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const rawCategory = resolvedParams.category;

  // 2. Определение активной категории
  const activeCategory = rawCategory === 'aksessuary-video' ? 'korobki' : rawCategory;

  // 3. ГАРАНТИРОВАННАЯ ПРОВЕРКА ВЕТКИ КАТАЛОГА
  const isNetworkBranch = NETWORK_NAV.some(item => item.slug === activeCategory);
  const currentSubNav = isNetworkBranch ? NETWORK_NAV : SAFETY_NAV;

  // 4. Запрос к базе Supabase
  let query = supabase
    .from('products')
    .select('*')
    .eq('category_slug', activeCategory);

  // Фильтрация по бренду
  if (resolvedSearchParams.brand) {
    query = query.in('brand', resolvedSearchParams.brand.split(','));
  }

  // Динамические фильтры по JSONB specs
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (key !== 'brand' && value) {
      const values = value.split(',');
      const formattedValues = `(${values.map(v => `"${v}"`).join(',')})`;
      query = query.filter(`specs->>${key}`, 'in', formattedValues);
    }
  });

  const { data: products } = await query;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-600 overflow-x-hidden">
      <Navbar />
      
      <div className="flex flex-1 items-start bg-white">
        {/* Сайдбар автоматически подхватывает фильтры по activeCategory */}
        <Sidebar currentCategory={activeCategory} />
        
        <main className="flex-1 p-16 pt-6 bg-white min-h-[calc(100vh-80px)]">
          
          {/* ДВУХСТРОЧНАЯ НАВИГАЦИЯ С ЦЕНТРИРОВАННОЙ ЛИНИЕЙ (v2.6.7) */}
          <nav className="flex flex-wrap gap-x-10 gap-y-6 mb-12 border-b border-gray-100 pb-3 items-end">
            {currentSubNav.map((item) => (
              <Link 
                key={item.slug} 
                href={`/catalog/${item.slug}`}
                className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap relative ${
                  activeCategory === item.slug 
                    ? 'text-blue-600' 
                    : 'text-gray-300 hover:text-[#1a1c23]'
                }`}
              >
                {item.name}
                
                {/* Активная линия: строго по центру между строк (-bottom-[15px]) */}
                {activeCategory === item.slug && (
                  <div className="absolute -bottom-[15px] left-0 w-full h-1 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.15)]" />
                )}
              </Link>
            ))}
          </nav>

          {/* СЕТКА ТОВАРОВ YourSystems Hardware */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {products && products.length > 0 ? (
              products.map((item: any) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="aspect-square bg-[#f9fafb] mb-6 flex items-center justify-center border border-gray-100 group-hover:border-blue-600 transition-all relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-[9px] font-black text-gray-200 uppercase tracking-widest italic opacity-40">
                      YourSystems Hardware
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-500" />
                  </div>

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
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/10">
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-center text-[13px] italic">
                  Система YourSystems ожидает поступления оборудования <br /> в категорию "{activeCategory.toUpperCase()}"
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}