'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { ShoppingCart, ChevronDown, Check, SlidersHorizontal, Shield, Activity } from 'lucide-react'

// 1. ПОЛНЫЙ СЛОВАРЬ ИМЕН (КИРИЛЛИЦА)
const CATEGORY_MAP: Record<string, { title: string; navName: string }> = {
  'kamery': { title: 'Камеры видеонаблюдения', navName: 'Камеры' },
  'cameras': { title: 'Камеры видеонаблюдения', navName: 'Камеры' },
  'videoregistratory': { title: 'Видеорегистраторы', navName: 'Регистраторы' },
  'registrators': { title: 'Видеорегистраторы', navName: 'Регистраторы' },
  'registratory': { title: 'Видеорегистраторы', navName: 'Регистраторы' },
  'montazhnye-korobki': { title: 'Монтажные коробки', navName: 'Коробки' },
  'kronshteyny': { title: 'Кронштейны', navName: 'Кронштейны' },
  'mikrofony': { title: 'Микрофоны', navName: 'Микрофоны' },
  'aksessuary-video': { title: 'Аксессуары для видео', navName: 'Аксессуары' }
}

const NAV_LINKS = [
  { slug: 'kamery', name: 'Камеры' },
  { slug: 'videoregistratory', name: 'Регистраторы' },
  { slug: 'montazhnye-korobki', name: 'Коробки' },
  { slug: 'kronshteyny', name: 'Кронштейны' },
  { slug: 'mikrofony', name: 'Микрофоны' }
]

// 2. ДАННЫЕ ВИДЕОАНАЛИТИКИ (Общие для камер и регистраторов)
const VIDEO_ANALYTICS = [
  'Детекция движения', 'Детекция т/с', 'Детекция человека', 'Пересечение линии', 
  'Периметр', 'Вторжение в зону', 'Изменение сцены', 'Захват лиц', 
  'Подсчет людей', 'Скопление людей', 'Праздношатание', 'Оставленные предметы', 
  'Распознавание лиц', 'Распознавание автомобильных номеров'
]

// 3. ГЕНЕРАТОР ФИЛЬТРОВ (ВСЕ ПУНКТЫ БЕЗ ПОТЕРЬ)
const MASTER_FILTERS: Record<string, any> = {
  'cameras': {
    'Бренд': ['Hikvision', 'HiWatch', 'iFlou', 'Ezviz', 'TRASSIR', 'Dahua', 'LTV', 'Tiandy'],
    'Видеоаналитика': VIDEO_ANALYTICS,
    'Тип корпуса': ['Купол', 'Цилиндр', 'Компактный', 'Рыбий глаз', 'Взрывозащищенный'],
    'Исполнение': ['Внутреннее', 'Уличное', 'Взрывозащищенное'],
    'Разрешение, Мп': ['2', '4', '5', '6', '8', '12'],
    'Тип объектива': ['Фиксированный', 'Вариофокальный', 'Моторизированный'],
    'Фокусное расстояние, мм': ['2.7-12', '2.7-13.5', '2.8', '2.8-12', '3.6', '4'],
    'Подсветка, м': ['от 1 до 15 м', 'от 20 до 40 м', 'от 45 до 90 м', 'от 100 до 200 м'],
    'Слот под SD-карту': ['Да', 'Нет'],
    'Wi-Fi': ['Да', 'Нет'],
    'PIR-датчик': ['Да', 'Нет'],
    'Пылевлагозащита': ['IP40', 'IP42', 'IP54', 'IP65', 'IP66', 'IP67', 'IP68', 'Нет'],
    'IK': ['08', '10', 'Нет'],
    'Аудио': ['Аудиовход', 'Аудиовыход', 'Встроенный динамик', 'Встроенный микрофон', 'Нет'],
    'Тревожный вход/выход': ['Да', 'Нет'],
    'Питание': ['AC 24В', 'AC100В', 'DC 12В', 'DC 5В', 'PoE']
  },
  'recorders': {
    'Бренд': ['Hikvision', 'HiWatch', 'iFlou', 'TRASSIR', 'Dahua', 'LTV', 'Tiandy'],
    'Видеоаналитика': VIDEO_ANALYTICS,
    'Количество каналов': ['4', '8', '16', '32', '64', '128'],
    'Пропуск. способность, Мбит/с': ['40', '60', '80', '160', '256', '320'],
    'Макс. разрешение записи IP, Мп': ['2', '4', '6', '8', '12', '32'],
    'Количество HDD': ['1', '2', '4', '8', '16'],
    'Трев. входы/выходы': ['Да', 'Нет'],
    'Аудиовходы/выходы': ['Да', 'Нет'],
    'Видеовыходы': ['HDMI', 'VGA', 'BNC'],
    'Особенности': ['SFP порт', 'Вывод 4К изображения', 'Для установки в стойку', 'Модуль Wi-Fi'],
    'LAN порты': ['1', '2', '4'],
    'PoE порты': ['4 порта', '8 портов', '16 портов', '24 порта', 'Нет'],
    'Доп. интерфейсы': ['USB', 'RS-485', 'RS-232', 'eSATA', 'Alarm I/O']
  },
  'boxes': {
    'Бренд': ['Hikvision', 'Dahua', 'LTV'],
    'Материал': ['Пластик', 'Алюминий', 'Сталь'],
    'Защита': ['IP65', 'IP66', 'IP67']
  },
  'brackets': { 'Бренд': ['Hikvision', 'Dahua', 'LTV'], 'Тип кронштейна': ['Настенный', 'Потолочный', 'На столб'] },
  'mics': { 'Бренд': ['Stelberry', 'Шорох'], 'Питание, В': ['12В', '5В'], 'Частота, Гц': ['50-15000', '100-10000'] }
}

