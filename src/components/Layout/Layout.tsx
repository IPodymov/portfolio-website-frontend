import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CookieConsent from '../CookieConsent/CookieConsent';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="layout__footer">
        <div className="layout__footer-content">
          <p>&copy; {new Date().getFullYear()} Ivan Podymov. All rights reserved.</p>
          <Link to="/privacy" className="layout__footer-link">Политика конфиденциальности</Link>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default Layout;
