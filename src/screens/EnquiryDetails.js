import React, { useContext, useEffect,useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity,ScrollView, Alert,Image } from 'react-native';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AddressSelector from '../components/AddressSelector';
import CarrierTrackingCard from '../components/CareerTrackingCard';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';
import { Button } from 'react-native-paper';

import FilePickerPreview from '../components/FileUpload';
import FileList from '../components/FileList';
import { useNavigation } from '@react-navigation/native';
import imageBase from '../constants/imageBase';

const addresses = [
  {
    id: 1,
    label: 'Home',
    address: '112 Castle Street, Rolla Sharjah, UAE, 85213',
  },
  {
    id: 2,
    label: 'Office',
    address: '221 Tiger Building, Sheikh Zayed Road, Dubai UAE, 85214',
  },
  {
    id: 3,
    label: 'Friends',
    address: '221 Naif Street, Deira Dubai, UAE, 85213',
  },
];

const EnquiryDetails = ({ route }) => {
	const { enquiry } = route.params || {};
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

 const [updateFile, setUpdateFile] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [enquiries, setEnquiries] = useState({});
  const [tracking, setTracking] = useState({});
  const [profile, setProfile] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileDoc, setReceiptFileDoc] = useState(null);
  const [receiptArrival, setReceiptArrival] = useState(null);
  const [receiptArrival1, setReceiptArrival1] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptUrl1, setReceiptUrl1] = useState("");
  const [receiptUrl2, setReceiptUrl2] = useState("");
  const [receiptUrl3, setReceiptUrl3] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [productsLinked, setProductsLinked] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  const [deletion, setDeletion] = useState(false);

  const [productModalVisible, setProductModalVisible] = useState(false);

  const [selectedAddressString, setSelectedAddressString] = useState('');
 const [file, setFile] = useState(null);

  const selectImage = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Gallery",
          onPress: () => openImageLibrary(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.assets[0].uri, type: response.assets[0].type, name: response.assets[0].fileName };
        setProfileImage(source);
        handleUploadProfileImage(source);
      }
    });
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.assets[0].uri, type: response.assets[0].type, name: response.assets[0].fileName };
        setProfileImage(source);
        handleUploadProfileImage(source);
      }
    });
  };

  const handleUploadProfileImage = async (image) => {
    if (!image) {
      Alert.alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("enq_code", enquiry.enquiry_code);
    formData.append("files", {
      uri: image.uri,
      type: image.type,
      name: image.name,
    });
    formData.append("enquiry_id", enquiry.enquiry_id);
    formData.append('record_id', enquiry.enquiry_id)
    formData.append('room_name', 'ProfileImages')
    formData.append('alt_tag_data', 'ProfileImage')
    formData.append('description', 'ProfileImage')

    api.post('/file/uploadFiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => {
      setUpdateFile(!updateFile);
      Alert.alert("Profile Image Uploaded Successfully");
      // Optionally refresh the profile image from the server
      api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'ProfileImages' }).then((res) => {
        if (res.data && res.data.length > 0) {
          console.log('Profile Image URL after upload:', res.data[0].file_url); // Add this line
          setProfileImage({ uri: res.data[0].file_url });
        }
      });
    }).catch((error) => {
      console.error("Upload error:", error);
      Alert.alert("Unable to upload profile image");
    });
  };

