'use client'

import React, { useState, use } from 'react'
import { ShoppingCart, ChevronDown, Check, SlidersHorizontal, Shield, Activity } from 'lucide-react'

const CAMERA_FILTERS = {
  'Бренд': ['Hikvision', 'HiWatch', 'iFlou', 'Ezviz', 'TRASSIR', 'Dahua', 'LTV', 'Tiandy'],
  'Видеоаналитика': ['Детекция движения', 'Детекция т/с', 'Детекция человека', 'Пересечение линии', 'Периметр', 'Вторжение в зону', 'Изменение сцены', 'Захват лиц', 'Подсчет людей', 'Скопление людей', 'Праздношатание', 'Оставленные предметы', 'Распознавание лиц', 'Распознавание номеров'],
  'Тип корпуса': ['Купол', 'Цилиндр', 'Компактный', 'Рыбий глаз', 'Взрывозащищенный'],
  'Исполнение': ['Внутреннее', 'Уличное', 'Взрывозащищенное'],
  'Разрешение, Мп': ['2', '4', '5', '6', '8', '12'],
  'Тип объектива': ['Фиксированный', 'Вариофокальный', 'Моторизированный'],
  'Фокусное расстояние, мм': ['2.7 - 12', '2.7 - 13.5', '2.8', '2.8 - 12', '3.6', '4'],
  'Подсветка, м': ['от 1 до 15 м', 'от 20 до 40 м', 'от 45 до 90 м', 'от 100 до 200 м'],
  'Слот под SD-карту': ['Да', 'Нет'],
  'Wi-Fi': ['Да', 'Нет'],
  'PIR-датчик': ['Да', 'Нет'],
  'Пылевлагозащита': ['IP40', 'IP42', 'IP54', 'IP65', 'IP66', 'IP67', 'IP68', 'Нет'],
  'IK': ['08', '10', 'Нет'],
  'Аудио': ['Аудиовход', 'Аудиовыход', 'Встроенный динамик', 'Встроенный микрофон', 'Нет'],
  'Тревожный вход/выход': ['Да', 'Нет'],
  'Питание': ['AC 24В', 'AC100В ~ 240В', 'DC 12В', 'DC 24В', 'DC 36В', 'DC 5В', 'PoE']
}

export default function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.keys(CAMERA_FILTERS).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      <div className="mx-auto max-w-[1800px] px-6 py-6">
        
        {/* ВЕРХНЯЯ ПАНЕЛЬ: ЛОГОТИП И НАЗВАНИЕ */}
        <div className="flex items-center gap-10 border-b border-slate-100 pb-6 mb-8 h-10 box-content">
          <div className="flex items-center gap-2.5 shrink-0">
             <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600 text-white shadow-lg">
                <Shield size={18} fill="currentColor" />
             </div>
             <span className="text-[20px] font-black uppercase tracking-tighter text-slate-950 pt-0.5">
                YOUR<span className="text-blue-600">SYSTEMS</span>
             </span>
          </div>
          <div className="h-6 w-[1px] bg-slate-200" />
          <h1 className="text-[32px] font-black uppercase tracking-tighter text-slate-950 pt-1 leading-none whitespace-nowrap">
            {slug === 'kamery' ? 'Камеры видеонаблюдения' : slug.replace('-', ' ')}
          </h1>
        </div>

        <div className="flex gap-10 items-start">
          
          {/* SIDEBAR: СТРОГО В ПРЕДЕЛАХ ВИДИМОСТИ ЭКРАНА */}
          <aside className="w-[320px] flex-shrink-0 sticky top-24 h-[calc(100vh-140px)]">
            <div className="flex flex-col h-full border border-slate-200 bg-white rounded-sm shadow-xl overflow-hidden">
              
              {/* Шапка (Фиксированная) */}
              <div className="p-4 bg-slate-950 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-blue-500" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white pt-0.5">Конфигуратор</h2>
                </div>
                <Activity size={12} className="text-blue-900 animate-pulse" />
              </div>

              {/* Тело фильтра (ТОЛЬКО ЭТА ЧАСТЬ СКРОЛЛИТСЯ) */}
              <div className="flex-1 overflow-y-auto bg-white custom-scrollbar overscroll-contain">
                {Object.entries(CAMERA_FILTERS).map(([filterName, options]) => (
                  <div key={filterName} className="border-b border-slate-50 last:border-0">
                    <button 
                      onClick={() => toggleSection(filterName)}
                      className="flex w-full items-center justify-between px-5 py-3.5 text-left group"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                        {filterName}
                      </span>
                      <ChevronDown size={12} className={`text-slate-300 transition-transform ${openSections[filterName] ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    
                    {openSections[filterName] && (
                      <div className="px-5 pb-4 pt-0">
                        <div className="grid grid-cols-1 gap-y-2">
                          {options.map((option) => (
                            <label key={option} className="flex items-start gap-3 cursor-pointer group/item">
                              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input type="checkbox" className="peer appearance-none w-3.5 h-3.5 border border-slate-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 transition-all" />
                                <Check size={8} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <span className="text-[13px] font-medium text-slate-600 group-hover/item:text-slate-950 transition-colors leading-tight">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Кнопка "Применить" (Фиксированная внизу, ВСЕГДА ВИДНА) */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
                <button className="w-full bg-blue-600 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-white hover:bg-blue-500 transition-all active:scale-95 shadow-md">
                  Применить параметры
                </button>
              </div>
            </div>
          </aside>

          {/* СЕТКА ТОВАРОВ */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {Array.from({ length: 9 }).map((_, p) => (
                <div key={p} className="group bg-white border border-slate-100 p-8 transition-all hover:border-blue-400 hover:shadow-2xl relative overflow-hidden">
                  <div className="mb-6 aspect-square bg-slate-50 flex items-center justify-center text-[10px] font-black uppercase text-slate-200 border border-slate-100">
                     Hardware_Engineering_V26
                  </div>
                  <div className="mb-4">
                    <h3 className="text-[16px] font-black uppercase tracking-tight text-slate-900 leading-tight mb-1">DH-IPC-HFW1230S-VLC</h3>
                    <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">Engineering Series</p>
                  </div>
                  <div className="space-y-1.5 mb-10 border-l-2 border-slate-100 pl-4 py-1 text-[11px] text-slate-500 font-medium">
                     4Мп • 2.8mm • IP67 • PoE
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-3xl font-black tracking-tighter text-slate-950 font-sans leading-none">14 890 ₽</span>
                    <button className="h-12 w-12 bg-slate-950 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-90 shadow-md">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}