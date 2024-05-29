import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Departments from './Screens/Departments';
import ProblemType from './Screens/ProblemType';
import ChatWithAgent from './Screens/ChatWithAgent';
import CustomerDetails from './Screens/customerDetails';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
        <Stack.Screen name="Departments" component={Departments} />
        <Stack.Screen name="ProblemType" component={ProblemType} />
        <Stack.Screen name="ChatWithAgent" component={ChatWithAgent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
