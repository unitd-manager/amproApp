import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead } from '../redux/slices/notificationSlice';

const { width, height } = Dimensions.get('window');

const NotificationModal = ({ visible, onClose, navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications?.notifications || []);
  const unreadNotifications = notifications.filter(notification => {
    const isUnread = notification.is_read === 0;
    console.log('NotificationModal Debug - Notification:', notification.title, 'is_read:', notification.is_read, 'read:', notification.read, 'unread:', isUnread);
    return isUnread;
  }).slice(0, 3); // Show only first 3 unread
  const { isDarkMode = false } = useSelector(state => state.theme || {});

  console.log('NotificationModal Debug - Component rendered');
  console.log('NotificationModal Debug - Visible prop:', visible);
  console.log('NotificationModal Debug - Total notifications:', notifications.length);
  console.log('NotificationModal Debug - Unread notifications (filtered):', unreadNotifications.length);
  console.log('NotificationModal Debug - First notification:', notifications[0]);

  // Debug: Always show if visible is true for testing
  if (visible) {
    console.log('Modal should be visible - rendering modal content');
  }

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification);
    // Mark notification as read
    const notificationId = notification.notification_id || notification.id;
    if (notificationId) {
      dispatch(markAsRead(notificationId));
    }
    onClose();
    // Always navigate to NotificationList page when notification is clicked
    if (navigation) {
      try {
        navigation.navigate('NotificationList');
      } catch (error) {
        console.log('Navigation error:', error);
      }
    }
  };

  const handleViewAll = () => {
    onClose();
    if (navigation) {
      try {
        navigation.navigate('NotificationList');
      } catch (error) {
        console.log('Navigation error:', error);
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) {
      console.log('No timestamp provided, returning "Just now"');
      return 'Just now';
    }
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid timestamp:', timestamp);
        return 'Just now';
      }
      
      const diffInMinutes = (now - date) / (1000 * 60);
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else {
        const diffInHours = diffInMinutes / 60;
        return `${Math.floor(diffInHours)}h ago`;
      }
    } catch (error) {
      console.log('Error formatting time:', error, 'timestamp:', timestamp);
      return 'Just now';
    }
  };

  const renderNotificationItem = ({ item }) => {
    console.log('Rendering notification item:', {
      title: item.title,
      timestamp: item.timestamp,
      type: item.type,
      hasTimestamp: !!item.timestamp,
      timestampType: typeof item.timestamp
    });
    
    return (
      <TouchableOpacity
        style={[styles.notificationItem, isDarkMode && styles.notificationItemDark]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <Icon 
            name={item.type === 'order' ? 'bag-outline' : item.type === 'promotion' ? 'gift-outline' : 'information-circle-outline'} 
            size={20} 
            color={item.type === 'order' ? '#4CAF50' : item.type === 'promotion' ? '#FF9800' : '#2196F3'} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.message, isDarkMode && styles.messageDark]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.time, isDarkMode && styles.timeDark]}>{formatTime(item.timestamp)}</Text>
        </View>
        <View style={styles.unreadDot} />
      </TouchableOpacity>
    );
  };

  if (!visible || unreadNotifications.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, isDarkMode && styles.overlayDark]}>
        <View style={[styles.modalContainer, isDarkMode && styles.modalContainerDark]}>
          <View style={[styles.header, isDarkMode && styles.headerDark]}>
            <View style={styles.headerLeft}>
              <Icon name="notifications" size={24} color="#1EB1C5" />
              <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>New Notifications</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={isDarkMode ? '#aaa' : '#666'} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={unreadNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => {
              // Handle different ID field names
              const id = item.notification_id || item.id || item.timestamp || Date.now().toString();
              return id.toString();
            }}
            showsVerticalScrollIndicator={false}
            style={styles.notificationsList}
          />
          
          <View style={[styles.footer, isDarkMode && styles.footerDark]}>
            <TouchableOpacity onPress={handleViewAll} style={[styles.viewAllButton, isDarkMode && styles.viewAllButtonDark]}>
              <Text style={[styles.viewAllText, isDarkMode && styles.viewAllTextDark]}>View All Notifications</Text>
              <Icon name="arrow-forward" size={16} color="#1EB1C5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: height * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContainerDark: {
    backgroundColor: '#2a2a2a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerDark: {
    borderBottomColor: '#444',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    fontFamily: 'Outfit-Regular',
  },
  headerTitleDark: {
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  notificationsList: {
    maxHeight: height * 0.3,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  notificationItemDark: {
    borderBottomColor: '#444',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    fontFamily: 'Outfit-Regular',
  },
  titleDark: {
    color: '#fff',
  },
  message: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 2,
    fontFamily: 'Outfit-Regular',
  },
  messageDark: {
    color: '#ccc',
  },
  time: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Outfit-Regular',
  },
  timeDark: {
    color: '#aaa',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1EB1C5',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerDark: {
    borderTopColor: '#444',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1EB1C5',
  },
  viewAllButtonDark: {
    backgroundColor: '#3a3a3a',
  },
  viewAllText: {
    fontSize: 14,
    color: '#1EB1C5',
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Outfit-Regular',
  },
  viewAllTextDark: {
    color: '#1EB1C5',
  },
});

export default NotificationModal;