// import React from 'react';
// import { View, Text, StyleSheet, Platform } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const GradeSelector = ({
//   product,
//   selectedProductGrade,
//   setSelectedProductGrade,
//   setProductStock,
//   setQuantityCount,
// }) => {
//   return (
//     product?.grades?.length > 0 && (
//       <View style={styles.container}>
//         <Text style={styles.label}>Select Grade</Text>
//         <View style={styles.pickerWrapper}>
//           <Picker
//             selectedValue={selectedProductGrade}
//             onValueChange={(itemValue) => {
//               const selectedData = product.grades.find((g) => g === itemValue);
//               setSelectedProductGrade(itemValue);
//               setProductStock(selectedData?.stock || 0);
//               setQuantityCount(1);
//             }}
//             mode="dropdown"
//             style={styles.picker}
//             dropdownIconColor="#000"
//             itemStyle={Platform.OS === 'ios' ? styles.itemStyle : undefined}
//           >
//             <Picker.Item label="Select a grade" value="" color="#888" />
//             {product.grades.map((grade, index) => (
//               <Picker.Item key={index} label={grade} value={grade} color="#000" />
//             ))}
//           </Picker>
//         </View>
//       </View>
//     )
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 16,
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 3,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 6,
//   },
//   pickerWrapper: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#ffffff',
//     height: 52,
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 52,
//     color: '#000',
//     backgroundColor: '#ffffff', // Ensures white background even in dark mode
//   },
//   itemStyle: {
//     color: '#000',
//     backgroundColor: '#fff',
//   },
// });

// export default GradeSelector;
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

const GradeSelector = ({
  product,
  selectedProductGrade,
  setSelectedProductGrade,
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
      setSelectedProductGrade('');
      setProductStock(0);
      setQuantityCount(1);
    } else {
      const selectedData = product.grades.find((g) => g === grade);
      setSelectedProductGrade(grade);
      setProductStock(selectedData?.stock || 0);
      setQuantityCount(1);
    }
    setModalVisible(false);
  };

  return (
    product?.grades?.length > 0 && (
      <View style={styles.container}>
        <Text style={styles.label}>Select Grade</Text>
        <TouchableOpacity
          ref={selectorRef}
          style={styles.selector}
          onPress={openDropdown}
        >
          <Text style={selectedProductGrade ? styles.selectedText : styles.placeholder}>
            {selectedProductGrade || 'Select a grade'}
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
              data={['', ...product.grades]}
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
                    {item === '' ? 'Select a grade' : item}
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

export default GradeSelector;
