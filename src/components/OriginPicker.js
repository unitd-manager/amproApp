import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;

const OriginSelector = ({
  product,
  selectedProductOrigin,
  setSelectedProductOrigin,
  setProductStock,
  setQuantityCount,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const selectorRef = useRef();

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

  const handleSelect = (grade) => {
    if (grade === '') {
      setSelectedProductOrigin('');
      setProductStock(0);
      setQuantityCount(1);
    } else {
      const selectedData = product.origin.find((g) => g === grade);
      setSelectedProductOrigin(grade);
      setProductStock(selectedData?.stock || 0);
      setQuantityCount(1);
    }
    setModalVisible(false);
  };

  return (
    product?.origin?.length > 0 && (
      <View style={styles.container}>
        <Text style={styles.label}>Select Origin</Text>
        <TouchableOpacity
          ref={selectorRef}
          style={styles.selector}
          onPress={openDropdown}
        >
          <Text style={selectedProductOrigin ? styles.selectedText : styles.placeholder}>
            {selectedProductOrigin || 'Select an origin'}
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
            <FlatList
              data={['', ...product.origin]}
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
                    {item === '' ? 'Select an Origin' : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
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
    maxHeight: Dimensions.get('window').height * 0.7,
    paddingVertical: 8,
    elevation: 4,
    zIndex: 1000,
    width: windowWidth * 0.8,
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

export default OriginSelector;
