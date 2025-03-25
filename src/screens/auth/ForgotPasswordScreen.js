import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { AuthContext } from '../../context/AuthContext';

const ForgotPasswordScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [isUsingEmail, setIsUsingEmail] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword, isLoading } = useContext(AuthContext);

    const handleSubmit = async () => {
        if (identifier) {
            const success = await forgotPassword(identifier);
            if (success) {
                setIsSubmitted(true);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                {!isSubmitted ? (
                    <>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Enter your {isUsingEmail ? 'email' : 'username'} to receive a reset link</Text>

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

                        <AuthButton title="Submit" onPress={handleSubmit} />

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.loginText}>Back to Login</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Check Your Email</Text>
                        <Text style={styles.subtitle}>We've sent a password reset link to your email address</Text>

                        <AuthButton
                            title="Return to Login"
                            onPress={() => navigation.navigate('Login')}
                        />
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

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
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 30,
        textAlign: 'center',
    },
    loginLink: {
        marginTop: 20,
        alignSelf: 'center',
    },
    loginText: {
        color: '#e50914',
    },
    toggleMethod: {
        marginTop: 20,
        alignSelf: 'center',
    },
    toggleMethodText: {
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ForgotPasswordScreen;
// ... styles remain the same ...