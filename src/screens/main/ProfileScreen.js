import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    console.log(user);
    
    const handleLogout = () => {
        logout();
        navigation.navigate('Auth', { screen: 'Welcome' });
    };
    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={user?.photoURL ? { uri: user.photoURL } : require('../../../assets/default-avatar.png')}
                        style={styles.avatar}
                    />
                </View>
                <Text style={styles.username}>{user?.username || 'Guest'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#888',
    },
    menuContainer: {
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    menuText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 15,
    },
    logoutButton: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;