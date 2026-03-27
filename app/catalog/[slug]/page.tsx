'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { ShoppingCart, ChevronDown, Check, SlidersHorizontal, Shield, Activity } from 'lucide-react'

// 1. КОНСТАНТЫ: ПОЛНАЯ ВИДЕОАНАЛИТИКА (14 ПУНКТОВ)
const FULL_ANALYTICS = [
  'Детекция движения', 'Детекция т/с', 'Детекция человека', 'Пересечение линии', 
  'Периметр', 'Вторжение в зону', 'Изменение сцены', 'Захват лиц', 
  'Подсчет людей', 'Скопление людей', 'Праздношатание', 'Оставленные предметы', 
  'Распознавание лиц', 'Распознавание автомобильных номеров'
]

// 2. ИЗОЛИРОВАННЫЕ ГРУППЫ НАВИГАЦИИ (БЕЗ "АКСЕССУАРОВ")
const NAV_GROUPS = {
  surveillance: [
    { slug: 'kamery', name: 'Камеры' },
    { slug: 'videoregistratory', name: 'Регистраторы' },
    { slug: 'montazhnye-korobki', name: 'Коробки' },
    { slug: 'kronshteyny', name: 'Кронштейны' },
    { slug: 'mikrofony', name: 'Микрофоны' }
  ],
  networking: [
    { slug: 'kommutatory', name: 'Коммутаторы' },
    { slug: 'marshrutizatory', name: 'Роутеры' }
  ]
}

// 3. ПОЛНЫЙ СЛОВАРЬ КИРИЛЛИЦЫ (ЗАЩИТА ОТ ЛАТИНИЦЫ)
const CYRILLIC_TITLES: Record<string, string> = {
  'kamery': 'Камеры видеонаблюдения',
  'cameras': 'Камеры видеонаблюдения',
  'videoregistratory': 'Видеорегистраторы',
  'registrators': 'Видеорегистраторы',
  'registratory': 'Видеорегистраторы',
  'montazhnye-korobki': 'Монтажные коробки',
  'aksessuary-video': 'Монтажные коробки', // Редирект названия
  'kronshteyny': 'Кронштейны для камер',
  'mikrofony': 'Микрофоны системные',
  'kommutatory': 'Сетевые коммутаторы',
  'switches': 'Сетевые коммутаторы',
  'marshrutizatory': 'Маршрутизаторы и роутеры',
  'routers': 'Маршрутизаторы и роутеры'
}

