import Link from 'next/link';

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  children?: Category[];
}

export default function CategoryMenu({ categories }: { categories: Category[] }) {
  // Ищем корневую категорию СКУД (ID 3)
  const skudRoot = categories.find(cat => cat.id === 3);

  if (!skudRoot) return null;

  return (
    <div className="catalog-container">
      <h1 className="category-root-title">{skudRoot.name}</h1>

      <div className="category-grid">
        {/* ВТОРОЙ УРОВЕНЬ: Группы (Турникеты, Замки и т.д.) */}
        {skudRoot.children?.map((group) => (
          <div key={group.id} className="category-group">
            <Link href={`/catalog/${group.slug}`} className="subcategory-group-title">
              {group.name}
            </Link>

            {/* ТРЕТИЙ УРОВЕНЬ: Список конкретных товаров */}
            <ul className="items-list">
              {group.children?.map((item) => (
                <li key={item.id}>
                  <Link href={`/catalog/${item.slug}`} className="item-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}