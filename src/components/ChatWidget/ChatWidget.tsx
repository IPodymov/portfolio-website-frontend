import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore, messagesStore } from '../../stores';
import type { User } from '../../types';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ChatWidget.css';

const ChatWidget: React.FC = observer(() => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authStore.isAuthenticated && !authStore.isLoading) {
      messagesStore.loadConversations();
      messagesStore.loadAdmins();
    }
  }, [authStore.isAuthenticated, authStore.isLoading]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    messagesStore.setCurrentChatUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
    messagesStore.setCurrentChatUser(null);
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

  const handleOpenFullPage = () => {
    setIsOpen(false);
    navigate('/messages');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
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
    const currentUserId = authStore.user?.id;
    const adminIds = messagesStore.admins.map(a => a.id);
    const convUserIds = messagesStore.conversations.map(c => c.user.id);
    
    // Add admins who don't have conversations yet (exclude self)
    const adminsWithoutConv = messagesStore.admins.filter(
      a => !convUserIds.includes(a.id) && a.id !== currentUserId
    );
    
    return [
      ...messagesStore.conversations
        .filter(c => c.user.id !== currentUserId) // Exclude self from conversations
        .map(c => ({
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
    <div className="chat-widget">
      {/* Floating Button */}
      <button className="chat-widget__fab" onClick={handleToggle}>
        <ForumIcon />
        {messagesStore.unreadCount > 0 && (
          <span className="chat-widget__badge">{messagesStore.unreadCount}</span>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-widget__popup">
          {/* Header */}
          <div className="chat-widget__header">
            {selectedUser ? (
              <>
                <button className="chat-widget__back" onClick={handleBack}>
                  <ArrowBackIcon />
                </button>
                <div className="chat-widget__header-info">
                  <span className="chat-widget__header-name">{getUserName(selectedUser)}</span>
                  <span className="chat-widget__header-role">
                    {selectedUser.role === 'admin' ? 'Администратор' : 
                     selectedUser.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <ForumIcon />
                <span className="chat-widget__header-title">Сообщения</span>
              </>
            )}
            <div className="chat-widget__header-actions">
              <button className="chat-widget__icon-btn" onClick={handleOpenFullPage} title="Открыть полностью">
                <OpenInNewIcon />
              </button>
              <button className="chat-widget__icon-btn" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="chat-widget__content">
            {selectedUser ? (
              /* Messages View */
              <>
                <div className="chat-widget__messages">
                  {messagesStore.currentMessages.length === 0 ? (
                    <div className="chat-widget__empty">
                      Начните диалог с {getUserName(selectedUser)}
                    </div>
                  ) : (
                    messagesStore.currentMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`chat-widget__message ${
                          msg.senderId === authStore.user?.id ? 'chat-widget__message--mine' : ''
                        }`}
                      >
                        <div className="chat-widget__message-content">{msg.content}</div>
                        <div className="chat-widget__message-time">{formatTime(msg.createdAt)}</div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-widget__input-area">
                  <input
                    type="text"
                    className="chat-widget__input"
                    placeholder="Введите сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="chat-widget__send"
                    onClick={handleSend}
                    disabled={!message.trim()}
                  >
                    <SendIcon />
                  </button>
                </div>
              </>
            ) : (
              /* User List View */
              <div className="chat-widget__user-list">
                {userList().length === 0 ? (
                  <div className="chat-widget__empty">
                    Нет доступных контактов
                  </div>
                ) : (
                  userList().map(item => (
                    <button
                      key={item.user.id}
                      className="chat-widget__user-item"
                      onClick={() => handleSelectUser(item.user)}
                    >
                      <div className="chat-widget__user-avatar">
                        {getInitials(item.user)}
                      </div>
                      <div className="chat-widget__user-info">
                        <div className="chat-widget__user-name">
                          {getUserName(item.user)}
                          {item.isAdmin && (
                            <span className="chat-widget__user-badge">
                              {item.user.role === 'admin' ? 'Admin' : 'Mod'}
                            </span>
                          )}
                        </div>
                        <div className="chat-widget__user-preview">{item.lastMessage}</div>
                      </div>
                      {item.unread > 0 && (
                        <span className="chat-widget__user-unread">{item.unread}</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatWidget;
