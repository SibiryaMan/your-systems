import { Oswald, Inter } from "next/font/google";
import "./globals.css";

// Подключаем Oswald из интернета (безопасно)
const oswald = Oswald({ 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-oswald" 
});

// Подключаем Inter для обычного текста
const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-inter" 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}> 
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}