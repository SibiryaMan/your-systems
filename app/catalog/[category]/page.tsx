import { supabase, getFullCategoryTree } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { notFound } from 'next/navigation';

export default async function CatalogPage({ params }: { params: Promise<{ category: string }> }) {
  // 1. Разворачиваем параметры URL (Next.js 15+ Requirement)
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;

  // 2. Получаем полное дерево категорий для Sidebar
  const allCategories = await getFullCategoryTree();
  
  // 3. Получаем данные текущей активной категории
  const { data: activeCategory, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();

  if (catError || !activeCategory) {
    return notFound();
  }

  // 4. ЛОГИКА СБОРА ТОВАРОВ (Глубокий поиск)
  // Находим все ID подкатегорий (фильтров), которые принадлежат текущей категории
  const subCategoryIds = allCategories
    .filter((c: any) => c.parent_id === activeCategory.id)
    .map((c: any) => c.id);

  // Собираем массив всех ID для поиска (сама категория + её дети)
  const targetIds = [activeCategory.id, ...subCategoryIds];

  // Запрашиваем товары, которые входят в любой из этих ID
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .in('category_id', targetIds)
    .order('id', { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка сайта */}
      <Navbar />

      <div className="flex flex-1 items-start">
        {/* Боковая панель: передаем все категории и текущую */}
        <Sidebar 
          categories={allCategories || []} 
          currentCategory={activeCategory} 
        />
        
        <main className="flex-1 p-16 pt-10 bg-white min-h-[calc(100vh-80px)]">
          {/* Хлебные крошки / Заголовок */}
          <div className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              {activeCategory.name}
            </h1>
            <div className="h-1.5 w-24 bg-blue-600 mt-3 shadow-[0_2px_10px_rgba(59,130,246,0.3)]"></div>
          </div>
          
          {/* Сетка товаров YourSystems v2.6.7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product.id} 
                  className="group border border-gray-100 p-8 rounded-sm hover:border-blue-500 transition-all duration-500 bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                >
                  <div className="aspect-square bg-gray-50 mb-6 flex items-center justify-center overflow-hidden relative">
                    <span className="text-[10px] text-gray-300 uppercase font-black tracking-widest group-hover:scale-110 transition-transform duration-700">
                      YourSystems Engineering
                    </span>
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      В наличии
                    </div>
                  </div>
                  
                  <h2 className="font-bold text-lg mb-3 text-black group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-black">
                      {product.price > 0 ? `${product.price.toLocaleString()} ₽` : 'Цена по запросу'}
                    </span>
                  </div>
                  
                  <button className="w-full mt-6 py-3 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                    Подробнее
                  </button>
                </div>
              ))
            ) : (
              /* Заглушка при пустой категории */
              <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-sm">
                <div className="text-gray-200 text-6xl mb-6">◌</div>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
                  Инженерная система YourSystems <br /> 
                  ожидает пополнения в разделе <br />
                  <span className="text-gray-300">"{activeCategory.name}"</span>
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}