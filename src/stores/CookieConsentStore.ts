import { makeAutoObservable } from 'mobx';

class CookieConsentStore {
  isAccepted = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  get isVisible(): boolean {
    return !this.isAccepted;
  }

  private loadFromStorage() {
    this.isAccepted = localStorage.getItem('cookieConsent') === 'true';
  }

  accept() {
    this.isAccepted = true;
    localStorage.setItem('cookieConsent', 'true');
  }
}

export const cookieConsentStore = new CookieConsentStore();