useEffect(() => {
  api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'ProfileImages' })
    .then((res) => {
      if (res.data && res.data.length > 0) {
        // Get the LAST uploaded image
        const lastFile = res.data[res.data.length - 1];
        const fileName = lastFile.name;

        if (fileName) {
          const fullUrl = fileName.startsWith('http')
            ? fileName
            : `http://66.29.149.122:2013/storage/uploads/${fileName}`;

          console.log('✅ Latest Profile Image URL:', fullUrl);
          setProfileImage({ uri: fullUrl });
        } else {
          console.warn("⚠️ No name found in last file:", lastFile);
        }
      } else {
        console.log("ℹ️ No profile image found for this enquiry.");
      }
    })
    .catch((err) => {
      console.error("❌ Error fetching profile image:", err);
    });
}, [updateFile, enquiry.enquiry_id]);


  const renderPreview = () => {
    if (!file) return null;

    const { type, uri, name } = file;

    if (type.startsWith('image/')) {
      return <Image source={{ uri }} style={styles.image} />;
    } else if (type === 'application/pdf' || type.includes('msword')) {
      return (
        // <WebView
        //   source={{ uri }}
        //   style={styles.webview}
        //   startInLoadingState={true}
        // />
        <Text style={styles.text}>Preview not available for: {name}</Text>
      );
    } else {
      return <Text style={styles.text}>Preview not available for: {name}</Text>;
    }
  };

  const profileAddress = {
    customer_address_id: "profile", // Unique id for selection
    shipper_name: profile.first_name + ' ' + (profile.last_name || ''),
    address_flat: profile.address2 || '',
    address_street: profile.address_area || '',
    address_city: profile.address_city || '',
    address_town: profile.address_town || '',
    address_po_code: profile.address_po_code || '',
    address_state: profile.address_state || '',
    address_country: profile.address_country || '',
  
  };

  const styles = getStyles(isDarkMode);
  const handleSelect = (id) => {
    const selected = addresses.find(a => a.id === id);
    setSelectedAddress(id);
  
    const selectedAddr = combinedAddressList.find(addr => addr.customer_address_id === id);
  
    if (selectedAddr) {
      // Concatenate address fields
      const fullAddress = `${selectedAddr.shipper_name}, ${selectedAddr.address_flat}, ${selectedAddr.address_street}, ${selectedAddr.address_city}, ${selectedAddr.address_town}, ${selectedAddr.address_state}, ${selectedAddr.address_country} - ${selectedAddr.address_po_code}${selectedAddr.phone ? `, Phone: ${selectedAddr.phone}` : ''}`;
  
      // Set the formatted address string
      setSelectedAddressString(fullAddress);
    }
    //Alert.alert('Selected', selected.customer_address_id);
  };
  const formatDate = () => {
    const now = new Date();
  
    const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  
    return `${date.replace(/\//g, '-')} ${time.toLowerCase()}`;
  };
const handleError = (error) => {
  console.warn('File picker error:', error);
};
 const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        e.target.value = "";
        return;
      }
      setReceiptFile(file);
    }
  };
const handleUpload = async () => {
    if (!receiptFile) {
      Alert.alert("Please select a file first.");
      return;
    }
   console.log('receiptFile',receiptFile);
    const formData = new FormData();
    formData.append("enq_code", enquiry.enquiry_code);
    formData.append("files",{
  uri: receiptFile.uri,
  type: receiptFile.type,
  name: receiptFile.name,
});
    formData.append("enquiry_id", enquiry.enquiry_id);
    formData.append('record_id', enquiry.enquiry_id)
    formData.append('room_name', 'PaymentReceipt')
    formData.append('alt_tag_data', 'PaymentReceipt')
    formData.append('description', 'PaymentReceipt')
    console.log('formdata',formData);

    api.post('/file/uploadFiles',formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}
    //   ,{onUploadProgress:(filedata)=>{
    //   console.log( Math.round((filedata.loaded/filedata.total)*100))
    //   setUploaded( Math.round((filedata.loaded/filedata.total)*100))                 
    // }}
  ).then(()=>{setUpdateFile(!updateFile);
     api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'PaymentReceipt' }).then((res) => {
  setReceiptUrl(res.data);
});
      Alert.alert("Files Uploaded Successfully")
      setReceiptFile(null);
      // setTimeout(() => {
      //     window.location.reload()
      // }, 400);
    }).catch(()=>{                  
      Alert.alert("Unable to upload file")                                
    })
  };

  
  const handleFileDocChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        Alert.alert("Only PDF files are allowed!");
        e.target.value = "";
        return;
      }
      setReceiptFileDoc(file);
    }
  };

  const handleUploadOnDoc = async () => {
    if (!receiptFileDoc) {
      Alert.alert("Please select a PDF file first.");
      return;
    }
console.log('receiptFileDoc',receiptFileDoc);
    const formData = new FormData();
    formData.append("enq_code", enquiry.enquiry_code);
     formData.append("files",{
  uri: receiptFileDoc.uri,
  type: receiptFileDoc.type,
  name: receiptFileDoc.name,
});
    formData.append("enquiry_id", enquiry.enquiry_id);
    formData.append('record_id', enquiry.enquiry_id)
    formData.append('room_name', 'OnDocPayment')
    formData.append('alt_tag_data', 'OnDocPayment')
    formData.append('description', 'OnDocPayment')
    api.post('/file/uploadFiles',formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}).then(()=>{
        setUpdateFile(!updateFile);
 api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'OnDocPayment' }).then((res) => {
      setReceiptUrl1(res.data);
    });
      Alert.alert("Files Uploaded Successfully")
     setReceiptFileDoc(null);
    }).catch(()=>{                  
      Alert.alert("Unable to upload file")                                
    })
  };

  const handleArrival = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        Alert.alert("Only PDF files are allowed!");
        e.target.value = "";
        return;
      }
      setReceiptArrival(file);
    }
  };

  const handleUploadArrival = async () => {
    if (!receiptArrival) {
      Alert.alert("Please select a file first.");
      return;
    }

console.log('receiptArrival',receiptArrival);
    const formData = new FormData();
    formData.append("enq_code", enquiry.enquiry_code);
     formData.append("files",{
  uri: receiptArrival.uri,
  type: receiptArrival.type,
  name: receiptArrival.name,
});
    formData.append("enquiry_id", enquiry.enquiry_id);
    formData.append('record_id', enquiry.enquiry_id)
    formData.append('room_name', 'AfterArrival')
    formData.append('alt_tag_data', 'AfterArrival')
    formData.append('description', 'AfterArrival')
    api.post('/file/uploadFiles',formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}).then(()=>{
  setUpdateFile(!updateFile);
 setReceiptArrival(null);
    api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'AfterArrival' }).then((res) => {
      setReceiptUrl2(res.data);
    });
    
      Alert.alert("Files Uploaded Successfully")
      setReceiptArrival(null);
    }).catch(()=>{                  
      Alert.alert("Unable to upload file")                                
    })
  };


  const generateOrder = () => {
    if(selectedAddressString){
    // enquiry.modification_date = moment().format('DD-MM-YYYY h:mm:ss a');
    enquiry.modification_date = formatDate();
    enquiry.shipping_address = selectedAddressString;
      api
        .post('/enquiry/updateShipping', enquiry)
        .then(() => {
          Alert.alert("Address updated Successfully")
          // setTimeout(() => {
          //   window.location.reload();
          // }, 300);
        })
        .catch(() => {
          Alert.alert("Unable to update shipping address")
        
        });
      }else{
        Alert.alert("Please Select the shipping address")
      
      }
   
  };

