import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = ({ color = '#ccc', thickness = 1, marginVertical = 10, width = '100%' }) => {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: color, height: thickness, marginVertical, width },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'center',
  },
});

export default Divider;
