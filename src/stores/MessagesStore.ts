import { makeAutoObservable, runInAction } from 'mobx';
import type { ChatMessage, Conversation, User } from '../types';
import api from './api';

class MessagesStore {
  conversations: Conversation[] = [];
  currentMessages: ChatMessage[] = [];
  currentChatUser: User | null = null;
  admins: User[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get unreadCount(): number {
    return this.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }

  async loadAdmins() {
    try {
      const response = await api.get<User[]>('/messages/admins');
      runInAction(() => {
        this.admins = response.data;
      });
    } catch (err) {
      console.error('Failed to load admins', err);
    }
  }

  async loadConversations() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.get<Conversation[]>('/messages/conversations');
      runInAction(() => {
        this.conversations = response.data;
      });
    } catch (err) {
      console.error('Failed to load conversations', err);
      runInAction(() => {
        this.error = 'Не удалось загрузить сообщения';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadMessages(userId: number) {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.get<ChatMessage[]>(`/messages/${userId}`);
      runInAction(() => {
        this.currentMessages = response.data;
        // Mark as read
        const conv = this.conversations.find(c => c.user.id === userId);
        if (conv) {
          conv.unreadCount = 0;
        }
      });
    } catch (err) {
      console.error('Failed to load messages', err);
      runInAction(() => {
        this.error = 'Не удалось загрузить сообщения';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async sendMessage(receiverId: number, content: string): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.post<ChatMessage>('/messages', {
        receiverId,
        content,
      });
      
      runInAction(() => {
        this.currentMessages.push(response.data);
        
        // Update conversation or create new one
        const convIndex = this.conversations.findIndex(c => c.user.id === receiverId);
        if (convIndex >= 0) {
          this.conversations[convIndex].lastMessage = response.data;
        } else {
          // If no conversation exists, reload conversations to get the new one
          this.loadConversations();
        }
      });
      
      return true;
    } catch (err) {
      console.error('Failed to send message', err);
      runInAction(() => {
        this.error = 'Не удалось отправить сообщение';
      });
      return false;
    }
  }

  setCurrentChatUser(user: User | null) {
    this.currentChatUser = user;
    if (user) {
      this.loadMessages(user.id);
    } else {
      this.currentMessages = [];
    }
  }

  clearError() {
    this.error = null;
  }

  reset() {
    this.conversations = [];
    this.currentMessages = [];
    this.currentChatUser = null;
    this.admins = [];
    this.error = null;
  }
}

export const messagesStore = new MessagesStore();