const deleteFile = (fileId, onDeleted) => {
  Alert.alert(
    'Are you sure?',
    "You won't be able to revert this!",
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, delete it!',
        style: 'destructive',
        onPress: () => {
          api
          .post('/file/deleteFile', { media_id: fileId })
            .then((res) => {
              console.log('File deleted:', res.data);
              setDeletion(!deletion);
              Alert.alert('Deleted!', 'File has been deleted.');
              if (onDeleted) onDeleted(); // Refresh list or update UI
            })
            .catch((error) => {
              console.error(error);
              Alert.alert('Error', 'Unable to delete file.');
            });
        },
      },
    ],
    { cancelable: true }
  );
};
useEffect(()=>{
  setReceiptFile(null);
  setReceiptArrival(null);
  setReceiptArrival(null);
},[updateFile])

useEffect(()=>{
  api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'PaymentReceipt' }).then((res) => {
  setReceiptUrl(res.data);
});
 api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'OnDocPayment' }).then((res) => {
      setReceiptUrl1(res.data);
    });
    api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'AfterArrival' }).then((res) => {
      setReceiptUrl2(res.data);
    });
    api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'Enquiry' }).then((res) => {
      setReceiptUrl3(res.data);
    });
},[deletion])

useEffect(()=>{
  api
  .post(`/contact/getContactsById`, { contact_id: user.contact_id })
  .then((res) => {
    setProfile(res.data.data[0]);
    
  })
  .catch((err) => console.log(err));
  api
  .post(`/enquiry/getEnquiryProductsByEnquiryId`, { enquiry_id: enquiry.enquiry_id })
  .then((res) => {
    console.log('productslinked',res.data.data);
    console.log('First product image URI:', res.data.data.length > 0 ? `http://66.29.149.122:2013/storage/uploads/${res.data.data[0].image}` : 'No products');
    setProductsLinked(res?.data?.data);
   
    
  })
  .catch((err) => console.log(err));

api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'PaymentReceipt' }).then((res) => {
  setReceiptUrl(res.data);
});
 api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'OnDocPayment' }).then((res) => {
      setReceiptUrl1(res.data);
    });
    api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'AfterArrival' }).then((res) => {
      setReceiptUrl2(res.data);
    });
    api.post('/file/getListOfFiles', { record_id: enquiry.enquiry_id, room_name: 'Enquiry' }).then((res) => {
      setReceiptUrl3(res.data);
    });
