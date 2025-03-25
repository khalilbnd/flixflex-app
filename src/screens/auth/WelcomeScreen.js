import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/movie.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Welcome to MovieApp</Text>
            <Text style={styles.subtitle}>Discover your next favorite movie</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={() => navigation.navigate('Signup')}
            >
                <Text style={[styles.buttonText, styles.outlineButtonText]}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1a1a1a',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 40,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#e50914',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    outlineButtonText: {
        color: 'gray',
    },
});

export default WelcomeScreen;