'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="h-20 w-full bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-100">
      {/* ЛОГОТИП YOURSYSTEMS (Эталонная копия) */}
      <Link href="/" className="flex items-center gap-3 group select-none">
        {/* Синий квадрат */}
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          {/* Белый щит (Классическая форма) */}
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
        </div>
        
        {/* Текстовая часть: YOUR (черный) SYSTEMS (синий) */}
        <div className="text-2xl font-black tracking-tighter uppercase flex">
          <span className="text-black">YOUR</span>
          <span className="text-blue-600">SYSTEMS</span>
        </div>
      </Link>

      {/* МЕНЮ */}
      <div className="flex gap-10">
        <Link 
          href="/catalog" 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border-b-2 border-blue-600 pb-1"
        >
          Каталог
        </Link>
        <Link 
          href="/projects" 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
        >
          Проектирование
        </Link>
        <Link 
          href="/install" 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
        >
          Монтаж
        </Link>
      </div>
    </nav>
  );
}