import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import type { User } from '../../types';
import './Profile.css';

const ProfileForm: React.FC<{ user: User; login: (token: string, user: User) => void }> = ({ user, login }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    password: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const updateData: Partial<User> & { password?: string } = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await authApi.updateProfile(updateData);

      // Update context
      const token = localStorage.getItem('token');
      if (token) {
        login(token, updatedUser);
      }

      setStatus('success');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Failed to update profile:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {status === 'success' && <div className="success-message">Profile updated successfully!</div>}
      {status === 'error' && <div className="error-message">{errorMessage}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, login } = useAuth();

  if (!user) {
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  return <ProfileForm user={user} login={login} key={user.id} />;
};

export default Profile;
