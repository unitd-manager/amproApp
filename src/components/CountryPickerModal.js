import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

const CountryPickerModal = ({
  visible,
  search,
  onSearch,
  countries,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          placeholder="Search country or code"
          value={search}
          onChangeText={onSearch}
          style={styles.searchInput}
        />

        <FlatList
          data={countries}
          keyExtractor={item => item.cca2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.countryRow}
              onPress={() => onSelect(item)}
            >
              <Image
                source={{
                  uri: `https://flagcdn.com/w40/${item.cca2.toLowerCase()}.png`,
                }}
                style={styles.flag}
              />
              <Text style={styles.countryText}>
                {item.name} ({item.dial_code})
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CountryPickerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 12,
  },
  countryText: {
    fontSize: 14,
    color: '#000',
  },
  closeBtn: {
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeText: {
    color: '#1EB1C5',
    fontSize: 16,
    fontWeight: '600',
  },
});
