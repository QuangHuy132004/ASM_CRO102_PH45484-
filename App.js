import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/components/Login';
import Register from './src/components/Register';
import Home from './src/components/Home';
import Run from './src/components/Run';
import Music from './src/components/Music';
import BMI from './src/components/BMI';
import Menu from './src/components/Menu';
import Profile from './src/components/Profile';
import Music2 from './src/components/Music2';
import Counseling from './src/components/Counseling';
import Counseling2 from './src/components/Counseling2';
import Resetpass from './src/components/Resetpass';
import Sleep from './src/components/Sleep';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Run" component={Run} />
        <Stack.Screen name="Music" component={Music} />
        <Stack.Screen name="BMI" component={BMI} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Music2" component={Music2} />
        <Stack.Screen name="Counseling" component={Counseling} />
        <Stack.Screen name="Counseling2" component={Counseling2} />
        <Stack.Screen name="Resetpass" component={Resetpass} />
        <Stack.Screen name="Sleep" component={Sleep} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

