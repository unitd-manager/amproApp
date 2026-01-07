import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'react-native';
import { fetchNotifications, fetchUnreadCount, checkNewNotifications } from '../redux/slices/notificationSlice';

const useNotificationPolling = (intervalMs = 30000) => { // Poll every 30 seconds
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const isOnline = useSelector(state => state.notifications.isOnline);
  const user = useSelector(state => {
    // Check if user exists in different possible state structures
    return state.auth?.user || state.user || null;
  });

  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      if (isOnline && user) {
        try {
          // Check for new notifications first (lightweight)
          const result = await dispatch(checkNewNotifications()).unwrap();
          
          // If there are new notifications, fetch the full list
          if (result.success && result.data?.hasNew) {
            await dispatch(fetchNotifications()).unwrap();
          }
          
          // Always update unread count
          await dispatch(fetchUnreadCount()).unwrap();
        } catch (error) {
          console.log('Polling error:', error);
        }
      }
    }, intervalMs);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground, fetch latest notifications
        if (isOnline && user) {
          dispatch(fetchNotifications());
          dispatch(fetchUnreadCount());
        }
        startPolling();
      } else if (nextAppState.match(/inactive|background/)) {
        // App is going to background, stop polling
        stopPolling();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Start polling when component mounts if user is logged in and online
    if (isOnline && user) {
      startPolling();
    }

    return () => {
      stopPolling();
      subscription?.remove();
    };
  }, [isOnline, user, intervalMs, dispatch]);

  // Restart polling when online status or user changes
  useEffect(() => {
    if (isOnline && user) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [isOnline, user]);

  return {
    startPolling,
    stopPolling,
    isPolling: !!intervalRef.current
  };
};

export default useNotificationPolling;