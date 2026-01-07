import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import './Navbar.css';

const MENU_ITEMS = [
  { text: 'Главная', path: '/' },
  { text: 'Обо мне', path: '/about' },
  { text: 'Обсудить проект', path: '/contacts' },
  { text: 'Авторская разработка', path: '/order' },
  { text: 'Отзывы', path: '/reviews' },
];

const Navbar: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const renderAuthButtons = (isMobile = false) => {
    if (authStore.isLoading) {
      return <div className="navbar__auth-loader"></div>;
    }

    if (authStore.isAuthenticated) {
      const user = authStore.user;
      
      if (isMobile) {
        return (
          <div className="navbar__mobile-auth">
            <div className="navbar__mobile-user">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="navbar__avatar-small" />
              ) : (
                <PersonIcon />
              )}
              <span>{user?.name || user?.email}</span>
            </div>
            <Link to="/profile" className="btn btn-outline btn-block">Профиль</Link>
            {authStore.isModerator && (
              <Link to="/admin" className="btn btn-outline btn-block">Админ панель</Link>
            )}
            <button onClick={handleLogout} className="btn btn-primary btn-block">
              Выйти
            </button>
          </div>
        );
      }

      return (
        <div className="navbar__profile-dropdown">
          <button className="navbar__avatar-btn" onClick={toggleProfile}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="navbar__avatar" />
            ) : (
              <PersonIcon />
            )}
          </button>
          
          {isProfileOpen && (
            <>
              <div className="navbar__dropdown-overlay" onClick={() => setIsProfileOpen(false)} />
              <div className="navbar__dropdown-menu">
                <div className="navbar__user-info">
                  <strong>{user?.name}</strong>
                  <small>{user?.email}</small>
                </div>
                <hr />
                <Link to="/profile" className="navbar__dropdown-item">Профиль</Link>
                {authStore.isModerator && (
                  <Link to="/admin" className="navbar__dropdown-item">Админ панель</Link>
                )}
                <button onClick={handleLogout} className="navbar__dropdown-item text-danger">
                  Выйти
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    // Guest state
    if (isMobile) {
      return (
        <div className="navbar__mobile-auth-actions">
          <Link to="/login" className="btn btn-outline btn-block">Вход</Link>
          <Link to="/register" className="btn btn-primary btn-block">Регистрация</Link>
        </div>
      );
    }

    return (
      <div className="navbar__auth-actions">
        <Link to="/login" className="navbar__link">Вход</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Регистрация</Link>
      </div>
    );
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          Portfolio
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav-desktop">
          <div className="navbar__links">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {item.text}
              </NavLink>
            ))}
          </div>
          <div className="navbar__auth-desktop">
            {renderAuthButtons(false)}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="navbar__toggle" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Mobile Fullscreen Menu */}
        <div className={`navbar__mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
          <div className="navbar__mobile-content">
            <nav className="navbar__mobile-nav">
              {MENU_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                  }
                >
                  {item.text}
                </NavLink>
              ))}
            </nav>
            <div className="navbar__mobile-footer">
              {renderAuthButtons(true)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;
