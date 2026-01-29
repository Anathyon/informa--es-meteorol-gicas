import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import '../styles/pwa-notification.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWANotification = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Verificar se já foi instalado ou se o usuário já fechou a notificação
      const hasClosedNotification = localStorage.getItem('pwa-notification-closed');
      if (!hasClosedNotification) {
        setShowNotification(true);
        
        // Auto-fechar após 3 segundos
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    
    setShowNotification(false);
    localStorage.setItem('pwa-notification-closed', 'true');
  };

  const handleClose = () => {
    setShowNotification(false);
    localStorage.setItem('pwa-notification-closed', 'true');
  };

  if (!showNotification || !deferredPrompt) return null;

  return (
    <div className="pwa-notification">
      <div className="pwa-notification-icon">
        <FiDownload size={24} />
      </div>
      <div className="pwa-notification-content">
        <h4>Instale o App</h4>
        <p>Acesse offline e tenha uma experiência melhor!</p>
      </div>
      <button className="pwa-notification-btn" onClick={handleInstall}>
        Instalar
      </button>
      <button className="pwa-notification-close" onClick={handleClose}>
        <FiX size={20} />
      </button>
    </div>
  );
};
