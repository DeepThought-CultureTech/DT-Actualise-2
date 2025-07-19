import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/round2/Sidebar';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <header><Header /></header>
      <main>{children}</main>
      <footer><Footer /></footer>
    </div>
  );
};

export default PageLayout;