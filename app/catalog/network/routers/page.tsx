import { supabase } from '../../../../lib/supabase';
import Navbar from '../../../../components/Navbar';
import Sidebar from '../../../../components/Sidebar';

export default async function RoutersPage() {
  // ИСПРАВЛЕНИЕ ОШИБКИ 2339:
  // Мы сначала дожидаемся самого клиента (если он Promise), 
  // а затем вызываем .from()
  const client = await supabase; 
  
  const { data: products } = await client
    .from('products')
    .select('*')
    .eq('category_slug', 'routers');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-start">
        {/* Используем Sidebar с корректным пропсом */}
        <Sidebar currentCategory="routers" />
        
        <main className="flex-1 p-16 pt-10">
          <div className="flex items-center gap-8 mb-12">
            <h1 className="text-[72px] font-black uppercase tracking-tighter leading-none text-[#1a1c23]">
              Роутеры
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-12">
            {products?.map((p: any) => (
              <div key={p.id} className="group border border-gray-100 p-8 hover:border-blue-600 transition-all">
                <div className="aspect-square bg-gray-50 mb-6 flex items-center justify-center relative overflow-hidden">
                   <span className="text-[10px] font-black text-gray-200 uppercase italic">YourSystems</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{p.brand}</span>
                  <span className="text-[18px] font-black italic">{p.price} ₽</span>
                </div>
                <h3 className="text-[16px] font-bold uppercase text-[#1a1c23]">{p.name}</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}