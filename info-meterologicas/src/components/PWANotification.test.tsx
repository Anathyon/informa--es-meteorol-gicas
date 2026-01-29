import { render } from '@testing-library/react';
import { PWANotification } from './PWANotification';

describe('PWANotification', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('não deve renderizar se não houver evento beforeinstallprompt', () => {
    const { container } = render(<PWANotification />);
    expect(container.firstChild).toBeNull();
  });

  it('não deve renderizar se o usuário já fechou a notificação anteriormente', () => {
    localStorage.setItem('pwa-notification-closed', 'true');
    const { container } = render(<PWANotification />);
    expect(container.firstChild).toBeNull();
  });
});
