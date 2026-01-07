import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet,TouchableOpacity } from 'react-native';
import { pick, types } from '@react-native-documents/picker';
//import { WebView } from 'react-native-webview';

const FilePickerPreview = ({title,receiptFile,setReceiptFile,handleUpload,updateFile, setUpdateFile}) => {
  const [file, setFile] = useState(null);
console.log('updatefile',updateFile);
  const handlePick = async () => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        type: [types.pdf, types.docx, types.images, types.allFiles],
      });

      setFile(res[0]);
      setReceiptFile(res[0]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Unknown error');
    }
  };

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
useEffect(()=>{
setReceiptFile(null);
},[updateFile])
  return (
    <View style={styles.container}>
      <Text style={[styles.header, { marginTop: 20 }]}>{title}</Text>
    <TouchableOpacity style={styles.uploadBox}  onPress={handlePick} >
            <Image source={require('../assets/images/cloud.jpeg')} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>Upload your file here</Text>
          </TouchableOpacity>
      {receiptFile && <View style={styles.previewContainer}>{renderPreview()}</View>}
      {receiptFile && <TouchableOpacity onPress={handleUpload} >
       <Text style={styles.uploadLink}>Upload </Text>
       </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  previewContainer: { marginTop: 20, flex: 1 },
  image: { width: '100%', height: 300, resizeMode: 'contain' },
  webview: { flex: 1, height: 400 },
  text: { marginTop: 10, fontSize: 16, color: 'gray' },
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
      marginTop: 5,
      fontFamily: 'Outfit-Regular',
    },
    uploadIcon: {
      width: 50,
      height: 50,
      marginBottom: 10,
     
    },
         uploadLink: {
          margin: 5,
    color: '#00C3D2',
      fontWeight: '600',
      fontSize: 18,
      textAlign:'center',
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
});

export default FilePickerPreview;
