import { supabase } from './supabase'
import { ChevronRight, Menu, ShoppingCart, Shield, ArrowRight, Activity, Cpu, Fingerprint } from 'lucide-react'
import { ScrollToTop } from './ScrollToTop'

export default async function Home() {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, subcategories:categories(id, name, slug)')
    .is('parent_id', null)

  const { data: products } = await supabase.from('products').select('*').limit(8)

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      <ScrollToTop />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-100 border-b border-slate-100 bg-white py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600 text-white shadow-lg shadow-blue-900/20">
              <Shield size={20} fill="currentColor" />
            </div>
            <span className="text-[24px] font-black uppercase tracking-tighter pt-0.5">
              YOUR<span className="text-blue-600">SYSTEMS</span>
            </span>
          </div>
          
          <nav className="flex items-center gap-10">
            <div className="relative group pt-1">
              <button className="flex items-center gap-2.5 rounded-sm bg-slate-950 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white hover:bg-blue-600 transition-all active:scale-95 shadow-md cursor-pointer">
                <Menu size={16} strokeWidth={3} /> КАТАЛОГ
              </button>
              
              {/* DROPDOWN MENU */}
              <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="relative flex w-[920px] bg-slate-950/98 backdrop-blur-3xl rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/5 h-auto overflow-hidden">
                  <div className="w-[300px] py-8 border-r border-white/5 bg-black/20 flex flex-col z-20">
                    {categories?.map((cat) => (
                      <div key={cat.id} className="group/item static px-4">
                        <div className="flex items-center justify-between px-6 py-3.5 rounded-sm transition-all hover:bg-blue-600 cursor-default group/row">
                          <span className="text-[11px] font-black uppercase text-white/60 group-hover/item:text-white tracking-widest transition-colors select-none">{cat.name}</span>
                          <ChevronRight size={16} className="text-white/20 group-hover/item:text-white transition-transform group-hover/item:translate-x-1" />
                          <div className="absolute left-[300px] top-0 right-0 bottom-0 bg-[#080a0f] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-150 p-12 z-50 h-full select-none">
                            <h4 className="mb-8 text-[14px] font-black text-white uppercase tracking-[0.2em] border-b border-white/10 pb-5">{cat.name}</h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                              {cat.subcategories?.map((sub: any) => (
                                <a key={sub.id} href={`/catalog/${sub.slug}`} className="group/link flex items-center gap-3 py-1 transition-colors bg-transparent outline-none selection:bg-transparent">
                                  <div className="h-1 w-1 rounded-full bg-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                  <span className="text-[14px] font-bold text-white/40 group-hover/link:text-white leading-tight select-none">{sub.name}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-10">
                    <Cpu size={60} className="mb-6 text-white" strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">INFRASTRUCTURE</p>
                  </div>
                </div>
              </div>
            </div>
            <a href="/services" className="hover:text-slate-950 transition-colors py-1 relative group uppercase text-[11px] font-black tracking-[0.2em] text-slate-400">Услуги</a>
            <a href="/about" className="hover:text-slate-950 transition-colors py-1 relative group uppercase text-[11px] font-black tracking-[0.2em] text-slate-400">О компании</a>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-center overflow-hidden bg-[#05070a] noise-overlay">
        
        {/* VIDEO BACKGROUND (z-10) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="h-full w-full video-mask">
            <video autoPlay muted loop playsInline className="h-full w-full object-contain opacity-80 scale-110" style={{ filter: 'brightness(1.2) saturate(1.4)' }}>
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* SYMMETRIC GRADIENTS (z-20) */}
        <div className="absolute inset-y-0 left-0 z-20 w-1/2 bg-gradient-to-r from-[#05070a] via-[#05070a]/95 to-transparent" />
        <div className="absolute inset-y-0 right-0 z-20 w-1/2 bg-gradient-to-l from-[#05070a] via-[#05070a]/95 to-transparent" />
        
        {/* MAIN CONTENT GRID (z-30) */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
          
          {/* LEFT: TEXT */}
          <div className="max-w-3xl text-left">
            <div className="mb-10 flex items-center gap-4">
              <Activity size={16} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400/80">BIOMETRIC ACCESS SECURED • 2026</span>
            </div>
            
            <h1 className="mb-10 text-7xl font-black uppercase tracking-tighter text-white leading-[0.85] md:text-[105px]">
              ПРОЕКТИРУЕМ <br /> 
              <span className="text-blue-600 drop-shadow-[0_10px_60px_rgba(0,0,0,1)]">ВАШУ <br /> УВЕРЕННОСТЬ.</span>
            </h1>

            <p className="mb-14 max-w-4xl text-lg font-medium leading-relaxed text-slate-200 italic border-l-2 border-blue-600 pl-8">
              Инженерные системы безопасности высшего класса. <br />
              От глубокого аудита до полной реализации проекта.
            </p>

            <button className="group flex items-center gap-4 rounded-sm bg-blue-600 px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-95 shadow-2xl max-w-fit">
               РАССЧИТАТЬ ПРОЕКТ <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* RIGHT: HUD FINGERPRINT */}
          <div className="hidden xl:flex flex-col items-center justify-center gap-6 select-none animate-scanner-pulse">
            <div className="relative p-12 border border-blue-500/20 rounded-full backdrop-blur-sm bg-blue-500/5">
              <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-slow-spin" />
              <Fingerprint size={130} strokeWidth={1} className="text-blue-500 blue-glow-filter opacity-80" />
              <div className="absolute left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] animate-f-scan z-10" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Fingerprint_ID</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Scanning_Active...</p>
            </div>
          </div>

        </div>

        {/* NOISE (z-40) */}
        <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app")' }} />
      </section>

      {/* --- PRODUCTS SECTION --- */}
      <section className="mx-auto max-w-7xl px-6 py-32 bg-white">
        <div className="mb-16 flex items-center justify-between border-b border-slate-100 pb-8">
          <h3 className="text-2xl font-black uppercase tracking-tight">Популярное оборудование</h3>
          <a href="/catalog" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 transition-colors">
            Весь каталог <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {products?.map((item) => (
            <div key={item.id} className="group border border-slate-100 bg-white p-6 transition-all hover:shadow-xl cursor-pointer">
              <div className="mb-5 flex aspect-square items-center justify-center bg-slate-50 text-[10px] font-black uppercase text-slate-200">Engineering Unit</div>
              <h4 className="mb-1 text-[13px] font-black uppercase tracking-tight text-slate-900 line-clamp-1">{item.name}</h4>
              <span className="text-xl font-black tracking-tighter text-slate-900">{item.price?.toLocaleString()} ₽</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}