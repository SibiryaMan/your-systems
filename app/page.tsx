import { createClient } from '@/utils/supabase/server'
import { ChevronRight, Menu, ShoppingCart, Shield, ArrowRight, Activity, Cpu, Fingerprint } from 'lucide-react'
import { ScrollToTop } from './ScrollToTop'

export default async function Home() {
  // 1. Инициализируем серверный клиент Supabase (Next.js 16 / React 19 Style)
  const supabase = await createClient()

  /**
   * 2. ЗАПРОС ДАННЫХ
   * Получаем главные категории и их вложенные подкатегории одним запросом.
   * Мы удалили ручной массив skudSubcategories — теперь всё берется из БД.
   */
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, subcategories:categories(id, name, slug, specs)')
    .is('parent_id', null)
    .order('id', { ascending: true })

  // 3. Получаем последние товары для сетки на главной
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(8)

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      <ScrollToTop />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          
          {/* ЛОГОТИП */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600 text-white shadow-lg">
              <Shield size={20} fill="currentColor" />
            </div>
            <span className="text-[24px] font-black uppercase tracking-tighter pt-0.5">
              YOUR<span className="text-blue-600">SYSTEMS</span>
            </span>
          </div>
          
          <nav className="flex items-center gap-10">
            <div className="relative group">
              <button className="flex items-center gap-2.5 rounded-sm bg-slate-950 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white hover:bg-blue-600 transition-all active:scale-95 shadow-md cursor-pointer">
                <Menu size={16} strokeWidth={3} /> КАТАЛОГ
              </button>
              
              {/* ВЫПАДАЮЩЕЕ ОКНО: Полностью динамическое из базы данных */}
              <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="relative flex w-[920px] bg-slate-950/98 backdrop-blur-3xl rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/5 h-auto min-h-[450px] overflow-visible">
                  
                  {/* Левая панель: Основные категории */}
                  <div className="w-[300px] py-8 border-r border-white/5 bg-black/20 flex flex-col z-20 shrink-0">
                    {categories?.map((cat) => (
                      <div key={cat.id} className="group/item static px-4">
                        <div className="flex items-center justify-between px-6 py-3.5 rounded-sm transition-all hover:bg-blue-600 cursor-default group/row">
                          <span className="text-[11px] font-black uppercase text-white/60 group-hover/item:text-white tracking-widest transition-colors select-none">
                            {cat.name}
                          </span>
                          <ChevronRight size={16} className="text-white/20 group-hover/item:text-white transition-transform group-hover/item:translate-x-1" />
                          
                          {/* Правая панель: Подкатегории (теперь строго из БД) */}
                          <div className="absolute left-[300px] top-0 right-0 min-h-full bg-[#080a0f] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-150 p-12 z-50 h-auto pb-16">
                            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-5">
                              <div className="h-5 w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                              <h4 className="text-[14px] font-black text-white uppercase tracking-[0.2em]">{cat.name}</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                              {/* Сортировка подкатегорий по sort_order из specs */}
                              {(cat.subcategories || [])
                                .sort((a: any, b: any) => (a.specs?.sort_order || 99) - (b.specs?.sort_order || 99))
                                .map((sub: any) => (
                                  <a 
                                    key={sub.id} 
                                    href={`/catalog/${sub.slug}`} 
                                    className="group/link flex items-center gap-3 py-1 transition-all bg-transparent outline-none"
                                  >
                                    <div className="h-1 w-1 rounded-full bg-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                                    <span className="text-[13px] font-bold text-white/40 group-hover/link:text-white leading-tight transition-colors select-none">
                                      {sub.name}
                                    </span>
                                  </a>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Центральный визуальный блок-заглушка */}
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-10 select-none">
                    <Cpu size={60} className="mb-6 text-white" strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">SYSTEMS INFRASTRUCTURE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href="/services" className="hover:text-slate-950 transition-colors py-1 relative group">Услуги</a>
              <a href="/about" className="hover:text-slate-950 transition-colors py-1 relative group">О компании</a>
            </div>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-center overflow-hidden bg-[#05070a] noise-overlay">
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="h-full w-full video-mask">
            <video autoPlay muted loop playsInline className="h-full w-full object-contain opacity-80 scale-110" style={{ filter: 'brightness(1.1) saturate(1.2)' }}>
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="absolute inset-y-0 left-0 z-20 w-[70%] bg-gradient-to-r from-[#05070a] via-[#05070a]/98 to-transparent" />
        <div className="absolute inset-y-0 right-0 z-20 w-[30%] bg-gradient-to-l from-[#05070a] via-[#05070a]/80 to-transparent" />
        
        <div className="relative z-30 mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
          <div className="max-w-4xl text-left">
            <div className="mb-10 flex items-center gap-4">
              <Activity size={16} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400/80">SYSTEMS MONITORING ACTIVE • 2026</span>
            </div>
            
            <h1 className="mb-10 text-7xl font-black uppercase tracking-tighter text-white leading-[0.85] md:text-[105px]">
              ПРОЕКТИРУЕМ <br /> 
              <span className="text-blue-600 drop-shadow-[0_0_25px_rgba(0,0,0,1)] drop-shadow-[0_10px_50px_rgba(0,0,0,1)]">ВАШУ <br /> УВЕРЕННОСТЬ.</span>
            </h1>

            <p className="mb-14 max-w-4xl text-lg font-medium leading-relaxed text-slate-300 italic border-l-2 border-blue-600 pl-8">
              Инженерные системы безопасности высшего класса. <br />
              От глубокого аудита до полной реализации проекта.
            </p>

            <button className="group flex items-center gap-4 rounded-sm bg-blue-600 px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-95 shadow-lg">
              ОБСУДИТЬ ПРОЕКТ <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* --- СЕТКА ТОВАРОВ НА ГЛАВНОЙ --- */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {products?.map((product) => (
              <div key={product.id} className="group border border-slate-100 p-6 transition-all hover:border-blue-600">
                <div className="mb-6 aspect-square bg-slate-50 flex items-center justify-center">
                  <Fingerprint size={40} className="text-slate-200" />
                </div>
                <h3 className="mb-2 text-sm font-black uppercase tracking-tight line-clamp-2">{product.name}</h3>
                <p className="text-xl font-black text-blue-600">{product.price.toLocaleString()} ₽</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}