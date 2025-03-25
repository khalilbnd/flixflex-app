import { useEffect } from 'react';
import { Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function FirebaseTester() {
    useEffect(() => {
        // Test Authentication
        auth()
            .signInAnonymously()
            .catch(e => console.log('❌ Auth error:', e.message));

        // Test Firestore
        firestore()
            .collection('test')
            .doc('connection')
            .set({ timestamp: new Date() })
            .catch(e => console.log('❌ Firestore error:', e.message));
    }, []);

    return <Text>Testing Firebase connection...</Text>;
}