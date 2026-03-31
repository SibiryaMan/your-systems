import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

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
      <body className={inter.className}>
        {/* 
           ВАЖНО: Здесь не должно быть тегов <h1>, Sidebar или Navbar, 
           если вы уже вызываете их внутри файла app/catalog/[category]/page.tsx.
           Иначе они будут дублироваться на каждой странице.
        */}
        {children}
      </body>
    </html>
  );
}