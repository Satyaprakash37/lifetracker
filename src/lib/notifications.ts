// Browser & In-App Notification Engine
export class NotificationService {
  private permissionGranted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted';
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch {
      return false;
    }
  }

  public isGranted(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    return Notification.permission === 'granted';
  }

  public sendNotification(title: string, body: string) {
    if (typeof window === 'undefined') return;

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification error', e);
      }
    }
  }

  // Trigger test reminder
  public testReminder(userName: string) {
    this.sendNotification(
      `🎯 LifeTracker Reminder for ${userName || 'Champ'}!`,
      `Stay disciplined! Check off your project tasks, gym, and study goals today.`
    );
  }
}

export const notifier = new NotificationService();

