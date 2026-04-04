'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function Navbar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const isCatalogPage = pathname.startsWith('/catalog');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null);
      
      if (data) {
        const sorted = data.sort((a, b) => 
          (parseInt(a.specs?.sort_order) || 999) - (parseInt(b.specs?.sort_order) || 999)
        );
        setCategories(sorted);
      }
    }
    fetchCategories();
  }, [supabase]);

  return (
    <nav className="h-20 w-full bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-[200]">
      <Link href="/" className="flex items-center gap-3 group select-none relative z-[210]">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
        </div>
        <div className="text-2xl font-black tracking-tighter uppercase flex">
          <span className="text-black">YOUR</span>
          <span className="text-blue-600">SYSTEMS</span>
        </div>
      </Link>

      <div className="flex items-center gap-10">
        <div className="relative">
          {!isCatalogPage && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-black text-white px-6 py-2.5 rounded-sm flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all relative z-[210]"
            >
              <span className="text-lg leading-none">{isMenuOpen ? '✕' : '≡'}</span> КАТАЛОГ
            </button>
          )}

          {isMenuOpen && !isCatalogPage && (
            <div className="absolute top-full right-0 mt-4 w-72 bg-[#0b0e14] border border-white/5 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="group flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-500">{cat.name}</span>
                    <span className="text-blue-500/30 group-hover:text-blue-500">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/projects" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black">Проектирование</Link>
        <Link href="/install" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black">Монтаж</Link>
      </div>
    </nav>
  );
}