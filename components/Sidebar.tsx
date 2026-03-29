'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
  currentCategory: string;
}

const CAMERA_FILTERS_DATA = {
  "Бренд": ["Hikvision", "HiWatch", "iFlou", "Ezviz", "TRASSIR", "Dahua", "LTV", "Tiandy"],
  "Корпус": ["Купол", "Цилиндр", "Компактный", "Рыбий глаз", "Взрывозащищенный"],
  "Исполнение": ["Внутреннее", "Уличное", "Взрывозащищенное"],
  "Разрешение (Мп)": ["2", "4", "5", "6", "8", "12"],
  "Объектив": ["Фиксированный", "Вариофокальный", "Моторизированный"],
  "Фокусное расстояние (мм)": ["2.7 - 12", "2.7 - 13.5", "2.8", "2.8 - 12", "3.6", "4"],
  "Подсветка": ["от 1 до 15 м", "от 20 до 40 м", "от 45 до 90 м", "от 100 до 200 м"],
  "Функции": ["Слот под SD-карту", "Wi-Fi модуль", "PIR-датчик", "Тревожный вход/выход"],
  "Защита": ["IP40", "IP42", "IP54", "IP65", "IP66", "IP67", "IP68", "IK08", "IK10"],
  "Аудио": ["Аудиовход", "Аудиовыход", "Встроенный динамик", "Встроенный микрофон"],
  "Питание": ["AC 24В", "AC100В ~ 240В", "DC 12В", "DC 24В", "DC 36В", "DC 5В", "PoE"],
  "Видеоаналитика": [
    "Детекция движения", "Детекция т/с", "Детекция человека", "Пересечение линии", 
    "Периметр", "Вторжение в зону", "Изменение сцены", "Захват лиц", 
    "Подсчет людей", "Скопление людей", "Праздношатание", "Оставленные предметы", 
    "Распознавание лиц", "Распознавание автомобильных номеров"
  ]
};

export default function Sidebar({ currentCategory }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const params: Record<string, string[]> = {};
    searchParams.forEach((value, key) => { params[key] = value.split(','); });
    setActiveFilters(params);
  }, [searchParams]);

  const toggleFilter = (category: string, value: string) => {
    const current = activeFilters[category] || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    setActiveFilters({ ...activeFilters, [category]: updated });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(','));
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-[320px] bg-[#0f1116] text-white p-10 pt-12 sticky top-20 h-[calc(100vh-80px)] flex flex-col border-r border-white/5 shadow-2xl">
      <div className="mb-14 relative">
        <div className="absolute -left-10 top-0 w-1.5 h-10 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
        <h2 className="text-[20px] font-black uppercase tracking-[0.3em] text-white italic leading-none">
          ФИЛЬТРЫ
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pr-4 custom-scrollbar">
        {Object.entries(CAMERA_FILTERS_DATA).map(([groupName, options]) => (
          <section key={groupName} className="border-b border-white/5 pb-8 last:border-0">
            <h3 className="text-[11px] font-black text-blue-600/80 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rotate-45" />
              {groupName}
            </h3>
            <div className="space-y-3 pl-3">
              {options.map(option => {
                const isChecked = activeFilters[groupName]?.includes(option);
                return (
                  <label key={option} className="flex items-center group cursor-pointer">
                    <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleFilter(groupName, option)} />
                    <div className={`w-4 h-4 border-2 mr-4 transition-all flex items-center justify-center 
                      ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-700 group-hover:border-gray-500'}`}>
                      {isChecked && <div className="w-1.5 h-1.5 bg-white rotate-45" />}
                    </div>
                    <span className={`text-[13px] font-medium transition-colors tracking-tight
                      ${isChecked ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <button onClick={applyFilters} className="mt-8 w-full py-5 bg-blue-600 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
        ПРИМЕНИТЬ ПАРАМЕТРЫ
      </button>
    </aside>
  );
}