if(user){
api
.post(`/contact/getAddressessByContactId`, { contact_id: user.contact_id })
.then((res) => {
  setAddressList(res.data.data);
  
})
.catch((err) => console.log(err));
}

api
.post(`/tracking/getQuoteTrackItemsById`, { enquiry_id: enquiry.enquiry_id })
.then((res) => {
setTracking(res.data.data[0]);

})
.catch((err) => console.log(err));

},[enquiry])

const combinedAddressList = [profileAddress, ...addressList];
  
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/back-arrow.jpeg')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enquiry Details</Text>
      </View> */}
    <View style={styles.profileContainer}>
  <TouchableOpacity onPress={selectImage}>
  <Image
  source={
    profileImage && profileImage.uri
      ? { uri: profileImage.uri }
      : require('../assets/images/profile-pic.jpeg')
  }
  style={styles.profileImage}
  resizeMode="cover"
  defaultSource={require('../assets/images/profile-pic.jpeg')} // iOS placeholder
  onError={(e) => {
    console.log("❌ Failed to load image:", profileImage?.uri, e.nativeEvent.error);
    setProfileImage(null); // fallback
  }}
/>

  </TouchableOpacity>
  <Text style={styles.welcome}>Welcome to</Text>
  <Text style={styles.name}>{enquiry?.title}</Text>
</View>
      <View style={styles.row}>
   <View style={{ marginBottom: 10 }}>
  <Text style={styles.label}>Enquiry ID</Text>
  <Text style={styles.enquiryId}>{enquiry?.enquiry_code}</Text>
