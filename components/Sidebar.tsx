'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Решение ошибки TS2322: Описываем входящие данные
interface SidebarProps {
  currentCategory: string;
}

const CAMERA_FILTERS = [
  "4K Разрешение", "Встроенный микрофон", "ИК-подсветка 50м+", 
  "Полноцветная ночью", "Детекция лиц", "Распознавание номеров", 
  "PTZ управление", "Wi-Fi модуль", "Слот для SD-карты", 
  "Антивандальный корпус", "Уличная IP67", "Питание PoE", 
  "WDR 120dB", "Сжатие H.265+", "Видеоаналитика AI", "Объектив 2.8мм"
];

export default function Sidebar({ currentCategory }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-[320px] bg-[#0f1116] text-white p-10 pt-12 sticky top-20 h-[calc(100vh-80px)] flex flex-col border-r border-white/5 shadow-2xl">
      <div className="mb-14 relative">
        <div className="absolute -left-10 top-0 w-1.5 h-10 bg-blue-600" />
        <h2 className="text-[18px] font-black uppercase tracking-[0.3em] text-white italic">— ФИЛЬТРЫ</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
        <section>
          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-8 italic">
            // ХАРАКТЕРИСТИКИ ({currentCategory === 'kamery' ? '16' : '0'})
          </h3>
          <div className="space-y-5">
            {currentCategory === 'kamery' && CAMERA_FILTERS.map(filter => (
              <label key={filter} className="flex items-center group cursor-pointer">
                <div className="w-5 h-5 border-2 border-gray-800 mr-5 transition-all group-hover:border-blue-600 flex items-center justify-center">
                   <div className="w-2 h-2 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[13px] font-bold uppercase text-gray-500 group-hover:text-white transition-colors">{filter}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6 italic">// БРЕНД</h3>
          <div className="space-y-4">
            {['HIKVISION', 'HIWATCH', 'DAHUA', 'TRASSIR', 'LTV'].map(brand => (
              <label key={brand} className="flex items-center group cursor-pointer">
                <div className="w-5 h-5 border-2 border-gray-800 mr-5 transition-all group-hover:border-blue-600" />
                <span className="text-[13px] font-bold uppercase text-gray-500 group-hover:text-white">{brand}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <button className="mt-10 w-full py-5 bg-blue-600 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
        ПРИМЕНИТЬ ФИЛЬТРЫ
      </button>
    </aside>
  );
}