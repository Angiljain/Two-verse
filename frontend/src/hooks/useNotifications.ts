'use client';
import { useEffect, useCallback, useRef } from 'react';

export function useNotifications() {
  const hasPermission = useRef(false);

  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        hasPermission.current = true;
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          hasPermission.current = perm === 'granted';
        });
      }
    }
  }, []);

  const notify = useCallback((title: string, body: string, icon?: string) => {
    if (!hasPermission.current || !('Notification' in window)) return;

    // Only notify if page is not focused (user is in a different tab/app)
    if (document.visibilityState === 'visible') return;

    const n = new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'twoverse-message', // Replaces old notif instead of stacking
      requireInteraction: false,
      silent: false,
    });

    n.onclick = () => {
      window.focus();
      n.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => n.close(), 5000);
  }, []);

  return { notify };
}
