import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Playground',
  description: 'A personal archive of interesting web effects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <h1 className='text-4xl font-bold text-center p-4'>Playground</h1>
        {children}
      </body>
    </html>
  );
}
