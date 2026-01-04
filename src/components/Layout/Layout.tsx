import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CookieConsent from '../CookieConsent/CookieConsent';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Ivan Podymov. All rights reserved.</p>
          <Link to="/privacy" className="footer-link">Политика конфиденциальности</Link>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default Layout;
