import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { AuthContext } from '../../context/AuthContext';
import LoadingIndicator from '../../components/LoadingIndicator';

const LoginScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isUsingEmail, setIsUsingEmail] = useState(true);
    const { loginWithEmail, loginWithUsername, isLoading } = useContext(AuthContext);

    const handleLogin = () => {
        if (isUsingEmail) {
            loginWithEmail(identifier, password)
                .then(() => {
                    navigation.navigate('App', { screen: 'Home' });
                })
                .catch(err => {
                    ToastAndroid.showWithGravity(err.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM );
                });
        } else {
            loginWithUsername(identifier, password)
                .then(() => {
                    navigation.navigate('App', { screen: 'Home' });
                })
                .catch(err => {
                    ToastAndroid.showWithGravity(err.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM );
                });
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Login</Text>

                <AuthInput
                    placeholder={isUsingEmail ? "Email" : "Username"}
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    onPress={() => setIsUsingEmail(!isUsingEmail)}
                    style={styles.toggleMethod}
                >
                    <Text style={styles.toggleMethodText}>
                        {isUsingEmail ? "Use username instead" : "Use email instead"}
                    </Text>
                </TouchableOpacity>

                <AuthInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <AuthButton title="Login" onPress={handleLogin} />

                <TouchableOpacity
                    style={styles.signupLink}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text></Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// ... styles remain the same ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30,
        textAlign: 'center',
    },
    forgotPassword: {
        color: '#e50914',
        textAlign: 'right',
        marginBottom: 20,
    },
    signupLink: {
        marginTop: 20,
        alignSelf: 'center',
    },
    signupText: {
        color: 'gray',
    },
    signupHighlight: {
        color: '#e50914',
        fontWeight: 'bold',
    },
    toggleMethod: {
        marginBottom: 20,
        alignSelf: 'flex-end',
    },
    toggleMethodText: {
        color: 'gray',
    },

});

export default LoginScreen;