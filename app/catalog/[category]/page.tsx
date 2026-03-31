import { supabase, getFullCategoryTree } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function CatalogPage({ params, searchParams }: any) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const categorySlug = resolvedParams.category;
  const activeFilters = resolvedSearch.filters ? resolvedSearch.filters.split(',') : [];

  // 1. КОНФИГУРАЦИЯ ВКЛАДОК (Обновлено: Монтажные коробки)
  const videoNavLinks = [
    { name: 'Камеры', slug: 'kamery' },
    { name: 'Регистраторы', slug: 'registratory' },
    { name: 'Монтажные коробки', slug: 'korobki' }, 
    { name: 'Кронштейны', slug: 'kronshteyny' },
    { name: 'Микрофоны', slug: 'mikrofony' }
  ];

  // Редирект с общих аксессуаров на первую рабочую вкладку
  if (categorySlug === 'aksessuary-video' || categorySlug === 'aksessuary') {
    redirect('/catalog/korobki');
  }

  const allCategories = await getFullCategoryTree();
  const { data: activeCategory } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();

  if (!activeCategory) return notFound();

  // Железная проверка: показывать навигацию, если слаг есть в списке видео-ссылок
  const isVideoRelated = videoNavLinks.some(link => link.slug === categorySlug);

  // Сбор ID товаров (текущая категория + все подкатегории-фильтры)
  let targetIds = activeFilters.length > 0 
    ? allCategories.filter((c: any) => activeFilters.includes(c.slug)).map((c: any) => c.id)
    : [activeCategory.id, ...allCategories.filter((c: any) => c.parent_id === activeCategory.id).map((c: any) => c.id)];

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('category_id', targetIds)
    .order('id', { ascending: false });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-50">
      <Navbar />
      
      {/* 
          [ФИКСИРОВАННЫЙ ЗАГОЛОВОК КАТЕГОРИИ] 
          Позиционирован строго в Navbar напротив логотипа
      */}
      <div className="fixed top-0 left-[320px] h-20 flex items-center z-[110] pointer-events-none pl-16">
        <div className="flex flex-col translate-y-[2px]">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black leading-none">
            {activeCategory.name}
          </h1>
          <div className="h-1 w-10 bg-blue-600 mt-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)]"></div>
        </div>
      </div>

      <div className="flex flex-1 items-start">
        {/* САЙДБАР (Ширина 320px) */}
        <Sidebar categories={allCategories || []} currentCategory={activeCategory} />
        
        {/* КОНТЕНТНАЯ ОБЛАСТЬ (pt-8 для выравнивания вкладок с заголовком фильтров) */}
        <main className="flex-1 px-16 pt-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-10">
            
            {/* ГОРЯЧАЯ НАВИГАЦИЯ (ВКЛАДКИ) */}
            {isVideoRelated && (
              <nav className="flex gap-8 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
                {videoNavLinks.map((link) => (
                  <Link 
                    key={link.slug} 
                    href={`/catalog/${link.slug}`} 
                    className={`text-[10px] font-black uppercase tracking-[0.2em] relative pb-2 transition-colors ${
                      categorySlug === link.slug ? 'text-blue-600' : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    {link.name}
                    {categorySlug === link.slug && (
                      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 animate-in fade-in duration-300" />
                    )}
                  </Link>
                ))}
              </nav>
            )}

            {/* СЕТКА ТОВАРОВ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
              {products && products.length > 0 ? (
                products.map((p) => (
                  <div key={p.id} className="group border border-gray-100 p-8 rounded-sm hover:border-blue-500 transition-all duration-500 bg-white shadow-sm hover:shadow-xl">
                    <div className="aspect-square bg-gray-50 mb-6 flex items-center justify-center relative overflow-hidden">
                      <span className="text-[10px] text-gray-300 uppercase font-black tracking-widest">YourSystems</span>
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        В наличии
                      </div>
                    </div>
                    <h2 className="font-bold text-lg mb-3 text-black group-hover:text-blue-600 transition-colors leading-tight">{p.name}</h2>
                    <div className="text-2xl font-black text-black">
                      {p.price > 0 ? `${p.price.toLocaleString()} ₽` : 'Цена по запросу'}
                    </div>
                    <button className="w-full mt-6 py-3 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                      Подробнее
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-sm">
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Раздел пополняется оборудованием
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}