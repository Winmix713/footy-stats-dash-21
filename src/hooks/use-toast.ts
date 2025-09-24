import { useState, useCallback } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

let toastCount = 0;
const generateId = () => `toast-${++toastCount}`;

// Simple toast system without external dependencies
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-hide after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 5000);
    }
    
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    hideAllToasts
  };
};

// Simple toast function for direct use
export const toast = {
  success: (message: string, description?: string) => console.log('Success:', message, description),
  error: (message: string, description?: string) => console.error('Error:', message, description),
  info: (message: string, description?: string) => console.info('Info:', message, description),
  warning: (message: string, description?: string) => console.warn('Warning:', message, description),
};