const GET_FILTER_KEY = (slug: string): string => {
  const map: Record<string, string> = {
    'kamery': 'cameras', 'cameras': 'cameras',
    'videoregistratory': 'recorders', 'registrators': 'recorders', 'registratory': 'recorders',
    'montazhnye-korobki': 'boxes', 'kronshteyny': 'brackets', 'mikrofony': 'microphones'
  }
  return map[slug] || 'cameras'
}

export default function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const filterKey = GET_FILTER_KEY(slug)
  const currentFilters = MASTER_FILTERS[filterKey] || MASTER_FILTERS['cameras']
  const categoryInfo = CATEGORY_MAP[slug] || { title: slug.toUpperCase(), navName: slug }

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.keys(currentFilters).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-600 selection:text-white">
      <div className="mx-auto max-w-[1800px] px-8 pt-8 pb-8 flex gap-12 items-start">
        
        {/* SIDEBAR: СИММЕТРИЯ 32px */}
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

        {/* CONTENT */}
        <div className="flex-1">
          <nav className="flex gap-1 mb-8 border-b border-slate-100 pb-0.5">
            {NAV_LINKS.map((link) => {
               const isActive = filterKey === GET_FILTER_KEY(link.slug);
               return (
                <Link key={link.slug} href={`/catalog/${link.slug}`} className={`px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900 hover:border-slate-200'}`}>{link.name}</Link>
               );
            })}
          </nav>

          <div className="h-10 flex items-center border-b border-slate-100 pb-12 mb-10 box-content">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950 leading-none">{categoryInfo.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, p) => (
              <div key={p} className="group bg-white border border-slate-100 p-8 transition-all hover:border-blue-400 hover:shadow-2xl relative overflow-hidden text-left">
                <div className="mb-6 aspect-square bg-slate-50 flex items-center justify-center text-[10px] font-black uppercase text-slate-200 border border-slate-100">Engineering_Hardware</div>
                <div className="mb-4">
                  <h3 className="text-[16px] font-black uppercase tracking-tight text-slate-900 leading-tight mb-1 line-clamp-1">DH-DEVICE-{filterKey.toUpperCase()}-{p}00</h3>
                  <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest leading-none">Enterprise_V26_Series</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-3xl font-black tracking-tighter text-slate-950 font-sans leading-none">{filterKey === 'recorders' ? '32 900' : '14 890'} ₽</span>
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