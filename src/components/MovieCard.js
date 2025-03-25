import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BASE_IMAGE_URL } from '../services/tmdbService';

const MovieCard = ({ movie, onPress, style }) => {

    const image = movie?.poster_path ? `${BASE_IMAGE_URL}/w500${movie.poster_path}` : null;
    
    return (
        <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
            <Image
                source={{ uri: image  }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{movie?.title || movie?.name}</Text>
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {movie?.vote_average.toFixed(1)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 5,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#333',
        minWidth: 150,
        maxWidth: 150,
    },
    image: {
        width: '100%',
        height: 200,
    },
    details: {
        padding: 10,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        color: 'white',
        fontSize: 12,
    },
});

export default MovieCard;