// 4. МАКСИМАЛЬНАЯ БАЗА ФИЛЬТРОВ (ВОССТАНОВЛЕНО ВСЁ)
const MASTER_FILTERS_DB: Record<string, any> = {
  'cameras': {
    'Бренд': ['Hikvision', 'HiWatch', 'iFlou', 'Ezviz', 'TRASSIR', 'Dahua', 'LTV', 'Tiandy'],
    'Видеоаналитика': FULL_ANALYTICS,
    'Тип корпуса': ['Купол', 'Цилиндр', 'Компактный', 'Рыбий глаз', 'Взрывозащищенный'],
    'Исполнение': ['Внутреннее', 'Уличное', 'Взрывозащищенное'],
    'Разрешение, Мп': ['2', '4', '5', '6', '8', '12'],
    'Тип объектива': ['Фиксированный', 'Вариофокальный', 'Моторизированный'],
    'Фокусное расстояние, мм': ['2.8', '3.6', '4', '2.7-12', '2.7-13.5'],
    'Подсветка, м': ['от 1 до 15 м', 'от 20 до 40 м', 'от 45 до 90 м', 'от 100+ м'],
    'Слот под SD-карту': ['Да', 'Нет'],
    'Wi-Fi': ['Да', 'Нет'],
    'PIR-датчик': ['Да', 'Нет'],
    'Пылевлагозащита': ['IP40', 'IP54', 'IP66', 'IP67', 'IP68', 'Нет'],
    'IK': ['08', '10', 'Нет'],
    'Аудио': ['Аудиовход', 'Аудиовыход', 'Встроенный динамик', 'Микрофон'],
    'Тревожный вход/выход': ['Да', 'Нет'],
    'Питание': ['AC 24В', 'DC 12В', 'DC 5В', 'PoE']
  },
  'recorders': {
    'Бренд': ['Hikvision', 'HiWatch', 'iFlou', 'TRASSIR', 'Dahua', 'LTV', 'Tiandy'],
    'Видеоаналитика': FULL_ANALYTICS,
    'Количество каналов': ['4', '8', '16', '32', '64', '128'],
    'Количество HDD': ['1', '2', '4', '8', '16'],
    'Макс. разрешение записи IP, Мп': ['2', '4', '6', '8', '12', '32'],
    'Пропуск. способность, Мбит/с': ['40', '80', '160', '256', '320'],
    'PoE порты': ['4 порта', '8 портов', '16 портов', '24 порта', 'Нет'],
    'Доп. интерфейсы': ['USB', 'RS-485', 'RS-232', 'eSATA', 'Alarm I/O'],
    'Особенности': ['SFP порт', 'Вывод 4К изображения', 'Для установки в стойку', 'Модуль Wi-Fi'],
    'Трев. входы/выходы': ['Да', 'Нет'],
    'Аудиовходы/выходы': ['Да', 'Нет'],
    'Видеовыходы': ['HDMI', 'VGA', 'BNC'],
    'LAN порты': ['1', '2', '4']
  },
  'switches': {
    'Бренд': ['Hikvision', 'Dahua', 'TP-Link', 'Keenetic', 'MikroTik'],
    'Тип': ['Неуправляемый', 'Управляемый L2', 'Управляемый L3'],
    'Количество портов': ['4', '8', '16', '24', '48'],
    'Количество портов PoE': ['4', '8', '16', '24', '48', 'Нет'],
    'Скорость портов': ['10/100 Мбит/с', '1 Гбит/с', '10 Гбит/с'],
    'Бюджет PoE, Вт': ['30-60 Вт', '60-120 Вт', '120-250 Вт', '370+ Вт'],
    'Особенности': ['SFP порты', 'Uplink порты', 'В стойку 19"', 'Металлический корпус', 'Hi-PoE', 'CCTV режим'],
    'Питание': ['AC 100-240В', 'DC 12В', 'DC 48-52В', 'PoE-in']
  },
  'boxes': { 
    'Бренд': ['Hikvision', 'Dahua', 'LTV', 'HiWatch'], 
    'Материал': ['Пластик', 'Алюминий', 'Сталь'], 
    'Защита': ['IP65', 'IP66', 'IP67'],
    'IK': ['08', '10', 'Нет']
  },
  'brackets': { 'Бренд': ['Hikvision', 'Dahua', 'HiWatch', 'LTV'], 'Тип кронштейна': ['Настенный', 'Потолочный', 'На столб'] },
  'microphones': {
    'Бренд': ['ATIX', 'Dahu', 'ESM', 'Stelberry'],
    'Питание': ['DC 12В', 'DC 5В', 'DC 9В'],
    'Акустическая дальность': ['от 1 до 5 м', 'от 5 до 10 м', 'от 10 до 20 м'],
    'Частота, Гц': ['50 - 15000 Гц', '100 - 10000 Гц', '20 - 20000 Гц']
  }
}

// 5. ЛОГИКА ОПРЕДЕЛЕНИЯ КОНТЕКСТА
const getPageContext = (slug: string) => {
  const isNet = ['kommutatory', 'switches', 'marshrutizatory', 'routers'].includes(slug);
  
  let filterKey = 'cameras';
  if (slug.includes('registr') || slug.includes('record')) filterKey = 'recorders';
  else if (slug.includes('kommut') || slug.includes('switch')) filterKey = 'switches';
  else if (slug.includes('korobk') || slug === 'aksessuary-video') filterKey = 'boxes';
  else if (slug.includes('kronsht')) filterKey = 'brackets';
  else if (slug.includes('mikrof')) filterKey = 'microphones';

  return {
    navGroup: isNet ? NAV_GROUPS.networking : NAV_GROUPS.surveillance,
    filterKey: filterKey,
    title: CYRILLIC_TITLES[slug] || slug.toUpperCase()
  }
}

