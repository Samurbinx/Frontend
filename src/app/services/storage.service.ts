import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
// Manejo del sessionStorage y las cookies
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  // Establecer un item en cookies
  setCookie(name: string, value: string, days: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Convertir días a milisegundos
      const cookieValue = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      document.cookie = cookieValue;
    }
  }

  // Obtener un item de cookies
  getCookie(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const nameEQ = `${name}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  // Eliminar un item de cookies
  removeCookie(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setCookie(name, '', -1); // Establecer la cookie a una fecha pasada
    }
  }

  // Establecer un item en sessionStorage
  setSessionItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId) && window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  }

  // Obtener un item de sessionStorage
  getSessionItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId) && window.sessionStorage) {
      return window.sessionStorage.getItem(key);
    }
    return null;
  }

  // Eliminar un item de sessionStorage
  removeSessionItem(key: string): void {
    if (isPlatformBrowser(this.platformId) && window.sessionStorage) {
      window.sessionStorage.removeItem(key);
    }
  }

  // Limpiar todo sessionStorage
  clearSession(): void {
    if (isPlatformBrowser(this.platformId) && window.sessionStorage) {
      window.sessionStorage.clear();
    }
  }
}