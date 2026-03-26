import { supabase } from './supabase'
import { ChevronRight, Menu, ShoppingCart, Shield, ArrowRight, Activity, Crosshair } from 'lucide-react'

export default async function Home() {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, subcategories:categories(id, name, slug)')
    .is('parent_id', null)

  const { data: products } = await supabase.from('products').select('*').limit(8)

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-[100] border-b border-slate-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* ЛОГОТИП */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600 text-white shadow-lg">
              <Shield size={20} fill="currentColor" />
            </div>
            <span className="text-[24px] font-black uppercase tracking-tighter pt-0.5">
              YOUR<span className="text-blue-600">SYSTEMS</span>
            </span>
          </div>
          
          <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.1em]">
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-sm bg-slate-900 px-5 py-2 text-white hover:bg-blue-600 transition-colors cursor-pointer">
                <Menu size={14} strokeWidth={3} /> КАТАЛОГ
              </button>
              
              {/* ВЫПАДАЮЩЕЕ МЕНЮ: Теперь оно плотное и поверх всего */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-[110]">
                <div className="flex w-[540px] overflow-hidden border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-sm">
                  
                  {/* Лево: Направления */}
                  <div className="w-1/2 border-r border-slate-100 bg-slate-50 py-3">
                    {categories?.map((cat) => (
                      <div key={cat.id} className="group/item">
                        <div className="flex items-center justify-between px-5 py-2 hover:bg-white cursor-default transition-colors">
                          <span className="text-[12px] font-bold uppercase text-slate-700 group-hover/item:text-blue-600">{cat.name}</span>
                          <ChevronRight size={12} className="text-slate-300" />
                          
                          {/* Право: Подкатегории (тоже плотный белый фон) */}
                          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white p-6 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible overflow-y-auto border-l border-slate-100 shadow-inner">
                            <h4 className="text-[10px] font-black text-blue-600 mb-4 pb-2 border-b border-slate-50 uppercase tracking-widest">{cat.name}</h4>
                            <div className="flex flex-col space-y-0.5">
                              {cat.subcategories?.map((sub: any) => (
                                <a key={sub.id} href={`/catalog/${sub.slug}`} className="font-bold text-slate-500 hover:text-blue-600 py-1 px-2 text-[13px] transition-colors lowercase">{sub.name}</a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Заглушка (тоже плотный фон) */}
                  <div className="flex w-1/2 items-center justify-center p-8 bg-white opacity-20 select-none">
                    <Shield size={40} className="text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
            
            <a href="/services" className="text-slate-400 hover:text-slate-900 transition-colors">Услуги</a>
            <a href="/about" className="text-slate-400 hover:text-slate-900 transition-colors">О компании</a>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden bg-[#05070a] flex items-center noise-overlay">
        
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg-tech.jpg" alt="Tech" className="h-full w-full object-cover opacity-30 blur-[1px] animate-slow-zoom" />
        </div>

        {/* GLOW */}
        <div className="absolute left-1/2 top-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full z-10 animate-glow" />

        {/* VIDEO */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-full w-full video-mask">
            <video autoPlay muted loop playsInline className="h-full w-full object-contain opacity-70" style={{ filter: 'brightness(1.3) saturate(1.6)' }}>
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* SCANNER */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent absolute top-0 left-0 animate-scanner"></div>
        </div>

        {/* GRADIENT: ТЕПЕРЬ ОН ЧУТЬ ПРОЗРАЧНЕЕ, ЧТОБЫ НЕ ГАСИТЬ ВСЁ */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#05070a] via-[#05070a]/80 to-transparent w-[75%]" />

        {/* CONTENT */}
        <div className="relative z-40 mx-auto w-full max-w-7xl px-6">
          <div className="max-w-4xl">
            <div className="mb-10 flex items-center gap-4">
              <Activity size={16} className="text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">SYSTEMS MONITORING ACTIVE</span>
            </div>

            <h1 className="mb-10 text-7xl font-black uppercase tracking-tighter text-white leading-[0.85] md:text-[105px]">
              ПРОЕКТИРУЕМ <br /> 
              <span className="text-blue-500 drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]">ВАШУ <br /> УВЕРЕННОСТЬ.</span>
            </h1>

            <p className="mb-14 max-w-lg text-lg font-medium leading-relaxed text-slate-200 italic border-l-2 border-blue-600 pl-8">
              Инженерные системы безопасности высшего класса. <br />
              От глубокого аудита до полной реализации проекта.
            </p>

            <div className="flex flex-col gap-10">
              <button className="group flex items-center gap-4 rounded-sm bg-blue-600 px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-95 shadow-2xl max-w-fit">
                РАССЧИТАТЬ ПРОЕКТ <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex gap-12 border-t border-white/10 pt-6 max-w-fit">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Sec_Level</span>
                  <span className="text-white font-mono text-xs bg-blue-900/40 px-2 py-0.5 rounded">HIGH_PROT_V.26</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Auth_Status</span>
                  <span className="text-white font-mono text-xs bg-blue-900/40 px-2 py-0.5 rounded">ENCRYPTED_SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION (БЕЗ ИЗМЕНЕНИЙ) */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        {/* ... твой код товаров ... */}
      </section>
    </main>
  )
}