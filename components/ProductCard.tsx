// components/ProductCard.tsx
import React from 'react';

// Описываем, какие данные приходят в карточку (для VS Code)
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  specs: {
    brand?: string;
    speed?: string;
    wifi?: string;
    ports?: number;
    [key: string]: any; // Позволяет добавлять любые другие свойства в JSONB
  };
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* 1. Изображение товара */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-slate-100 mb-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm italic">
            Нет фото
          </div>
        )}
      </div>

      {/* 2. Название и Категория */}
      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {product.category}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* 3. Характеристики из JSONB (specs) */}
        <div className="mt-3 space-y-1.5 border-t border-slate-50 pt-3">
          {product.specs?.brand && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Бренд:</span>
              <span className="font-medium text-slate-800">{product.specs.brand}</span>
            </div>
          )}
          {product.specs?.speed && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Скорость:</span>
              <span className="font-medium text-slate-800">{product.specs.speed}</span>
            </div>
          )}
          {product.specs?.wifi && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Стандарт:</span>
              <span className="font-medium text-slate-800">{product.specs.wifi}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Цена и Кнопка купить */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex flex-col">
          <span className="text-sm text-slate-500">Цена</span>
          <span className="text-xl font-black text-slate-900">
            {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
          </span>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-95">
          В корзину
        </button>
      </div>
    </div>
  );
}