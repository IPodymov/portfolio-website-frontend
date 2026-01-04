import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <Link to="/" className="navbar-link">
            Главная
          </Link>
          <Link to="/contacts" className="navbar-link">
            Контакты
          </Link>
          <Link to="/order" className="navbar-link">
            Заказать ПО
          </Link>
          <Link to="/reviews" className="navbar-link">
            Отзывы
          </Link>
        </div>
      </div>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="btn navbar-logout-btn">
            Выйти
          </button>
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
