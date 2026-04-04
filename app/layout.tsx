import './globals.css';

export const metadata = {
  title: 'YourSystems | Инженерные системы',
  description: 'Профессиональное оборудование для систем безопасности',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased font-sans bg-white text-slate-900">
        {/* 
           ВАЖНО: Здесь не должно быть тегов <h1>, Sidebar или Navbar, 
           если вы уже вызываете их внутри файлов страниц (например, в CatalogPage).
           Иначе они будут дублироваться на каждой странице.
        */}
        {children}
      </body>
    </html>
  );
}