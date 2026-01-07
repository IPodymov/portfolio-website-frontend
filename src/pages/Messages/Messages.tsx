import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore, messagesStore } from '../../stores';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { User } from '../../types';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import './Messages.css';

const Messages: React.FC = observer(() => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate('/login');
      return;
    }
    messagesStore.loadConversations();
    messagesStore.loadAdmins();
  }, [navigate]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    messagesStore.setCurrentChatUser(user);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    
    const success = await messagesStore.sendMessage(selectedUser.id, message.trim());
    if (success) {
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + 
           ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (user: User) => {
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
  };

  const getUserName = (user: User) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email || 'Пользователь';
  };

  // Combine admins with existing conversations for user list
  const userList = () => {
    const adminIds = messagesStore.admins.map(a => a.id);
    const convUserIds = messagesStore.conversations.map(c => c.user.id);
    
    const adminsWithoutConv = messagesStore.admins.filter(a => !convUserIds.includes(a.id));
    
    return [
      ...messagesStore.conversations.map(c => ({
        user: c.user,
        lastMessage: c.lastMessage?.content || 'Начните диалог',
        unread: c.unreadCount,
        isAdmin: adminIds.includes(c.user.id),
      })),
      ...adminsWithoutConv.map(a => ({
        user: a,
        lastMessage: 'Начните диалог',
        unread: 0,
        isAdmin: true,
      })),
    ];
  };

  if (!authStore.isAuthenticated) {
    return null;
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Sidebar with contacts */}
        <div className="messages-sidebar">
          <div className="messages-sidebar__header">
            <ForumIcon />
            <h2>Сообщения</h2>
          </div>
          
          <div className="messages-sidebar__list">
            {messagesStore.isLoading ? (
              <div className="messages-sidebar__loading">
                <LoadingSpinner />
              </div>
            ) : userList().length === 0 ? (
              <div className="messages-sidebar__empty">
                Нет доступных контактов
              </div>
            ) : (
              userList().map(item => (
                <button
                  key={item.user.id}
                  className={`messages-contact ${selectedUser?.id === item.user.id ? 'messages-contact--active' : ''}`}
                  onClick={() => handleSelectUser(item.user)}
                >
                  <div className="messages-contact__avatar">
                    {getInitials(item.user)}
                  </div>
                  <div className="messages-contact__info">
                    <div className="messages-contact__name">
                      {getUserName(item.user)}
                      {item.isAdmin && (
                        <span className="messages-contact__badge">
                          {item.user.role === 'admin' ? 'Admin' : 'Mod'}
                        </span>
                      )}
                    </div>
                    <div className="messages-contact__preview">{item.lastMessage}</div>
                  </div>
                  {item.unread > 0 && (
                    <span className="messages-contact__unread">{item.unread}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="messages-chat">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="messages-chat__header">
                <div className="messages-chat__user-avatar">
                  {getInitials(selectedUser)}
                </div>
                <div className="messages-chat__user-info">
                  <span className="messages-chat__user-name">{getUserName(selectedUser)}</span>
                  <span className="messages-chat__user-role">
                    {selectedUser.role === 'admin' ? 'Администратор' : 
                     selectedUser.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-chat__messages">
                {messagesStore.currentMessages.length === 0 ? (
                  <div className="messages-chat__empty">
                    <PersonIcon />
                    <p>Начните диалог с {getUserName(selectedUser)}</p>
                  </div>
                ) : (
                  messagesStore.currentMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`messages-bubble ${
                        msg.senderId === authStore.user?.id ? 'messages-bubble--mine' : ''
                      }`}
                    >
                      <div className="messages-bubble__content">{msg.content}</div>
                      <div className="messages-bubble__time">{formatTime(msg.createdAt)}</div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="messages-chat__input-area">
                <input
                  type="text"
                  className="messages-chat__input"
                  placeholder="Введите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="messages-chat__send"
                  onClick={handleSend}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="messages-chat__placeholder">
              <ForumIcon />
              <h3>Выберите диалог</h3>
              <p>Выберите контакт слева, чтобы начать общение</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Messages;
