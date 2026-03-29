'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATEGORY_MAP: Record<string, string> = {
  'kamery': 'КАМЕРЫ',
  'registratory': 'РЕГИСТРАТОРЫ',
  'korobki': 'КОРОБКИ',
  'aksessuary-video': 'КОРОБКИ',
  'kronshteiny': 'КРОНШТЕЙНЫ',
  'mikrofony': 'МИКРОФОНЫ'
};

export default function Navbar() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || '';
  const categoryTitle = CATEGORY_MAP[slug] || '';

  return (
    <nav className="h-20 border-b border-gray-100 flex items-center bg-white sticky top-0 z-50">
      {/* ЛЕВАЯ ЧАСТЬ: Центрирование логотипа строго над сайдбаром (320px) */}
      <div className="w-[320px] border-r border-gray-100 h-full flex items-center justify-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#2563eb] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org">
              <path d="M12 2L4 5V11C4 16.18 7.41 21.05 12 22.5C16.59 21.05 20 16.18 20 11V5L12 2Z" fill="white" />
            </svg>
          </div>
          <div className="text-[20px] font-black tracking-tighter flex leading-none">
            <span className="text-[#1a1c23]">YOUR</span>
            <span className="text-[#2563eb]">SYSTEMS</span>
          </div>
        </Link>
      </div>
      
      {/* ПРАВАЯ ЧАСТЬ: Заголовок категории и навигация */}
      <div className="flex flex-1 items-center justify-between px-12">
        <div className="flex items-center gap-6">
          <span className="text-[26px] font-black uppercase tracking-tighter text-[#1a1c23]">
            {categoryTitle}
          </span>
        </div>
        
        <div className="flex gap-10 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Link href="/catalog/kamery" className="text-blue-600 border-b-2 border-blue-600 pb-1">КАТАЛОГ</Link>
          <span className="opacity-20 cursor-not-allowed">ПРОЕКТИРОВАНИЕ</span>
          <span className="opacity-20 cursor-not-allowed">МОНТАЖ</span>
        </div>
      </div>
    </nav>
  );
}