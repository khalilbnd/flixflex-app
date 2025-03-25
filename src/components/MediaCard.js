import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BASE_IMAGE_URL } from '../services/tmdbService';

const MediaCard = ({ item, type, onPress }) => {
    const title = type === 'movie' ? item.title : item.name;
    const imagePath = item.poster_path || item.backdrop_path;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image
                source={{
                    uri: imagePath
                        ? `${BASE_IMAGE_URL}/w500${imagePath}`
                        : 'https://via.placeholder.com/500x750?text=No+Image',
                }}
                style={styles.image}
            />
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {item.vote_average?.toFixed(1)}</Text>
            </View>
            {type === 'tv' && item.first_air_date && (
                <Text style={styles.year}>{item.first_air_date.split('-')[0]}</Text>
            )}
            {type === 'movie' && item.release_date && (
                <Text style={styles.year}>{item.release_date.split('-')[0]}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 8,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    title: {
        color: 'white',
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    ratingContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 4,
        borderRadius: 4,
    },
    rating: {
        color: 'white',
        fontSize: 12,
    },
    year: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
    },
});

export default MediaCard;