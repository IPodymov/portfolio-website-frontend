import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/" className="navbar-link">
            Portfolio
          </Link>
        </div>
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
          >
            Главная
          </NavLink>
          <NavLink 
            to="/contacts" 
            className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
          >
            Контакты
          </NavLink>
          <NavLink 
            to="/order" 
            className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
          >
            Заказать ПО
          </NavLink>
          <NavLink 
            to="/reviews" 
            className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
          >
            Отзывы
          </NavLink>
        </div>
      </div>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="navbar-user-actions">
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
            >
              Профиль
            </NavLink>
            <button
              onClick={handleLogout}
              className="btn navbar-logout-btn">
              Выйти
            </button>
          </div>
        ) : (
          <div className="navbar-auth-links">
            <Link to="/login" className="navbar-link">
              Вход
            </Link>
            <Link
              to="/register"
              className="btn btn-primary">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
