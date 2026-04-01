'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Убедитесь, что путь к конфигу верный

export default function Navbar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. ПОЛУЧАЕМ И СОРТИРУЕМ КАТЕГОРИИ
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null); // Берем только главные разделы

      if (data) {
        // Сортировка по весу (1-7), который мы прописали в SQL
        const sorted = data.sort((a, b) => {
          const orderA = parseInt(a.specs?.sort_order) || 999;
          const orderB = parseInt(b.specs?.sort_order) || 999;
          return orderA - orderB;
        });
        setCategories(sorted);
      }
    }
    fetchCategories();
  }, []);

  return (
    <nav className="h-20 w-full bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-[100]">
      {/* ЛОГОТИП */}
      <Link href="/" className="flex items-center gap-3 group select-none">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
        </div>
        <div className="text-2xl font-black tracking-tighter uppercase flex">
          <span className="text-black">YOUR</span>
          <span className="text-blue-600">SYSTEMS</span>
        </div>
      </Link>

      {/* ГЛАВНОЕ МЕНЮ */}
      <div className="flex items-center gap-10">
        {/* КНОПКА КАТАЛОГА (Как на скриншоте) */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-black text-white px-6 py-2.5 rounded-sm flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
          >
            <span className="text-lg leading-none">{isMenuOpen ? '✕' : '≡'}</span>
            Каталог
          </button>

          {/* ВЫПАДАЮЩЕЕ МЕНЮ (МЕГА-МЕНЮ) */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-4 w-72 bg-[#0b0e14] border border-white/5 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-500">
                      {cat.name}
                    </span>
                    <span className="text-blue-500/30 group-hover:text-blue-500 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/projects" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
          Проектирование
        </Link>
        <Link href="/install" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
          Монтаж
        </Link>
      </div>
    </nav>
  );
}