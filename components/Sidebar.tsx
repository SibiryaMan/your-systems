'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  specs?: {
    group?: string;
    sort_order?: number;
  };
}

export default function Sidebar({ categories = [], currentCategory }: { categories: Category[], currentCategory: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // 1. СТРОГИЙ СБРОС: Сворачиваем всё при смене категории
  useEffect(() => {
    setOpenGroups({});
  }, [currentCategory?.id]);

  // 2. СИНХРОНИЗАЦИЯ: Читаем фильтры из URL
  useEffect(() => {
    const active = searchParams.get('filters')?.split(',') || [];
    setSelected(active);
  }, [searchParams]);

  const toggleFilter = (slug: string) => {
    const active = selected.includes(slug) ? selected.filter(s => s !== slug) : [...selected, slug];
    const params = new URLSearchParams(searchParams.toString());
    if (active.length > 0) params.set('filters', active.join(',')); else params.delete('filters');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Группировка дочерних категорий (фильтров)
  const subItems = categories.filter((c: any) => c.parent_id === currentCategory?.id);
  const groups = subItems.reduce((acc: any, item: any) => {
    const g = item.specs?.group || 'Прочее';
    if (!acc[g]) acc[g] = []; acc[g].push(item); return acc;
  }, {});

  // ИНЖЕНЕРНЫЙ ПОРЯДОК ГРУПП (Build 20 - v2.6.7 Optimized)
  const groupOrder = [
    'Бренд',
    'Видеоаналитика',
    // --- ПОГРУЖНАЯ ТЕЛЕМЕТРИЯ (MIKRODRIVE) ---
    'Назначение',
    'Рабочее давление',
    'Рабочая температура',
    'Диаметр корпуса',
    // --- АНТЕННО-ФИДЕРНОЕ ОБОРУДОВАНИЕ ---
    'Тип антенны',
    'Частотный диапазон',
    'Коэффициент усиления',
    'Технология MIMO',
    'Интерфейс',
    // --- СЕТЕВОЕ ОБОРУДОВАНИЕ ---
    'Стандарт PoE',
    'Стандарт связи',
    'Количество SIM-карт',
    'Интерфейсы',
    'Частота',
    'Дальность связи',
    'Пропускная способность',
    'Частота Wi-Fi',
    'Стандарт Wi-Fi',
    'Тип модуля',
    'Тип волокна',
    'Скорость передачи',
    'Мобильная связь',
    'Скорость портов',
    'Количество портов LAN',
    'Количество портов WAN',
    'Тип маршрутизатора',
    'Тип коммутатора',
    'Количество портов Downlink',
    'Количество портов Uplink',
    'Количество портов PoE',
    'PoE',
    'Гигабитные порты',
    'Исполнение',
    'Способ установки',
    // --- ВИДЕОНАБЛЮДЕНИЕ ---
    'Разрешение, Мп',
    'Тип корпуса',
    'Подсветка, м',
    'Аудио',
    'Количество каналов',
    // --- ОБЩИЕ ПАРАМЕТРЫ ---
    'Пылевлагозащита',
    'IK',
    'Питание',
    'Особенности',
    'Материал'
  ];

  const sortedGroupNames = Object.keys(groups).sort((a, b) => {
    const indexA = groupOrder.indexOf(a);
    const indexB = groupOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <aside className="w-80 bg-[#0b0e14] h-[calc(100vh-80px)] p-8 pr-4 text-white border-r border-white/5 select-none sticky top-20 flex flex-col overflow-hidden">
      <nav className="flex flex-col h-full">
        <div className="mb-6 shrink-0 mr-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60 border-b border-white/5 pb-2">
            Параметры системы
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
          <div className="flex flex-col min-h-full">
            {sortedGroupNames.map((groupName) => {
              const isOpen = !!openGroups[groupName];
              const sortedItems = [...groups[groupName]].sort((a: any, b: any) => {
                const orderA = parseInt(a.specs?.sort_order) || 999;
                const orderB = parseInt(b.specs?.sort_order) || 999;
                return orderA !== orderB ? orderA - orderB : a.name.localeCompare(b.name, undefined, { numeric: true });
              });

              return (
                <div key={groupName} className="flex flex-col">
                  <button 
                    onClick={() => setOpenGroups(prev => ({...prev, [groupName]: !prev[groupName]}))} 
                    className={`w-full flex items-start justify-between text-[10px] font-black uppercase tracking-[0.2em] py-2 transition-colors text-left ${
                      isOpen ? 'text-blue-500' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <span className="whitespace-normal leading-tight pr-4">{groupName}</span>
                    <span className="text-[9px] opacity-30 shrink-0 mt-0.5">{isOpen ? '−' : '+'}</span>
                  </button>
                  
                  {isOpen && (
                    <div className="flex flex-col gap-0.5 mt-1 mb-4 pl-1 animate-in fade-in duration-300">
                      {sortedItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center cursor-pointer group py-0.5"
                          onClick={() => toggleFilter(item.slug)}
                        >
                          <div className={`w-3 h-3 border transition-all flex items-center justify-center mr-3 ${
                            selected.includes(item.slug) ? 'bg-blue-600 border-blue-600' : 'border-white/10 group-hover:border-white/30'
                          }`}>
                            {selected.includes(item.slug) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${
                            selected.includes(item.slug) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isOpen && <div className="border-b border-white/5 w-full" />}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { width: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
}