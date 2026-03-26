import { supabase } from './supabase'
import { ChevronRight, Menu, ShoppingCart, ShieldCheck, Zap, Globe, Gauge } from 'lucide-react'

export default async function Home() {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, subcategories:categories(id, name, slug)')
    .is('parent_id', null)

  const { data: products } = await supabase.from('products').select('*').limit(8)

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. СТЕКЛЯННАЯ ШАПКА (Glassmorphism) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-oswald text-4xl md:text-5xl uppercase tracking-tighter text-blue-600 leading-none pt-1">
            YourSystems
          </h1>
          
          <nav className="flex gap-8 items-center">
            <div className="relative group">
              <button className="bg-blue-600 text-white px-7 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-200 active:scale-95 relative z-50">
                <Menu size={20} />
                <span className="tracking-tight uppercase text-sm">Каталог</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-[640px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40 flex overflow-hidden translate-y-4 group-hover:translate-y-0">
                <div className="w-1/2 bg-white py-6 border-r border-slate-50 z-20">
                  {categories?.map((cat) => (
                    <div key={cat.id} className="group/item px-4">
                      <div className="flex items-center justify-between px-5 py-3.5 hover:bg-blue-600 hover:text-white rounded-2xl cursor-pointer transition-all duration-150">
                        <span className="text-[11px] font-black uppercase tracking-widest">{cat.name}</span>
                        <ChevronRight size={14} className="opacity-40 group-hover/item:translate-x-1 transition-all" />
                      </div>
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 p-10 z-30 overflow-y-auto">
                        <div className="flex items-center gap-3 mb-8 border-b border-blue-50 pb-5">
                          <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                          <h4 className="font-oswald text-3xl text-blue-700 uppercase leading-none">{cat.name}</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {cat.subcategories?.map((sub: any) => (
                            <a key={sub.id} href={`/catalog/${sub.slug}`} className="text-[15px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-2xl transition-all font-semibold border border-transparent hover:border-blue-100">
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-1/2 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
                   <ShieldCheck size={64} className="text-blue-100 mb-6 animate-pulse" />
                   <p className="text-[10px] text-slate-300 uppercase font-black tracking-[0.3em] leading-relaxed">
                     Выберите раздел<br/>инженерных систем
                   </p>
                </div>
              </div>
            </div>
            <a href="/services" className="hidden sm:block text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Услуги</a>
          </nav>
        </div>
      </header>

      {/* 2. ГЕРОЙ-БЛОК (Hero Section) */}
      <section className="relative bg-slate-900 py-32 text-white px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/30">Russia • Engineering • 2024</span>
            <h2 className="font-oswald text-7xl md:text-9xl uppercase tracking-tighter mb-6 leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
              Safety<br/>Systems
            </h2>
            <p className="text-lg text-slate-400 font-medium mb-10 max-w-lg leading-relaxed">
              Комплексные системы безопасности YourSystems: от проектирования до профессионального монтажа «под ключ» по всей РФ.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 uppercase text-xs tracking-widest active:scale-95">Связаться с нами</button>
              <div className="flex -space-x-3 items-center ml-4">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">★</div>)}
                <span className="pl-6 text-xs font-bold text-slate-500 italic">500+ проектов выполнено</span>
              </div>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 p-8 rounded-[40px] border border-slate-700/50 backdrop-blur-sm">
                <Globe className="text-blue-500 mb-4" size={32} />
                <h5 className="font-bold mb-2">Вся Россия</h5>
                <p className="text-xs text-slate-500">Доставка и монтажные бригады в любом регионе.</p>
             </div>
             <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-600/20 mt-8">
                <Zap className="text-white mb-4" size={32} />
                <h5 className="font-bold mb-2">Экспресс</h5>
                <p className="text-xs text-blue-100">Проектирование систем за 24 часа.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. ВИТРИНА ТОВАРОВ (Cards) */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-oswald text-5xl md:text-6xl uppercase text-slate-900 tracking-tighter mb-2">На витрине</h2>
            <p className="text-slate-400 font-medium">Отобранное оборудование от YourSystems</p>
          </div>
          <a href="/catalog" className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-slate-900 font-black text-[10px] hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">Смотреть всё</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products?.map((item) => (
            <div key={item.id} className="group relative">
              <div className="bg-white p-8 rounded-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col h-full group-hover:-translate-y-2">
                <div className="w-full h-44 bg-slate-50 rounded-[32px] mb-8 flex items-center justify-center text-slate-200 font-oswald text-4xl uppercase overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   YS
                </div>
                <h3 className="font-black text-xl text-slate-800 line-clamp-1 mb-3">{item.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">{item.description}</p>
                <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-1">Price</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{item.price?.toLocaleString()} ₽</span>
                  </div>
                  <button className="bg-slate-900 text-white w-14 h-14 rounded-[20px] flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl active:scale-90">
                    <ShoppingCart size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}