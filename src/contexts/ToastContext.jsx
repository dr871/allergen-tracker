import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { F } from '../constants/allergens.js';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const id = Date.now();
    setToast({ message, type, id, exiting: false });
    timerRef.current = setTimeout(() => {
      setToast(t => t && t.id === id ? { ...t, exiting: true } : t);
      setTimeout(() => setToast(t => t && t.id === id ? null : t), 300);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={toast.exiting ? 'toast-exit' : 'toast-enter'}
          style={{
            position: 'fixed',
            bottom: 'calc(90px + var(--sab))',
            left: 20, right: 20,
            zIndex: 300,
            background: toast.type === 'success' ? 'var(--toast-success-bg)' : 'var(--toast-error-bg)',
            color: 'var(--toast-text)',
            padding: '14px 20px',
            borderRadius: 12,
            fontFamily: F,
            fontSize: 15,
            fontWeight: 600,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          {toast.type === 'success' ? '\u2713 ' : '\u26A0 '}{toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
