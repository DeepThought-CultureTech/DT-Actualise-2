import React from 'react';
import { Open_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Sidebar from '@/components/round2/Sidebar';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className={`flex flex-col min-h-screen ${openSans.className}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
