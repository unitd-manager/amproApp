import React, { useRef, useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  findNodeHandle,
  UIManager,
  TextInput, // Added for searchable functionality
} from 'react-native';
import Modal from 'react-native-modal';
import api from '../constants/api';

const windowWidth = Dimensions.get('window').width;

const DestinationPortPicker = ({
  selectedDestinationPort,
  setSelectedDestinationPort,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [destinationPorts, setDestinationPorts] = useState([]);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [searchText, setSearchText] = useState(''); // State for search input
  const selectorRef = useRef();

  useEffect(()=>{
 api.get("/destinationPort/getDestinationPort")
      .then((res) => {
        setDestinationPorts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });


},[])

  const openDropdown = () => {
    if (selectorRef.current) {
      UIManager.measure(
        findNodeHandle(selectorRef.current),
        (_x, _y, width, height, pageX, pageY) => {
          setDropdownTop(pageY + height);
          setDropdownLeft(pageX);
          setModalVisible(true);
        }
      );
    }
  };

  const handleSelect = (port) => {
    setSelectedDestinationPort(port.destination_port);
    setModalVisible(false);
    setSearchText(''); // Clear search text on selection
  };

  const filteredPorts = destinationPorts.filter(port =>
    port?.destination_port?.toLowerCase().includes(searchText?.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Destination Port</Text>
      <TouchableOpacity
        ref={selectorRef}
        style={styles.selector}
        onPress={openDropdown}
      >
        <Text style={selectedDestinationPort ? styles.selectedText : styles.placeholder}>
          {selectedDestinationPort || 'Select a destination port'}
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.3}
        style={styles.modal}
      >
        <View
          style={[
            styles.dropdown,
          ]}
        >
         <TextInput
  style={styles.searchInput}
  placeholder="Search ports..."
  placeholderTextColor="#888"  // 👈 ALWAYS visible
  value={searchText}
  onChangeText={setSearchText}
/>

          <FlatList
            data={filteredPorts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    item === '' && styles.placeholder,
                  ]}
                >
                  {item?.destination_port},{item?.country}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    fontFamily: 'Outfit-Regular',
  },
  selector: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Outfit-Regular',
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Outfit-Regular',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 4,
    zIndex: 1000,
    fontFamily: 'Outfit-Regular',
    width: windowWidth * 0.8, // Make it 80% of screen width
    maxHeight: Dimensions.get('window').height * 0.7, // Max height 70% of screen height
  },
 searchInput: {
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  marginHorizontal: 12,
  marginBottom: 8,
  paddingHorizontal: 10,
  backgroundColor: '#fff',    // 👈 FORCE WHITE
  color: '#000',              // 👈 FORCE BLACK TEXT
  fontFamily: 'Outfit-Regular',
},

  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Outfit-Regular',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
});

export default DestinationPortPicker;