</View>
        <Text style={styles.status}>{enquiry?.status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Created Date :</Text>
        <Text style={styles.value}>{enquiry?.creation_date}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Enquiry Type :</Text>
        <Text style={styles.value}>{enquiry?.enquiry_type}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Order Code</Text>
        <Text style={styles.budget}>{enquiry?.order_code}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{enquiry?.shipping_address}</Text>
      </View>

      <TouchableOpacity
        style={styles.viewProductsButton}
        onPress={() => setProductModalVisible(true)}
      >
        <Text style={styles.viewProductsButtonText}>View Linked Products</Text>
      </TouchableOpacity>
      <Modal
        isVisible={productModalVisible}
        onBackdropPress={() => setProductModalVisible(false)}
        backdropOpacity={0.3}
        style={styles.modal}
      >
        <View style={[styles.modalContent, { backgroundColor: '#fff' }]}>
          <Text style={[styles.modalTitle, { color: '#000' }]}>Linked Products</Text>
          {productsLinked.length > 0 ? (
            <ScrollView style={styles.productList}>
              {productsLinked.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { color: '#000' }]}>S.No: {index + 1}</Text>
                  <Text style={[styles.tableCell, { color: '#000' }]}>Product: {item.product_title}</Text>
                  <Text style={[styles.tableCell, { color: '#000' }]}>Grade: {item.grades}</Text>
                  <Text style={[styles.tableCell, { color: '#000' }]}>Count: {item.counts}</Text>
                  <Text style={[styles.tableCell, { color: '#000' }]}>Origin: {item.origins}</Text>
                  <Text style={[styles.tableCell, { color: '#000' }]}>DestinationPort: {item.destination_port}</Text>
                  <Text style={[styles.tableCell, { color: '#000' }]}>HSN: {item.hsn}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={[styles.noProductsText, { color: '#666' }]}>No products linked to this enquiry.</Text>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setProductModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text style={[styles.header, { textAlign: 'left', marginTop: 20, marginBottom: 10 }]}>Payment Receipt</Text>
 <FilePickerPreview title='Payment Receipt' setReceiptFile={setReceiptFile} updateFile={updateFile} setUpdateFile={setUpdateFile} receiptFile={receiptFile} handleUpload={handleUpload} />
     <FileList
      receiptUrl={receiptUrl} 
      deleteFile={deleteFile} 
      />
{enquiry?.after_arrival != 1 &&<Text style={[styles.header, { marginTop: 20 }]}>On documents payment</Text>}
 {enquiry?.on_document === 1 && <FilePickerPreview title='On documents payment' setReceiptFile={setReceiptFileDoc} receiptFile={receiptFileDoc} updateFile={updateFile} setUpdateFile={setUpdateFile} handleUpload={handleUploadOnDoc} />}
    {enquiry?.on_document === 1 &&  <FileList
      receiptUrl={receiptUrl1} 
       deleteFile={deleteFile} 
      />}
      {enquiry?.after_arrival != 1 &&<Text style={[styles.header, { marginTop: 20 }]}>After Arrival</Text>}
{enquiry?.after_arrival === 1 &&<FilePickerPreview title='After Arrival' setReceiptFile={setReceiptArrival} receiptFile={receiptArrival} updateFile={updateFile} setUpdateFile={setUpdateFile} handleUpload={handleUploadArrival} />}
    {enquiry?.after_arrival === 1 && <FileList
      receiptUrl={receiptUrl2} 
       deleteFile={deleteFile} 
      />}
      {/* <FilePickerPreview title='Buisness Document' setReceiptFile={setReceiptArrival1} receiptFile={receiptArrival1} handleUpload={handleUpload} />
     <FileList
      receiptUrl={receiptUrl3} 
      // deleteFile={deleteFile} 
      /> */}
      <AddressSelector addresses={combinedAddressList} onSelect={handleSelect} />
      <View style={styles.editButtonWrapper}>
            <Button mode="contained" onPress={generateOrder} style={styles.button} >Save Address</Button>
          </View>
      <CarrierTrackingCard tracking={tracking} />
    </ScrollView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
    },
    backButton: {
      paddingRight: 10,
     
    },
    backIcon: {
      width: 24,
      height: 28,
    
      
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      fontFamily: 'Outfit-Regular',
      flex: 1,
      textAlign: 'center',
      marginRight: 34,
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 10,
    },
    welcome: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Outfit-Regular',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      fontFamily: 'Outfit-Regular',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    label: {
      fontSize: 14,
      color: '#888',
      fontFamily: 'Outfit-Regular',
    },
    value: {
      fontSize: 14,
      color: '#222',
      fontFamily: 'Outfit-Regular',
    },
    enquiryId: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#000',
      fontFamily: 'Outfit-Regular',
    },
    status: {
      backgroundColor: '#e6ffe6',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      fontSize: 12,
      color: '#008000',
      fontWeight: 'bold',
      fontFamily: 'Outfit-Regular',
    },
    budget: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#00C3D2',
      fontFamily: 'Outfit-Regular',
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 20,
      marginBottom: 15,
      fontFamily: 'Outfit-Regular',
    },
    uploadBox: {
      marginTop: 10,
      paddingVertical: 30,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9',
    },
    uploadText: {
      color: '#888',
      marginTop: 5,
      fontFamily: 'Outfit-Regular',
    },
    fileIcon: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    fileName: {
      fontSize: 14,
      color: '#000',
      fontFamily: 'Outfit-Regular',
    },
    deleteIcon: {
      width: 16,
      height: 16,
      tintColor: '#ff0000',
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    fileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      marginTop: 10,
      backgroundColor: '#00B4D8',
      fontFamily: 'Outfit-Regular',
      color:'#fff'
    },
    editButtonWrapper: {
      //marginTop: 15,
      marginBottom:5,
      fontFamily: 'Outfit-Regular',
    },
     previewContainer: { marginTop: 20, flex: 1 },
      precontainer: { flex: 1, padding: 20 },
    viewProductsButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
    },
    viewProductsButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: isDarkMode ? '#fff' : '#333',
      textAlign: 'center',
    },
    productList: {
      flexGrow: 1,
    },
    productItem: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      alignItems: 'center',
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 5,
      marginRight: 10,
    },
    productDetails: {
      flex: 1,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
    },
    productCategory: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginBottom: 5,
    },
    productDetailText: {
      fontSize: 12,
      color: isDarkMode ? '#aaa' : '#555',
    },
    noProductsText: {
      textAlign: 'center',
      color: isDarkMode ? '#ccc' : '#666',
      marginTop: 20,
      fontSize: 16,
    },
    closeButton: {
      backgroundColor: '#dc3545',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
    },
    tableContainer: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default EnquiryDetails;
