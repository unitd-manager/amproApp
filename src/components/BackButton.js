import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
      <Icon name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
  );
};

export default BackButton;
