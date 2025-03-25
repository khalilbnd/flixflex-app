import React, { useContext, useEffect, useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';

const { Screen, Navigator } = createStackNavigator();

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await AsyncStorage.getItem('user');
        setUserInfo(fetchedUser ? JSON.parse(fetchedUser) : null);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setLoading]);

  const initialRouteName = useMemo(() => (userInfo ? 'App' : 'Auth'), [userInfo]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <Navigator initialRouteName={initialRouteName}>
          <Screen options={{ headerShown: false }} name="App" component={AppStack} />
          <Screen options={{ headerShown: false }} name="Auth" component={AuthStack} />
        </Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
