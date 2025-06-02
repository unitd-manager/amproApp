import React,{useState,useEffect, useContext} from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';


export default function EnquiryHistory({navigation}) {
	const [enquiries, setEnquiries] = useState([]);
	const [searchQuery, setSearchQuery] = useState(""); // Search state
   const [userData, setUser] = useState();


   
     const { user, logout } = useContext(AuthContext);
		useEffect(() => {
			const initialize = async () => {
			  try {
				// const jsonValue = await AsyncStorage.getItem('user');
				// console.log('Retrieved from AsyncStorage:', jsonValue);
				
				// const user = jsonValue != null ? JSON.parse(jsonValue) : null;
				// setUser(user);
		  console.log('user enq',user);
				if (user) {
				  console.log('Contact ID:', user.contact_id);
		  
				  api.post(`/enquiry/getEnquiryByContactId`, {
					contact_id: user?.contact_id,
				  })
				  .then((res) => {
					const sortedEnquiries = res.data.data?.sort((a, b) => b.enquiry_id - a.enquiry_id);
					setEnquiries(sortedEnquiries);
				  })
				  .catch((err) => {
					console.log('API Error:', err);
				  });
				} else {
				  console.warn('User not found in AsyncStorage.');
				}
		  
			  } catch (e) {
				console.error('Error reading user from AsyncStorage:', e);
			  }
			};
		  
			initialize();
		  }, []);
		  
	 

	  const total = enquiries.length;
	  const pending = enquiries.filter(e => e.status === 'Pending').length;


  const renderItem = ({ item }) => (
    <View style={styles.card}>
       <TouchableOpacity
              onPress={() => navigation.navigate("EnquiryDetails", { enquiry: item })}
            >
      <Text style={styles.orderId}>{item.type} #{item.enquiry_id}</Text>
      <Text style={styles.orderId}>{item.type} {item.enquiry_code}</Text>
      <Text style={styles.date}>{item.enquiry_date}</Text>
      <Text style={styles.label}>{item.order_code }</Text>
      <View
        style={[
          styles.statusBadge,
          item.status === 'Approved'
            ? styles.approved
            : item.status === 'Rejected'
            ? styles.rejected
            : styles.pending,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enquiry History</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Enquiries</Text>
          <Text style={styles.summaryCount}>{enquiries.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={styles.summaryCount}>{
                parseFloat(enquiries.filter((e) => e.order_code && e.order_code !== "").length
              )}</Text>
        </View>
      </View>

      <FlatList
        data={enquiries}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.enquiry_id}-${index}`}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fb', padding: 16,fontFamily: 'Outfit-Regular', },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Outfit-Regular',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    fontFamily: 'Outfit-Regular',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    fontFamily: 'Outfit-Regular',
  },
  summaryTitle: {
    color: '#7b7b8b',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: 'Outfit-Regular',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
    fontFamily: 'Outfit-Regular',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Outfit-Regular',
  },
  date: {
    color: '#9a9a9a',
    fontSize: 13,
    marginVertical: 4,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    color: '#3a3a3a',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  statusBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontFamily: 'Outfit-Regular',
  },
  approved: {
    backgroundColor: '#d7f5dd',
    fontFamily: 'Outfit-Regular',
  },
  rejected: {
    backgroundColor: '#ffdede',
    fontFamily: 'Outfit-Regular',
  },
  pending: {
    backgroundColor: '#fef2c0',
    fontFamily: 'Outfit-Regular',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Outfit-Regular',
  },
});
