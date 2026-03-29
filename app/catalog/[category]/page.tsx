import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

const SUB_NAV = [
  { name: 'КАМЕРЫ', slug: 'kamery' },
  { name: 'РЕГИСТРАТОРЫ', slug: 'registratory' },
  { name: 'КОРОБКИ', slug: 'korobki' },
  { name: 'КРОНШТЕЙНЫ', slug: 'kronshteiny' },
  { name: 'МИКРОФОНЫ', slug: 'mikrofony' },
];

export default async function CatalogPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // Логика подмены: если аксессуары -> загружаем коробки
  const activeCategory = category === 'aksessuary-video' ? 'korobki' : category;

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Теперь TS видит currentCategory и не ругается */}
        <Sidebar currentCategory={activeCategory} />
        
        <main className="flex-1 p-16 pt-12 overflow-y-auto">
          {/* НАВИГАЦИЯ ПО ПОДРАЗДЕЛАМ (КИРИЛЛИЦА) */}
          <div className="flex gap-12 mb-20 border-b border-gray-100 pb-8">
            {SUB_NAV.map((item) => (
              <Link 
                key={item.slug} 
                href={`/catalog/${item.slug}`}
                className={`text-[13px] font-black uppercase tracking-[0.3em] transition-all ${
                  activeCategory === item.slug 
                    ? 'text-blue-600 border-b-4 border-blue-600 pb-8 -mb-[36px]' 
                    : 'text-gray-300 hover:text-[#1a1c23]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* СЕТКА ТОВАРОВ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {products && products.length > 0 ? (
              products.map((item: any) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="aspect-square bg-[#f9fafb] mb-8 border border-gray-100 group-hover:border-blue-600 transition-all flex items-center justify-center relative">
                    <div className="absolute top-6 left-6 text-[10px] font-black text-gray-200 uppercase tracking-widest italic opacity-40 italic font-bold">YourSystems v2.4</div>
                  </div>
                  <div className="flex justify-between items-end px-2">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest mb-2">{item.brand}</span>
                      <h3 className="text-[18px] font-black uppercase tracking-tighter leading-none text-[#1a1c23]">{item.name}</h3>
                    </div>
                    <span className="text-[26px] font-black italic text-[#1a1c23] ml-6 whitespace-nowrap">{item.price} ₽</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                <p className="text-gray-300 font-black uppercase tracking-[0.4em]">Товары в этой категории ожидаются</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}