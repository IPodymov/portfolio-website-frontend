import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { authStore } from './stores';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Contacts from './pages/Contacts/Contacts';
import Order from './pages/Order/Order';
import Reviews from './pages/Reviews/Reviews';
import ReviewDetail from './pages/ReviewDetail/ReviewDetail';
import Profile from './pages/Profile/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import AdminPanel from './pages/Admin/AdminPanel';
import Messages from './pages/Messages/Messages';
import About from './pages/About/About';
import './App.css';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    authStore.checkAuth();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="order" element={<Order />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reviews/:id" element={<ReviewDetail />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="about" element={<About />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
