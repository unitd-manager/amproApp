import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { 
  fetchNotifications,
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotificationAsync,
  clearError 
} from '../redux/slices/notificationSlice';

const NotificationList = ({ navigation: propNavigation }) => {
  const dispatch = useDispatch();
  const navigation = propNavigation || useNavigation();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    lastFetched 
  } = useSelector(state => state.notifications);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch notifications when component mounts
    dispatch(fetchNotifications());
    
    // Mark notifications as viewed when user opens this screen
    if (global.markNotificationsAsViewed) {
      global.markNotificationsAsViewed();
    }
    
    // Cleanup function to reset viewed state when component unmounts
    return () => {
      // Reset the viewed state so modal can show again on app restart
      if (global.resetNotificationsViewed) {
        global.resetNotificationsViewed();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    console.log('Notifications state changed:', notifications.length, 'notifications');
    console.log('Unread count:', unreadCount);
    notifications.forEach(n => {
      console.log('Notification:', n.id, 'read:', n.read || n.is_read, 'title:', n.title);
    });
  }, [notifications, unreadCount]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };
const handleMarkAsRead = async (id, item) => {
  console.log('Marking notification as read:', id);
  console.log('Notification item data:', JSON.stringify(item, null, 2));
  
  try {
    await dispatch(markNotificationAsRead(id));
    
    // Add delay to ensure mark as read completes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Navigation to EnquiryDetails with item:', item);
    
    if (item) {
      // Ensure we have the proper enquiry data structure
      const enquiryData = {
        ...item,
        enquiry_id: item.enquiry_id || item.id || item.notification_id,
        id: item.enquiry_id || item.id || item.notification_id,
        // Add any other required fields that EnquiryDetails might need
        title: item.title || 'Enquiry Details',
        message: item.message || item.body || ''
      };
      
      console.log('Prepared enquiry data for navigation:', JSON.stringify(enquiryData, null, 2));
      
      // Check if navigation is available and EnquiryDetails screen exists
      if (navigation && navigation.navigate) {
        try {
          navigation.navigate('EnquiryDetails', { 
            enquiry: enquiryData
          });
          console.log('Navigation to EnquiryDetails initiated successfully');
        } catch (navError) {
          console.error('Navigation error:', navError);
         
        }
      } else {
        console.error('Navigation object not available');
       
      }
    } else {
      console.log('No item data available for navigation');
      Alert.alert(
        'Error',
        'No enquiry data available to display details.'
      );
    }
  } catch (error) {
    console.log('Operation failed:', error);
    Alert.alert(
      'Error',
      'Failed to process notification. Please try again.'
    );
  }
};

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteNotification = (id) => {
    console.log('Delete notification requested for ID:', id);
    console.log('Current notifications available:', notifications.map(n => ({ 
      notification_id: n.notification_id, 
      id: n.id, 
      title: n.title 
    })));
    
    if (!id) {
      console.log('No valid ID provided for deletion');
      Alert.alert('Error', 'Cannot delete notification - no valid ID provided');
      return;
    }
    
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              console.log('Dispatching delete notification for ID:', id);
              const result = await dispatch(deleteNotificationAsync(id));
              console.log('Delete result:', result);
              console.log('Result type - fulfilled:', deleteNotificationAsync.fulfilled.match(result));
              console.log('Result type - rejected:', deleteNotificationAsync.rejected.match(result));
              
              if (deleteNotificationAsync.fulfilled.match(result)) {
                console.log('Notification deleted successfully');
               
              } else if (deleteNotificationAsync.rejected.match(result)) {
                console.log('Notification deletion failed:', result.payload);
                Alert.alert('Error', result.payload || 'Failed to delete notification');
              }
            } catch (error) {
              console.error('Error in delete operation:', error);
              Alert.alert('Error', 'An error occurred while deleting the notification');
            }
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  const handleTestNotification = () => {
    console.log('Triggering test notification');
    dispatch(simulateNotification());
  };

  const testNavigation = () => {
    console.log('Testing navigation to EnquiryDetails...');
    try {
      navigation.navigate('EnquiryDetails', { 
        enquiry: {
          enquiry_id: 999,
          id: 999,
          title: 'Test Enquiry',
          message: 'This is a test navigation'
        }
      });
      console.log('Test navigation successful');
    } catch (error) {
      console.error('Test navigation failed:', error);
      Alert.alert('Navigation Test Failed', error.message);
    }
  };

  

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.log('Error formatting time in NotificationList:', error, 'timestamp:', timestamp);
      return 'Just now';
    }
  };

  const renderNotificationItem = ({ item }) => {
    if (!item) return null;
    
    // Use the most reliable ID field - prioritize notification_id, then id
    // Never use timestamp as ID since it's not unique/reliable for deletion
    const notificationId = item.notification_id || item.id;
    const isRead = item.is_read === 1;
    const title = item.title || 'Notification';
    const message = item.message || item.body || 'No message';
    const type = item.type || 'info';
    const timestamp = item.timestamp || item.created_at || new Date().toISOString();
    
    console.log('Rendering notification:', notificationId, 'isRead:', isRead, 'title:', title);
    console.log('Available ID fields - notification_id:', item.notification_id, 'id:', item.id, 'timestamp:', item.timestamp);
    
    return (
      <TouchableOpacity
        style={[styles.notificationItem, !isRead && styles.unreadItem]}
        onPress={() => notificationId && handleMarkAsRead(notificationId, item)}
      >
        <View style={styles.notificationContent}>
          <View style={styles.iconContainer}>
            <Icon 
              name="cash-outline"
              size={24} 
              color="#4CAF50"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, !isRead && styles.unreadTitle]}>
              {title}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
            <Text style={styles.time}>{formatTime(timestamp)}</Text>
          </View>
          {!isRead && <View style={styles.unreadDot} />}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(event) => {
            // Stop the event from bubbling up to the parent TouchableOpacity
            event.stopPropagation();
            if (notificationId) {
              console.log('Delete button pressed for notificationId:', notificationId);
              handleDeleteNotification(notificationId);
            } else {
              console.log('No valid notificationId found for deletion');
              Alert.alert('Error', 'Cannot delete notification - no valid ID found');
            }
          }}
        >
          <Icon name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading && notifications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#1EB1C5" />
          <Text style={styles.emptyText}>Loading notifications...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="notifications-off-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No notifications yet</Text>
        <Text style={styles.emptySubText}>You'll see your notifications here when you receive them</Text>
        {error && (
          <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderErrorBanner = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorBanner}>
        <Icon name="warning-outline" size={16} color="#FF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => dispatch(clearError())}>
          <Icon name="close" size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1EB1C5" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center', alignSelf: 'center' }]}>Notifications</Text>
        <View style={styles.headerButtons}>
          {/* Test navigation button for debugging */}
          <TouchableOpacity onPress={testNavigation} style={styles.testButton}>
            <Icon name="bug-outline" size={20} color="#fff" />
          </TouchableOpacity>
          
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {renderErrorBanner()}
      
      {notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications.filter(item => item != null)}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => {
            const key = item.notification_id?.toString() || item.id?.toString() || item.timestamp;
            console.log('KeyExtractor - notification_id:', item.notification_id, 'id:', item.id, 'timestamp:', item.timestamp, 'final key:', key);
            return key;
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#1EB1C5']}
              tintColor="#1EB1C5"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1EB1C5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 48,
  },
  backButton: {
    padding: 12,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Outfit-Regular',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    padding: 12,
    marginRight: 8,
  },
  markAllButton: {
    padding: 12,
  },
  markAllText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unreadItem: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#1EB1C5',
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
  },
  time: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Outfit-Regular',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1EB1C5',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Outfit-Regular',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Outfit-Regular',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    borderColor: '#FF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#FF4444',
    marginLeft: 8,
    fontFamily: 'Outfit-Regular',
  },
  retryButton: {
    backgroundColor: '#1EB1C5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Outfit-Regular',
  },
});

export default NotificationList;