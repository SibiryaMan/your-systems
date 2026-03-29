import { createClient } from '@/utils/supabase/server'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function NetworkPage() {
  const supabase = createClient()
  
  // Загружаем именно роутеры
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('subcategory', 'routers')

  // Навигация в 2 строки (на кириллице)
  const navItems = [
    { name: 'Маршрутизаторы', href: '/catalog/network/routers' },
    { name: 'Коммутаторы', href: '/catalog/network/switches' },
    { name: 'Точки доступа', href: '/catalog/network/ap' },
    { name: 'Wi-Fi 6 Роутеры', href: '/catalog/network/wifi6' },
    { name: 'SFP Модули', href: '/catalog/network/sfp' },
    { name: 'Антенны', href: '/catalog/network/antennas' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* 1. Двухстрочная навигация (Grid 3 колонки на десктопе, 2 на мобилках) */}
      <nav className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-6 uppercase">Сетевое оборудование</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-bold text-sm text-center shadow-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex flex-col md:flex-row gap-10">
        {/* 2. Сайдбар (исправленный под сетевое оборудование) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
            <h2 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Фильтры</h2>
            
            <div className="space-y-8">
              <div>
                <p className="font-bold text-sm mb-4">Скорость передачи</p>
                <div className="space-y-3">
                  {['100 Мбит/с', '1 Гбит/с', '10 Гбит/с'].map(s => (
                    <label key={s} className="flex items-center gap-3 text-sm cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="group-hover:text-blue-600 transition-colors">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
              ПРИМЕНИТЬ
            </button>
          </div>
        </aside>

        {/* 3. Список товаров */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-8">Маршрутизаторы</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products?.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
            {(!products || products.length === 0) && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-400 italic">В этой категории товаров пока нет</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}