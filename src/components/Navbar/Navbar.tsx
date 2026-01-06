import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, isModerator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const menuItems = [
    { text: 'Главная', path: '/' },
    { text: 'Контакты', path: '/contacts' },
    { text: 'Заказать ПО', path: '/order' },
    { text: 'Отзывы', path: '/reviews' },
  ];

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
                <div className="navbar__dropdown-container">
                  <button 
                    className="navbar__profile-btn" 
                    onClick={handleDropdownToggle}
                    aria-label="Меню профиля"
                  >
                    <PersonIcon />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="navbar__dropdown-menu">
                      <Link 
                        to="/profile" 
                        className="navbar__dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Профиль
                      </Link>
                      
                      {isModerator && (
                        <Link 
                          to="/admin" 
                          className="navbar__dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Админ панель
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout} 
                        className="navbar__dropdown-item navbar__dropdown-item--logout"
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                  
                  {/* Overlay to close dropdown when clicking outside */}
                  {dropdownOpen && (
                    <div 
                      className="navbar__dropdown-overlay" 
                      onClick={() => setDropdownOpen(false)}
                    />
                  )}
                </div>
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
              {isAuthenticated && isModerator && (
                <li>
                  <Link
                    to="/admin"
                    onClick={handleDrawerToggle}
                    className={`drawer__link ${
                      isActive('/admin') ? 'drawer__link--active' : ''
                    }`}>
                    Админ панель
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
