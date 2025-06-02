import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, Pressable } from 'react-native';

const ProductsLinkedModal = ({ productsLinked = [] }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.product_title}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
    </View>
  );

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity onPress={handleShow}>
        <Text style={styles.linkText}>View Products Linked</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={show}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Products Linked</Text>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>#</Text>
              <Text style={styles.headerCell}>Product Name</Text>
              <Text style={styles.headerCell}>Qty</Text>
            </View>

            <FlatList
              data={productsLinked}
              renderItem={renderItem}
              keyExtractor={(item) => item.enq_prod_id?.toString()}
            />

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductsLinkedModal;

const styles = StyleSheet.create({
  linkText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
});
