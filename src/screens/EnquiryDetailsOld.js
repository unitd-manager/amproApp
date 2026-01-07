import React, { useContext, useEffect,useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity,ScrollView, Alert,Image } from 'react-native';
import AddressSelector from '../components/AddressSelector';
import CarrierTrackingCard from '../components/CareerTrackingCard';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';
import { Button } from 'react-native-paper';
import ProductsLinkedModal from '../components/ProductsLinkedModal';
import { pick, types } from '@react-native-documents/picker'
import FilePickerPreview from '../components/FileUpload';
//import { WebView } from 'react-native-webview';
import FileList from '../components/FileList';

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
  
  const [deletion, setDeletion] = useState(false);

  const [selectedAddressString, setSelectedAddressString] = useState('');
 const [file, setFile] = useState(null);

  
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
    setProductsLinked(res.data.data);
   
    
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
      <Text style={styles.header}>Enquiry Details</Text>
      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.name}>{enquiry?.title}</Text>
{productsLinked.length>0 && <ProductsLinkedModal productsLinked={productsLinked} />}
      <View style={styles.row}>
        <Text style={styles.label}>Enquiry Code</Text>
        <Text style={styles.enquiryId}>{enquiry?.enquiry_code}</Text>
        <Text style={styles.status}>{enquiry?.status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Created Date :</Text>
        <Text style={styles.value}>{enquiry?.creation_date}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Enquiry Type:</Text>
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
<AddressSelector addresses={combinedAddressList} onSelect={handleSelect} />
      <View style={styles.editButtonWrapper}>
            <Button mode="contained" onPress={generateOrder} style={styles.button} >Save Address</Button>
          </View>
       {/* <View style={styles.precontainer}>
      <View style={styles.previewContainer}>{renderPreview()}</View>
      </View> */}
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
      
      <CarrierTrackingCard tracking={tracking} />
    </ScrollView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor:'#fff',
      minHeight: '100%',
      fontFamily: 'Outfit-Regular',
    },
    header: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      color:'#000',
      marginBottom: 16,
      fontFamily: 'Outfit-Regular',
    },
    welcome: {
      fontSize: 14,
      textAlign: 'center',
      color:'#444',
      fontFamily: 'Outfit-Regular',
    },
    name: {
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      color:'#000',
      marginBottom: 10,
      fontFamily: 'Outfit-Regular',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 6,
      alignItems: 'center',
      fontFamily: 'Outfit-Regular',
    },
    label: {
      color:'#888',
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
    },
    value: {
      color:'#222',
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
    },
    enquiryId: {
      fontWeight: 'bold',
      color:'#000',
      fontSize: 15,
      fontFamily: 'Outfit-Regular',
    },
    status: {
      backgroundColor: '#D0F5D7',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      color: '#007F00',
      marginLeft: 10,
      fontFamily: 'Outfit-Regular',
    },
    budget: {
      color: '#00C3D2',
      fontWeight: '600',
      fontSize: 14,
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
      fontFamily: 'Outfit-Regular',
    },
    uploadText: {
      color: '#888',
      fontFamily: 'Outfit-Regular',
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
  });

export default EnquiryDetails;
