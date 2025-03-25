import React, { createContext, useState, useEffect } from 'react';
import {auth, firestore} from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
    user: null, // Provide default value
    isLoading: true,
    error: null,
    login: () => {},
    register: () => {},
    logout: () => {},
    forgotPassword: () => {}
  });
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if username is available
    const checkUsernameAvailable = async (username) => {
        try {
            const snapshot = await firestore()
                .collection('usernames')
                .doc(username)
                .get();

            
            return !snapshot._exists;
        } catch (e) {
            console.error('Error checking username:', e);
            return false;
        }
    };

    // Handle user state changes
    const onAuthStateChanged = async (firebaseUser) => {
        
        if (firebaseUser) {
            // Get additional user data from Firestore
            const userDoc = await firestore().collection('users').doc(firebaseUser.uid).get();
            if (userDoc._exists) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: userDoc.data().username,
                    name: userDoc.data().name,
                });
                await AsyncStorage.setItem('user', JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: userDoc.data().username,
                    name: userDoc.data().name,
                }));
            }
        } else {
            setUser(null);
            await AsyncStorage.removeItem('user');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const loginWithEmail = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (e) {
            setError(e.message);
            setIsLoading(false);
            throw new Error('Invalid email or password'); // Ensure error is thrown for invalid credentials
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithUsername = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            // First get the email associated with this username
            const querySnapshot = await firestore()
                .collection('users')
                .where('username', '==', username)
                .limit(1)
                .get();


            if (querySnapshot.empty) {
                throw new Error('Username not found');
            }

            const userData = querySnapshot.docs[0].data();
            await auth().signInWithEmailAndPassword(userData.email, password).catch(e => {
                throw new Error('Invalid password');
            });

        } catch (e) {
            setError(e.message);
            throw new Error('Invalid password');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, name, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            // Check username availability
            const isAvailable = await checkUsernameAvailable(username);
            if (!isAvailable) {
                throw new Error('Username is already taken');
            }

            // Create Firebase auth user
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            // Save user info to Firestore
            await firestore()
                .collection('users')
                .doc(userCredential.user.uid)
                .set({
                    username,
                    name,
                    email,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });

            // Reserve username
            await firestore()
                .collection('usernames')
                .doc(username)
                .set({
                    uid: userCredential.user.uid,
                });

            // Automatically log in the user after registration
            await auth().signInWithEmailAndPassword(email, password);
        } catch (e) {
            setError(e.message);
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await auth().signOut();
            setUser(null);
            await AsyncStorage.removeItem('user');
        } catch (e) {
            setError(e.message);
        }
        setIsLoading(false);
    };

    const forgotPassword = async (emailOrUsername) => {
        setIsLoading(true);
        setError(null);
        try {
            // Check if input is email or username
            if (emailOrUsername.includes('@')) {
                // It's an email
                await auth().sendPasswordResetEmail(emailOrUsername);
            } else {
                // It's a username - find associated email
                const querySnapshot = await firestore()
                    .collection('users')
                    .where('username', '==', emailOrUsername)
                    .limit(1)
                    .get();

                if (querySnapshot.empty) {
                    throw new Error('Username not found');
                }

                const userData = querySnapshot.docs[0].data();
                await auth().sendPasswordResetEmail(userData.email);
            }

            setIsLoading(false);
            return true;
        } catch (e) {
            setError(e.message);
            setIsLoading(false);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                setIsLoading,
                error,
                loginWithEmail,
                loginWithUsername,
                register,
                logout,
                forgotPassword,
                checkUsernameAvailable,
                setError,
            }}>
            {children}
        </AuthContext.Provider>
    );
};