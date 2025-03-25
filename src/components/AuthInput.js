import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AuthInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    iconName,
    error,
    keyboardType = 'default',
    autoCapitalize = 'none'
}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, error && styles.errorInput]}>
                {iconName && (
                    <MaterialIcons
                        name={iconName}
                        size={20}
                        color="#666"
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        paddingLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    errorInput: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
});

export default AuthInput;