import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.0.168:5000', {
  withCredentials: true,
});

const ChatWithAgent = ({ route }) => {
  const { department, problem } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) {
      alert('Please enter a message.');
      return;
    }

    const newMessage = { sender: 'customer', text };
    socket.emit('sendMessage', newMessage);
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={item.sender === 'customer' ? styles.customerMessage : styles.agentMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  customerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f7c4',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10
  },
  agentMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 10
  }
});

export default ChatWithAgent;
