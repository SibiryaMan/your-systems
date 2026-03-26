import { supabase } from './supabase'
import { ChevronRight, Menu, ShoppingCart, Shield, ArrowRight } from 'lucide-react'

export default async function Home() {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, subcategories:categories(id, name, slug)')
    .is('parent_id', null)

  const { data: products } = await supabase.from('products').select('*').limit(8)

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-blue-600 text-white transition-transform group-hover:scale-105 shadow-sm">
              <Shield size={18} fill="currentColor" strokeWidth={2.5} />
            </div>
            <span className="text-[22px] font-black uppercase tracking-tighter leading-none pt-0.5">
              YOUR<span className="text-blue-600">SYSTEMS</span>
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-sm bg-slate-900 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-white transition-colors hover:bg-blue-600">
                <Menu size={14} strokeWidth={3} /> КАТАЛОГ
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="flex w-[520px] overflow-hidden border border-slate-200 bg-white shadow-2xl rounded-sm">
                  <div className="w-1/2 border-r border-slate-100 bg-slate-50/50 py-3">
                    {categories?.map((cat) => (
                      <div key={cat.id} className="group/item">
                        <div className="flex items-center justify-between px-4 py-1.5 transition-colors hover:bg-white cursor-default">
                          <span className="text-[12px] font-bold uppercase tracking-tight text-slate-600 group-hover/item:text-blue-600">{cat.name}</span>
                          <ChevronRight size={12} className="text-slate-300 group-hover/item:text-blue-600" />
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white p-5 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all overflow-y-auto">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 pb-2 border-b border-slate-50">{cat.name}</h4>
                          <div className="flex flex-col space-y-0.5">
                            {cat.subcategories?.map((sub: any) => (
                              <a key={sub.id} href={`/catalog/${sub.slug}`} className="rounded-sm py-1 px-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600">{sub.name}</a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex w-1/2 flex-col items-center justify-center p-8 text-center opacity-10"><Shield size={32} /></div>
                </div>
              </div>
            </div>
            <div className="flex gap-6 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
              <a href="/services" className="hover:text-slate-900 transition-colors">Услуги</a>
              <a href="/about" className="hover:text-slate-900 transition-colors">О компании</a>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION С МЯГКИМИ ГРАНИЦАМИ ВИДЕО */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-black flex items-center">
        
        {/* 1. ФОН: ГЛУБОКОЕ РАЗМЫТИЕ ДЛЯ АТМОСФЕРЫ */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover scale-110 blur-[80px] opacity-30">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 2. ЦЕНТР: ВИДЕО С РАЗМЫТЫМИ КРАЯМИ (МАСКА) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-full w-full video-mask"> {/* Применяем нашу маску здесь */}
            <video autoPlay muted loop playsInline className="h-full w-full object-contain">
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        
        {/* 3. ГРАДИЕНТ ДЛЯ ТЕКСТА */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/30 to-transparent" />

        {/* КОНТЕНТ */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-6">
          <div className="max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">
                YourSystems • Engineering Expertise 2026 ✅
              </span>
            </div>

            <h2 className="mb-8 text-7xl font-black uppercase tracking-tighter text-white leading-[0.9] md:text-[85px]">
              ПРОЕКТИРУЕМ <br /> 
              <span className="text-blue-600">ВАШУ <br /> УВЕРЕННОСТЬ.</span>
            </h2>

            <p className="mb-12 max-w-xl text-lg font-medium leading-relaxed text-slate-300">
              Комплексные системы безопасности «под ключ». От глубокого аудита объекта до профессионального монтажа и сервиса 24/7 по всей РФ.
            </p>

            <div className="flex flex-wrap items-center gap-10">
              <button className="group flex items-center gap-4 rounded-sm bg-blue-600 px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-95 shadow-xl">
                РАССЧИТАТЬ СМЕТУ ЗА 24 ЧАСА
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              </button>
              
              <div className="flex items-center gap-8 border-l border-white/10 pl-8 text-white">
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter leading-none">500+</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Объектов</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter leading-none">2 ГОДА</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Гарантии</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* КАТАЛОГ (НИЗ) */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-center justify-between border-b border-slate-100 pb-8">
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Популярное оборудование</h3>
          <a href="/catalog" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
            Весь каталог <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((item) => (
            <div key={item.id} className="group border border-slate-100 bg-white p-6 transition-all hover:border-blue-100">
              <div className="mb-6 flex aspect-square items-center justify-center bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-200">YS STORE</div>
              <h4 className="mb-1 text-[14px] font-black uppercase tracking-tight text-slate-900 line-clamp-1">{item.name}</h4>
              <p className="mb-8 text-[11px] font-medium leading-relaxed text-slate-400 line-clamp-2 italic">{item.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xl font-black text-slate-900">{item.price?.toLocaleString()} ₽</span>
                <button className="flex h-10 w-10 items-center justify-center bg-slate-900 text-white hover:bg-blue-600 active:scale-90 transition-all shadow-sm">
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}