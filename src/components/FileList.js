import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const FileList = ({ receiptUrl, deleteFile }) => {
  if (!receiptUrl || receiptUrl.length === 0) return null;

  return (
    <ScrollView>
      {receiptUrl.map((res, index) => (
        <View key={index} style={styles.item}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https://Ampro.unitdtechnologies.com:2014/category/download/${res.name}`)
            }
            style={styles.link}
          >
            <Icon name="file-download" size={16} color="#007bff" style={styles.icon} />
            <Text style={styles.linkText}>{res.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteFile(res.media_id)} style={styles.deleteButton}>
            <Icon name="times-circle" size={16} color="#ADD8E6" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    marginRight: 8,
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  deleteButton: {
    padding: 4,
  },
});

export default FileList;
