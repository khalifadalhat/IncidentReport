import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ProblemType = ({ route, navigation }) => {
  const { department, customer } = route.params;
  const { fullname, location } = customer; 
  const [problem, setProblem] = useState('');

  const handleSubmit = () => {
    axios.post('http://localhost:5000/cases', {
      customerName: fullname, 
      issue: problem, 
      department, 
      status: 'pending', 
      location,
    }).then(response => {
      console.log(response.data);
      navigation.navigate('ChatWithAgent', { department, problem });
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Text>Please tell us what the problem is:</Text>
      <TextInput
        style={styles.textarea}
        multiline
        numberOfLines={4}
        value={problem}
        onChangeText={setProblem}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  textarea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10
  }
});

export default ProblemType;
