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
  
  // 1. НАЧАЛЬНОЕ СОСТОЯНИЕ: Пустой объект {} — все группы свернуты
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // 2. СБРОС ПРИ СМЕНЕ КАТЕГОРИИ: Сворачиваем всё, если ID категории изменился
  useEffect(() => {
    setOpenGroups({});
  }, [currentCategory?.id]);

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
    if (newSelected.length > 0) {
      params.set('filters', newSelected.join(','));
    } else {
      params.delete('filters');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const subItems = categories.filter((c) => c.parent_id === currentCategory?.id);
  const groups = subItems.reduce((acc: Record<string, Category[]>, item) => {
    const groupName = item.specs?.group || 'Прочее';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {});

  // ИНЖЕНЕРНЫЙ ПОРЯДОК ГРУПП (Build 13)
  const groupOrder = [
    'Бренд', 
    'Видеоаналитика', 
    'Количество каналов', 
    'Пропуск. способность, Мбит/с', 
    'Разрешение, Мп', 
    'Количество HDD',
    'Исполнение',
    'Тип корпуса',
    'Тип объектива',
    'Фокусное расстояние, мм',
    'Подсветка, м',
    'Аудио',
    'Аудиовходы/выходы',
    'Трев. входы/выходы',
    'Тревожный вход/выход',
    'Видеовыходы',
    'LAN порты',
    'Пылевлагозащита',
    'IK',
    'Слот под SD-карту',
    'Wi-Fi',
    'PIR-датчик',
    'Особенности',
    'Питание'
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
    <aside className="w-80 bg-[#0b0e14] h-[calc(100vh-80px)] p-6 text-white border-r border-white/5 select-none overflow-y-auto max-h-screen sticky top-20 scrollbar-thin scrollbar-thumb-blue-500/20">
      <nav className="flex flex-col">
        <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-white mb-8 border-b border-white/10 pb-4">
          ФИЛЬТРЫ: {currentCategory?.name || 'КАТАЛОГ'}
        </h2>

        {sortedGroupNames.map((groupName) => {
          const isOpen = !!openGroups[groupName];
          
          const sortedItems = [...groups[groupName]].sort((a: any, b: any) => {
            const orderA = parseInt(a.specs?.sort_order) || 999;
            const orderB = parseInt(b.specs?.sort_order) || 999;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          });

          return (
            <div key={groupName} className={`border-b border-white/5 transition-all ${isOpen ? 'mb-4 pb-2' : 'mb-0.5'}`}>
              <button 
                onClick={() => toggleGroup(groupName)}
                className={`w-full flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] py-2 transition-colors ${isOpen ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <span>{groupName}</span>
                <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1200px] mt-4 mb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-3.5 pt-1 pl-1">
                  {sortedItems.map((item) => {
                    const isActive = selected.includes(item.slug);
                    return (
                      <div 
                        key={item.id} 
                        className="flex items-center cursor-pointer group"
                        onClick={() => toggleFilter(item.slug)}
                      >
                        <div className={`w-3.5 h-3.5 border transition-all flex items-center justify-center mr-3 ${
                          isActive ? 'bg-blue-600 border-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-white/10 group-hover:border-white/30'
                        }`}>
                          {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${isActive ? 'text-white' : 'text-gray-200'}`}>
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
      `}</style>
    </aside>
  );
}