// screens/CustomerDetails.js
import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CustomerDetails = ({ navigation }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/customers', {
        fullname,
        email,
        phone,
        location,
      });
      const customer = response.data;
      navigation.navigate('Departments', { customer }); 
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Full Name:</Text>
      <TextInput style={styles.input} value={fullname} onChangeText={setFullname} />
      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Text>Phone:</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      <Text>Location:</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default CustomerDetails;
