// Custom hook for notification management

import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const [notification, setNotification] = useState<any>(null);
  const [permission, setPermission] = useState<boolean>(false);

  useEffect(() => {
    requestPermissions();
    setupNotificationListeners();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermission(status === 'granted');
  };

  const setupNotificationListeners = () => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    return () => subscription.remove();
  };

  const scheduleNotification = async (
    title: string,
    body: string,
    trigger: any
  ) => {
    if (!permission) {
      await requestPermissions();
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
  };

  const cancelNotification = async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    notification,
    permission,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
  };
};
