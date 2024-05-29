import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Departments = ({ navigation, route }) => {
  const { customer } = route.params;

  const handleDepartmentSelect = (department) => {
    navigation.navigate('ProblemType', { customer, department });
  };

  return (
    <View style={styles.container}>
      <Text>Select Department:</Text>
      <Button title="Funding Wallet" onPress={() => handleDepartmentSelect('Funding Wallet')} />
      <Button title="Buying Airtime" onPress={() => handleDepartmentSelect('Buying Airtime')} />
      <Button title="Buying Internet Data" onPress={() => handleDepartmentSelect('Buying Internet Data')} />
      <Button title="E-commerce Section" onPress={() => handleDepartmentSelect('E-commerce Section')} />
      <Button title="Fraud Related Problems" onPress={() => handleDepartmentSelect('Fraud Related Problems')} />
      <Button title="General Services" onPress={() => handleDepartmentSelect('General Services')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
});

export default Departments;
