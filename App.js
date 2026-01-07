// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   /*
//    * To keep the template simple and small we're adding padding to prevent view
//    * from rendering under the System UI.
//    * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
//    * https://github.com/AppAndFlow/react-native-safe-area-context
//    *
//    * You can read more about it here:
//    * https://github.com/react-native-community/discussions-and-proposals/discussions/827
//    */
//   const safePadding = '5%';

//   return (
//     <View style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         style={backgroundStyle}>
//         <View style={{paddingRight: safePadding}}>
//           <Header/>
//         </View>
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//             paddingHorizontal: safePadding,
//             paddingBottom: safePadding,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;



import React, { useEffect, useState, useRef } from 'react';
import Navigation from './src/Navigation';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { NavigationContainer } from "@react-navigation/native";
import { Text } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import NotificationModal from './src/components/NotificationModal';
import { fetchNotifications, fetchUnreadCount } from './src/redux/slices/notificationSlice';
import useNotificationPolling from './src/hooks/useNotificationPolling';
import Toast from 'react-native-toast-message';

// Set default font globally
// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.style = { fontFamily: 'Outfit-Regular' };


// Main App Wrapper Component
const AppContent = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  const navigationRef = useRef();
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications?.notifications || []);
  const unreadNotifications = notifications.filter(notification => notification.is_read === 0);
  
  // Enable real-time notification polling
  useNotificationPolling(30000); // Poll every 30 seconds

  // Fetch notifications on app startup
  useEffect(() => {
    console.log('App starting - fetching notifications');
    dispatch(fetchNotifications()).then(() => {
      console.log('Notifications fetched successfully');
    }).catch(error => {
      console.error('Error fetching notifications:', error);
    });
  }, [dispatch]);

  // Show notification modal when app opens if there are unread notifications
  useEffect(() => {
    console.log('=== NOTIFICATION DEBUG ===');
    console.log('Total notifications:', notifications.length);
    console.log('Unread count:', unreadNotifications.length);
    console.log('Notifications array:', notifications);
    console.log('Modal visible state:', showNotificationModal);
    console.log('Has viewed notifications:', hasViewedNotifications);
    console.log('===========================');
    
    // Expose counts globally for debugging
    global.notificationCount = notifications.length;
    global.unreadCount = unreadNotifications.length;
    
    const timer = setTimeout(() => {
      console.log('NotificationModal Debug - Timer triggered, unread count:', unreadNotifications.length);
      
      // Check current route to avoid showing modal on NotificationList screen
      const currentRoute = navigationRef.current?.getCurrentRoute();
      const isOnNotificationList = currentRoute?.name === 'NotificationList';
      
      console.log('Current route:', currentRoute?.name);
      console.log('Is on NotificationList:', isOnNotificationList);
      
      // Only show modal on app startup, not when navigating between screens
      // Check if modal hasn't been shown yet, there are unread notifications, 
      // user hasn't viewed notifications, and not currently on NotificationList screen
      if (unreadNotifications.length > 0 && !showNotificationModal && !hasViewedNotifications && !isOnNotificationList) {
        console.log('NotificationModal Debug - Showing modal!');
        setShowNotificationModal(true);
      } else {
        console.log('NotificationModal Debug - Conditions not met, will not show');
      }
    }, 3000); // Show after 3 seconds to ensure navigation is ready

    return () => clearTimeout(timer);
  }, [unreadNotifications.length, notifications, hasViewedNotifications]); // Add hasViewedNotifications to dependencies

  const handleCloseModal = () => {
    setShowNotificationModal(false);
  };

  // Function to mark notifications as viewed (called when user opens NotificationList)
  const markNotificationsAsViewed = () => {
    console.log('Marking notifications as viewed');
    setHasViewedNotifications(true);
    setShowNotificationModal(false); // Hide modal if it's showing
  };

  // Function to reset viewed state (called when user leaves NotificationList)
  const resetNotificationsViewed = () => {
    console.log('Resetting notifications viewed state');
    setHasViewedNotifications(false);
  };

  // Test function to manually show notification modal
  const showTestNotificationModal = () => {
    console.log('Test: Manually triggering notification modal');
    setShowNotificationModal(true);
  };

  // Expose test function globally for development
  useEffect(() => {
    global.showTestNotificationModal = showTestNotificationModal;
    global.markNotificationsAsViewed = markNotificationsAsViewed;
    global.resetNotificationsViewed = resetNotificationsViewed;
    console.log('Test function exposed: global.showTestNotificationModal()');
    console.log('View function exposed: global.markNotificationsAsViewed()');
    console.log('Reset function exposed: global.resetNotificationsViewed()');
  }, []);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Navigation />
      </NavigationContainer>
      <NotificationModal
        visible={showNotificationModal}
        onClose={handleCloseModal}
        navigation={navigationRef.current?.getRootState() ? navigationRef.current : null}
      />
    </>
  );
};

export default function App() {
  // useEffect(() => {
  //   SplashScreen?.hide(); // hide splash screen after 2s (or immediately)
  // }, []);
  return (
    <>
     <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
     </Provider>
     <Toast />
    </>
  );
}

