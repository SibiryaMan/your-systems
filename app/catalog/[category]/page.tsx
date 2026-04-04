import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

const NAV_GROUPS: Record<string, { name: string; slug: string }[]> = {
  video: [
    { name: 'Камеры', slug: 'kamery' },
    { name: 'Регистраторы', slug: 'registratory' },
    { name: 'Монтажные коробки', slug: 'korobki' },
    { name: 'Кронштейны', slug: 'kronshteyny' },
    { name: 'Микрофоны', slug: 'mikrofony' }
  ],
  network: [
    { name: 'Коммутаторы', slug: 'switches' },
    { name: 'Маршрутизаторы', slug: 'marshrutizatory' },
    { name: 'Роутеры', slug: 'routers' },
    { name: 'Промышленные коммутаторы', slug: 'industrial-switches' },
    { name: 'Точки доступа', slug: 'tochki-dostupa' },
    { name: 'Wi-Fi мосты', slug: 'wifi-bridges' },
    { name: 'SFP модули', slug: 'sfp-modules' },
    { name: 'PoE инжекторы', slug: 'poe-injectors' },
    { name: 'Антенны', slug: 'antennas' },
    { name: 'Погружная телеметрия', slug: 'pogruzhnaya-telemetriya' }
  ],
  skud: [
    { name: 'Контроллеры', slug: 'kontrollery' },
    { name: 'Считыватели', slug: 'schityvateli' },
    { name: 'Замки', slug: 'zamki' },
    { name: 'Кнопки выхода', slug: 'knopki-vyhoda' }
  ]
};

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ filters?: string }>;
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const categorySlug = resolvedParams.category;
  const activeFilters = resolvedSearch.filters ? resolvedSearch.filters.split(',') : [];

  const supabase = await createClient();

  if (categorySlug === 'aksessuary' || categorySlug === 'aksessuary-video') redirect('/catalog/korobki');
  if (categorySlug === 'setevoe-oborudovanie') redirect('/catalog/switches');

  // Получаем дерево категорий прямо здесь, на сервере
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, parent_id, name, slug, specs, icon')
    .order('id', { ascending: true });

  const { data: activeCategory } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();
  
  if (!activeCategory) return notFound();

  const family = Object.values(NAV_GROUPS).find(group => group.some(l => l.slug === categorySlug)) || [];

  let targetIds = activeFilters.length > 0 
    ? (allCategories || []).filter((c: any) => activeFilters.includes(c.slug)).map((c: any) => c.id)
    : [activeCategory.id, ...(allCategories || []).filter((c: any) => c.parent_id === activeCategory.id).map((c: any) => c.id)];

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('category_id', targetIds)
    .order('id', { ascending: false });

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="fixed top-0 left-[320px] right-0 h-20 bg-white z-40 flex items-center pl-16 pointer-events-none">
        <div className="flex flex-col translate-y-[2px]">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black leading-none bg-white">
            {activeCategory.name}
          </h1>
          <div className="h-1 w-10 bg-blue-600 mt-2"></div>
        </div>
      </div>

      <div className="flex flex-1 items-start relative">
        <Sidebar categories={allCategories || []} currentCategory={activeCategory} />
        <main className="flex-1 px-16 pt-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-10">
            {family.length > 0 && (
              <nav className="flex flex-wrap gap-x-10 gap-y-4 border-b border-gray-100 pb-4 relative z-50">
                {family.map((link) => (
                  <Link 
                    key={link.slug} 
                    href={`/catalog/${link.slug}`} 
                    className={`text-[10px] font-black uppercase tracking-[0.2em] relative pb-2 whitespace-nowrap transition-colors ${
                      categorySlug === link.slug ? 'text-blue-600' : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    {link.name}
                    {categorySlug === link.slug && (
                      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
                    )}
                  </Link>
                ))}
              </nav>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
              {products?.map((p) => (
                <div key={p.id} className="group border border-gray-100 p-8 rounded-sm hover:border-blue-500 transition-all bg-white shadow-sm cursor-pointer">
                  <div className="aspect-square bg-gray-50 mb-6 flex items-center justify-center relative overflow-hidden">
                    <span className="text-[10px] text-gray-300 uppercase font-black tracking-widest">YourSystems</span>
                  </div>
                  <h2 className="font-bold text-lg mb-3 text-black group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                    {p.name}
                  </h2>
                  <div className="text-2xl font-black text-black">
                    {p.price > 0 ? `${p.price.toLocaleString()} ₽` : 'Цена по запросу'}
                  </div>
                  <button className="w-full mt-6 py-3 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    Подробнее
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}