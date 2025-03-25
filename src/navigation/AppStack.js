import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have `expo/vector-icons` installed
import HomeScreen from '../screens/main/HomeScreen';
import MovieDetailsScreen from '../screens/main/MovieDetailScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { createStackNavigator } from '@react-navigation/stack';
import TVShowDetailsScreen from '../screens/main/TVShowDetailScreen';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = createStackNavigator();
const AppStack = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'MovieDetails') {
                        iconName = focused ? 'film' : 'film-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Return the icon component
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: '#1a1a1a' },
            })}
        >
            <Tab.Screen name="Home" component={()=>(
                <Navigator screenOptions={{headerShown: false}}>
                    <Screen name="Home" component={HomeScreen} />
                    <Screen name="MovieDetails" component={MovieDetailsScreen}/>
                    <Screen name="TVShowDetails" component={TVShowDetailsScreen}/>
                </Navigator>
            )} />
            
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default AppStack;