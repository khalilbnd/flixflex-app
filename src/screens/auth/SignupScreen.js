import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { AuthContext } from '../../context/AuthContext';
import LoadingIndicator from '../../components/LoadingIndicator';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const { register, checkUsernameAvailable, isLoading, error, setError } = useContext(AuthContext);

    // Check username availability with debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (username.length >= 3) {
                setIsCheckingUsername(true);
                try {
                    const isAvailable = await checkUsernameAvailable(username);
                    setUsernameAvailable(isAvailable);
                } catch (err) {
                    setUsernameAvailable(null);
                    console.error("Username check error:", err);
                } finally {
                    setIsCheckingUsername(false);
                }
            } else {
                setUsernameAvailable(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const validateForm = () => {
        if (!username || !name || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (usernameAvailable === false) {
            setError('Username is not available');
            return false;
        }

        return true;
    };

    const handleSignup = async () => {
        setError(null); // Clear previous errors
        
        if (!validateForm()) return;

        try {
            const success = register(username, name, email, password);
            if (success) {
                navigation.navigate("App", { screen: "Home" });
            }
        } catch (err) {
            // Error will be set in the AuthContext
            console.error("Registration error:", err);
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
                <Text style={styles.title}>Create Account</Text>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <AuthInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                {isCheckingUsername ? (
                    <Text style={styles.usernameStatus}>Checking username...</Text>
                ) : usernameAvailable !== null && (
                    <Text style={[
                        styles.usernameStatus,
                        usernameAvailable ? styles.available : styles.taken
                    ]}>
                        {usernameAvailable ? 'Username available' : 'Username taken'}
                    </Text>
                )}

                <AuthInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                />

                <AuthInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <AuthInput
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <AuthInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <AuthButton
                    title="Sign Up"
                    onPress={handleSignup}
                    disabled={isLoading || usernameAvailable === false || isCheckingUsername}
                />

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.loginHighlight}>Login</Text></Text>
                </TouchableOpacity>
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
        marginBottom: 30,
        textAlign: 'center',
    },
    loginLink: {
        marginTop: 20,
        alignSelf: 'center',
    },
    loginText: {
        color: 'gray',
    },
    loginHighlight: {
        color: '#e50914',
        fontWeight: 'bold',
    },
    usernameStatus: {
        marginTop: -10,
        marginBottom: 10,
        fontSize: 12,
    },
    available: {
        color: 'green',
    },
    taken: {
        color: 'red',
    },
    errorText: {
        color: '#e50914',
        textAlign: 'center',
        marginBottom: 15,
    },
});

export default SignupScreen;