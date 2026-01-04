import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
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

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <div className="drawer-header">
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </div>
      <List>
        {menuItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
            
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={Link} 
                to={item.path}
                onClick={handleDrawerToggle}
                className={isActive ? "drawer-link active" : "drawer-link"}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/profile"
              onClick={handleDrawerToggle}
              className={location.pathname.startsWith('/profile') ? "drawer-link active" : "drawer-link"}
            >
              <ListItemText primary="Профиль" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <div className="drawer-auth">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-primary btn-block">
            Выйти
          </button>
        ) : (
          <div className="drawer-auth-buttons">
            <Link to="/login" className="btn btn-outline btn-block" onClick={handleDrawerToggle}>
              Вход
            </Link>
            <Link to="/register" className="btn btn-primary btn-block" onClick={handleDrawerToggle}>
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </Box>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-link">
            Portfolio
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-desktop">
          <div className="navbar-links">
            {menuItems.map((item) => (
              <NavLink 
                key={item.text}
                to={item.path} 
                className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
              >
                {item.text}
              </NavLink>
            ))}
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
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-mobile-toggle">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menu-button"
          >
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;
