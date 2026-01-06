import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Главная', path: '/' },
    { text: 'Контакты', path: '/contacts' },
    { text: 'Заказать ПО', path: '/order' },
    { text: 'Отзывы', path: '/reviews' },
  ];

  if (isAdmin) {
    menuItems.push({ text: 'Админ', path: '/admin' });
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <Link to="/" className="navbar__link">
            Portfolio
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar__menu-desktop">
          <div className="navbar__list">
            {menuItems.map((item) => (
              <NavLink
                key={item.text}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }>
                {item.text}
              </NavLink>
            ))}
          </div>

          <div className="navbar__auth">
            {isAuthenticated ? (
              <div className="navbar__user-actions">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }>
                  Профиль
                </NavLink>
                <button onClick={handleLogout} className="navbar__logout-button">
                  Выйти
                </button>
              </div>
            ) : (
              <div className="navbar__auth-links">
                <Link to="/login" className="navbar__link">
                  Вход
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar__toggle-btn"
          onClick={handleDrawerToggle}
          aria-label="Открыть меню">
          <MenuIcon />
        </button>

        {/* Mobile Drawer */}
        <div className={`drawer ${mobileOpen ? 'drawer--open' : ''}`}>
          <div className="drawer__overlay" onClick={handleDrawerToggle}></div>
          <div className="drawer__content">
            <div className="drawer__header">
              <button className="drawer__close-btn" onClick={handleDrawerToggle}>
                <CloseIcon />
              </button>
            </div>
            <ul className="drawer__list">
              {menuItems.map((item) => (
                <li key={item.text}>
                  <Link
                    to={item.path}
                    onClick={handleDrawerToggle}
                    className={`drawer__link ${isActive(item.path) ? 'drawer__link--active' : ''}`}>
                    {item.text}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link
                    to="/profile"
                    onClick={handleDrawerToggle}
                    className={`drawer__link ${
                      isActive('/profile') ? 'drawer__link--active' : ''
                    }`}>
                    Профиль
                  </Link>
                </li>
              )}
            </ul>
            <div className="drawer__auth">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-primary btn-block">
                  Выйти
                </button>
              ) : (
                <div className="drawer__auth-group">
                  <Link
                    to="/login"
                    className="btn btn-outline btn-block"
                    onClick={handleDrawerToggle}>
                    Вход
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-block"
                    onClick={handleDrawerToggle}>
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
