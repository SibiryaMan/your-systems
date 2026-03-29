import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Конфигурация подразделов для навигации (Кириллица)
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
  searchParams: Promise<{ brand?: string, features?: string }> 
}) {
  const resolvedParams = await params;
  const sParams = await searchParams;
  const category = resolvedParams.category;

  // Логика редиректа: аксессуары-видео -> коробки
  const activeCategory = category === 'aksessuary-video' ? 'korobki' : category;

  // Запрос к Supabase с учетом фильтров из URL
  let query = supabase
    .from('products')
    .select('*')
    .eq('category_slug', activeCategory);

  if (sParams.brand) {
    query = query.in('brand', sParams.brand.split(','));
  }

  if (sParams.features) {
    // Предполагается, что в базе колонка features имеет тип jsonb или text[]
    query = query.contains('features', sParams.features.split(','));
  }

  const { data: products } = await query;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white">
      {/* Шапка: логотип отцентрован над сайдбаром (320px) */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Сайдбар: фиксированная ширина 320px, 16 фильтров внутри */}
        <Sidebar currentCategory={activeCategory} />
        
        {/* Основной контент: выровнен по левому краю относительно main */}
        <main className="flex-1 p-16 pt-12 overflow-y-auto bg-white">
          
          {/* Навигация по подразделам (Кириллица) */}
          <nav className="flex gap-12 mb-20 border-b border-gray-100 pb-8 items-end">
            {SUB_NAV.map((item) => (
              <Link 
                key={item.slug} 
                href={`/catalog/${item.slug}`}
                className={`text-[13px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {products && products.length > 0 ? (
              products.map((item: any) => (
                <div key={item.id} className="group cursor-pointer">
                  {/* Контейнер изображения */}
                  <div className="aspect-square bg-[#f9fafb] mb-8 border border-gray-100 group-hover:border-blue-600 transition-all flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-6 left-6 text-[10px] font-black text-gray-200 uppercase tracking-widest italic opacity-40">
                      YourSystems Hardware
                    </div>
                    {/* Линия при ховере снизу вверх */}
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-500" />
                  </div>

                  {/* Информационный блок */}
                  <div className="flex justify-between items-end px-2">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest mb-2">
                        {item.brand || 'No Brand'}
                      </span>
                      <h3 className="text-[20px] font-black uppercase tracking-tighter leading-none text-[#1a1c23]">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-[26px] font-black italic text-[#1a1c23] ml-6 whitespace-nowrap">
                      {item.price ? `${item.price} ₽` : '—'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              /* Состояние: Товаров нет */
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/20">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 mb-4 italic italic">
                  System Status: Waiting
                </span>
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-center">
                  Товары в данной категории <br /> временно отсутствуют
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}