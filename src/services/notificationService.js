import api from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  // Get user token from AsyncStorage
  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Get user ID from AsyncStorage
  async getUserId() {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.contact_id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  // Fetch all notifications for the current user
  async fetchNotifications() {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching notifications for userId:', userId);
      
      // Use the correct notifications endpoint
      const response = await api.get(`/enquiry/${userId}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Notifications response:', response.data);
      
      return {
        success: true,
        data: response.data.notifications || response.data || [],
        message: 'Notifications fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.log('Using sample notifications due to API error');
      
      return {
        success: true,
        data: [],
        message: 'No Notifications'
      };
    }
  }

  // Check for new notifications since a specific timestamp
  async checkForNewNotifications(lastFetchTimestamp) {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      
      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const params = lastFetchTimestamp ? { since: lastFetchTimestamp } : {};
      
      const response = await api.get(`/notifications/${userId}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params
      });

      return {
        success: true,
        data: {
          hasNewNotifications: response.data.hasNewNotifications || false,
          newCount: response.data.newCount || 0
        },
        message: 'New notifications check completed'
      };
    } catch (error) {
      console.error('Error checking for new notifications:', error);
      return {
        success: false,
        data: { hasNewNotifications: false, newCount: 0 },
        message: error.response?.data?.message || 'Failed to check for new notifications'
      };
    }
  }

  // Mark a notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const token = await this.getAuthToken();
      
      // if (!token) {
      //   throw new Error('User not authenticated');
      // }

      const response = await api.put(`/enquiry/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      
      // if (!token || !userId) {
      //   throw new Error('User not authenticated');
      // }

      const response = await api.put(`/enquiry/${userId}/read-all`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'All notifications marked as read'
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark all notifications as read'
      };
    }
  }

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const token = await this.getAuthToken();
      

      const response = await api.delete(`/enquiry/${notificationId}/deleteNotification`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Notification deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete notification'
      };
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      
      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await api.get(`/notifications/${userId}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data.count || 0,
        message: 'Unread count fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return {
        success: false,
        data: 0,
        message: error.response?.data?.message || 'Failed to fetch unread count'
      };
    }
  }

  // Check for new notifications since last fetch
  async checkForNewNotifications(lastFetchTimestamp) {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      
      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await api.get('/notifications/check-new', {
        params: {
          since: lastFetchTimestamp,
          userId: userId
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data,
        message: 'New notifications check completed'
      };
    } catch (error) {
      console.error('Error checking for new notifications:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to check for new notifications'
      };
    }
  }

  // Send a test notification (for development/testing)
  async sendTestNotification(notificationData) {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      
      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await api.post('/notifications/send', {
        userId,
        ...notificationData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Test notification sent successfully'
      };
    } catch (error) {
      console.error('Error sending test notification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send test notification'
      };
    }
  }
}

export default new NotificationService();