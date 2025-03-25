import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingIndicator = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#e50914" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
});

export default LoadingIndicator;