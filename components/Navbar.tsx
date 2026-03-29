'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATEGORY_MAP: Record<string, string> = {
  'kamery': 'КАМЕРЫ',
  'registratory': 'РЕГИСТРАТОРЫ',
  'korobki': 'КОРОБКИ',
  'kronshteiny': 'КРОНШТЕЙНЫ',
  'mikrofony': 'МИКРОФОНЫ'
};

export default function Navbar() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || '';
  const categoryTitle = CATEGORY_MAP[slug] || '';

  return (
    <nav className="h-20 border-b border-gray-100 flex items-center justify-between px-16 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* ЛОГОТИП ИЗ ВАШЕГО ЗАПРОСА */}
        <Link href="/" className="flex items-center gap-4 group">
          {/* Иконка: синий квадрат с белым щитом */}
          <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org">
              <path d="M12 2L4 5V11C4 16.18 7.41 21.05 12 22.5C16.59 21.05 20 16.18 20 11V5L12 2Z" fill="white" />
            </svg>
          </div>
          
          {/* Двухцветный текст */}
          <div className="text-2xl font-black tracking-tighter flex">
            <span className="text-[#1a1c23]">YOUR</span>
            <span className="text-[#2563eb]">SYSTEMS</span>
          </div>
        </Link>
        
        {/* Разделитель и название подкатегории на одной строке */}
        {categoryTitle && (
          <div className="flex items-center gap-6">
            <div className="w-[2px] h-8 bg-gray-100 rotate-[20deg]" />
            <span className="text-[26px] font-black uppercase tracking-tighter text-[#1a1c23]">
              {categoryTitle}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-10 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
        <Link href="/catalog/kamery" className="text-blue-600 border-b-2 border-blue-600 pb-1">КАТАЛОГ</Link>
        <span className="opacity-20 cursor-not-allowed">ПРОЕКТИРОВАНИЕ</span>
        <span className="opacity-20 cursor-not-allowed">МОНТАЖ</span>
      </div>
    </nav>
  );
}