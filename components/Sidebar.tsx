'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Sidebar({ categories = [], currentCategory }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const active = searchParams.get('filters')?.split(',') || [];
    setSelected(active);
  }, [searchParams]);

  const toggleFilter = (slug: string) => {
    let newSelected = [...selected];
    if (newSelected.includes(slug)) {
      newSelected = newSelected.filter(s => s !== slug);
    } else {
      newSelected.push(slug);
    }
    const params = new URLSearchParams(searchParams.toString());
    if (newSelected.length > 0) params.set('filters', newSelected.join(','));
    else params.delete('filters');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const subItems = categories.filter((c: any) => c.parent_id === currentCategory?.id);
  const groups = subItems.reduce((acc: any, item: any) => {
    const groupName = item.specs?.group || 'Прочее';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {});

  const groupOrder = [
    'Бренд', 'Видеоаналитика', 'Тип корпуса', 'Исполнение', 
    'Разрешение, Мп', 'Тип объектива', 'Фокусное расстояние, мм', 
    'Подсветка, м', 'Аудио', 'Тревожный вход/выход', 
    'Пылевлагозащита', 'IK', 'Слот под SD-карту', 
    'Wi-Fi', 'PIR-датчик', 'Питание'
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
        {/* ФИКСИРОВАННАЯ ШАПКА */}
        <div className="mb-6 shrink-0 mr-4">
          <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white border-b border-white/10 pb-2">
            {currentCategory?.name || 'КАТАЛОГ'}
          </h2>
        </div>

        {/* СКРОЛЛИРУЕМЫЙ КОНТЕЙНЕР (Скролл внутри черной рамки) */}
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
          <div className="flex flex-col min-h-full justify-between">
            {sortedGroupNames.map((groupName) => {
              const isOpen = !!openGroups[groupName];
              const sortedItems = [...groups[groupName]].sort((a: any, b: any) => {
                const orderA = parseInt(a.specs?.sort_order) || 999;
                const orderB = parseInt(b.specs?.sort_order) || 999;
                return orderA !== orderB ? orderA - orderB : a.name.localeCompare(b.name, undefined, { numeric: true });
              });

              return (
                <div key={groupName} className={`flex flex-col transition-all ${isOpen ? 'py-4' : 'py-0'}`}>
                  <button 
                    onClick={() => toggleGroup(groupName)}
                    className={`w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] transition-colors py-2 ${
                      isOpen ? 'text-blue-500' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{groupName}</span>
                    <span className="text-[9px] opacity-40">{isOpen ? '−' : '+'}</span>
                  </button>
                  
                  {isOpen && (
                    <div className="flex flex-col gap-3 mt-4 mb-4 pl-1 animate-in fade-in duration-300">
                      {sortedItems.map((item: any) => {
                        const isActive = selected.includes(item.slug);
                        return (
                          <div 
                            key={item.id} 
                            className="flex items-center cursor-pointer group"
                            onClick={() => toggleFilter(item.slug)}
                          >
                            <div className={`w-4 h-4 border transition-all flex items-center justify-center mr-4 ${
                              isActive ? 'bg-blue-600 border-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.4)]' : 'border-white/10 group-hover:border-white/40'
                            }`}>
                              {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                            </div>
                            <span className={`text-[12px] font-bold uppercase tracking-tight transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!isOpen && <div className="border-b border-white/5 w-full mt-auto" />}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Стили для аккуратного скроллбара внутри черной зоны */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
      `}</style>
    </aside>
  );
}