export default function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { navGroup, filterKey, title } = getPageContext(slug)
  const currentFilters = MASTER_FILTERS_DB[filterKey]

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.keys(currentFilters).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-600 selection:text-white">
      <div className="mx-auto max-w-[1800px] px-8 pt-8 pb-8 flex gap-12 items-start">
        
        {/* SIDEBAR: ЛОГО + КОНФИГУРАТОР (СИММЕТРИЯ 32px) */}
        <aside className="w-[320px] flex-shrink-0 sticky top-8 h-[calc(100vh-64px)] flex flex-col gap-8">
          
          <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity">
             <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-600 text-white shadow-lg"><Shield size={22} fill="currentColor" /></div>
             <span className="text-[24px] font-black uppercase tracking-tighter text-slate-950 pt-0.5">YOUR<span className="text-blue-600">SYSTEMS</span></span>
          </Link>

          <div className="flex-1 flex flex-col border border-slate-200 bg-white rounded-sm shadow-xl overflow-hidden min-h-0">
            <div className="p-4 bg-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2"><SlidersHorizontal size={14} className="text-blue-500" /><h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white pt-0.5">Конфигуратор</h2></div>
              <Activity size={12} className="text-blue-900 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar overscroll-contain">
              {Object.entries(currentFilters).map(([filterName, options]: [string, any]) => (
                <div key={filterName} className="border-b border-slate-50 last:border-0 px-2">
                  <button onClick={() => setOpenSections(p => ({ ...p, [filterName]: !p[filterName] }))} className="flex w-full items-center justify-between px-4 py-3.5 text-left group">
                    <span className="text-[11px] font-bold uppercase tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{filterName}</span>
                    <ChevronDown size={12} className={`text-slate-300 transition-transform ${openSections[filterName] ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {openSections[filterName] && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="grid grid-cols-1 gap-y-1.5">
                        {options.map((option: string) => (
                          <label key={option} className="flex items-start gap-3 cursor-pointer group/item py-0.5">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5"><input type="checkbox" className="peer appearance-none w-3.5 h-3.5 border border-slate-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 transition-all" /><Check size={8} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" /></div>
                            <span className="text-[13px] font-medium text-slate-600 group-hover/item:text-slate-950 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
              <button className="w-full bg-blue-600 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-white hover:bg-blue-500 transition-all active:scale-95 shadow-md">Применить параметры</button>
            </div>
          </div>
        </aside>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex-1">
          <nav className="flex gap-1 mb-8 border-b border-slate-100">
            {navGroup.map((link) => {
               // Умная подсветка активной вкладки
               const isActive = slug === link.slug || 
                               (slug === 'registrators' && link.slug === 'videoregistratory') ||
                               (slug === 'aksessuary-video' && link.slug === 'montazhnye-korobki');
               return (
                <Link key={link.slug} href={`/catalog/${link.slug}`} className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-2 -mb-[2px] ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-950 hover:border-slate-200'}`}>
                  {link.name}
                </Link>
               );
            })}
          </nav>

          <div className="h-10 flex items-center border-b border-slate-100 pb-12 mb-10 box-content">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950 leading-none">{title}</h1>
          </div>

          {/* СЕТКА ТОВАРОВ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, p) => (
              <div key={p} className="group bg-white border border-slate-100 p-8 transition-all hover:border-blue-400 hover:shadow-2xl relative overflow-hidden text-left">
                <div className="mb-6 aspect-square bg-slate-50 flex items-center justify-center text-[10px] font-black uppercase text-slate-200 border border-slate-100">Hardware_Preview</div>
                <div className="mb-4">
                  <h3 className="text-[16px] font-black uppercase tracking-tight text-slate-900 leading-tight mb-1 line-clamp-1">DH-YS-PRO-{filterKey.toUpperCase().substring(0,3)}-{p}00</h3>
                  <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest leading-none">Enterprise_V26_Series</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-3xl font-black tracking-tighter text-slate-950 font-sans leading-none">{p % 2 === 0 ? '14 890' : '32 400'} ₽</span>
                  <button className="h-12 w-12 bg-slate-950 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-90 shadow-md"><ShoppingCart size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}