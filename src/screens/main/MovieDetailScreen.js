import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { BASE_IMAGE_URL, getMovieDetails } from '../../services/tmdbService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';

const MovieDetailsScreen = ({ route }) => {
    const { movieId } = route.params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const details = await getMovieDetails(movieId);
                setMovie(details);
                
                // Find the first YouTube trailer
                const trailer = details.videos?.results?.find(
                    video => video.site === 'YouTube' && video.type === 'Trailer'
                );
                setTrailerKey(trailer?.key);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const togglePlaying = () => setPlaying(!playing);

    if (loading || !movie) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Backdrop with Gradient Overlay */}
            <View style={styles.backdropContainer}>
                <Image
                    source={{ uri: `${BASE_IMAGE_URL}/w1280${movie.backdrop_path}` }}
                    style={styles.backdrop}
                />
                <LinearGradient
                    colors={['transparent', '#1a1a1a']}
                    style={styles.gradient}
                />
            </View>

            {/* Movie Poster and Basic Info */}
            <View style={styles.headerContent}>
                <Image
                    source={{ uri: `${BASE_IMAGE_URL}/w500${movie.poster_path}` }}
                    style={styles.poster}
                />
                <View style={styles.headerText}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Icon name="calendar-today" size={16} color="#888" />
                            <Text style={styles.metaText}>{movie.release_date.split('-')[0]}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="access-time" size={16} color="#888" />
                            <Text style={styles.metaText}>{movie.runtime} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="star" size={16} color="#FFD700" />
                            <Text style={styles.metaText}>{movie.vote_average}/10</Text>
                        </View>
                    </View>
                    <View style={styles.genreContainer}>
                        {movie.genres.slice(0, 3).map(genre => (
                            <View key={genre.id} style={styles.genrePill}>
                                <Text style={styles.genreText}>{genre.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Trailer Section */}
            {trailerKey && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trailer</Text>
                    <YoutubePlayer
                        height={200}
                        play={playing}
                        videoId={trailerKey}
                        onChangeState={state => console.log(state)}
                    />
                </View>
            )}

            {/* Overview Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storyline</Text>
                <Text style={styles.overview}>{movie.overview}</Text>
            </View>

            {/* Cast Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cast</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {movie.credits.cast.slice(0, 10).map((person) => (
                        <TouchableOpacity 
                            key={person.id} 
                            style={styles.castCard}
                            onPress={() => Linking.openURL(`https://www.imdb.com/name/${person.imdb_id}`)}
                        >
                            <Image
                                source={{
                                    uri: person.profile_path
                                        ? `${BASE_IMAGE_URL}/w185${person.profile_path}`
                                        : 'https://via.placeholder.com/185x278?text=No+Image',
                                }}
                                style={styles.castImage}
                            />
                            <Text style={styles.castName} numberOfLines={1}>{person.name}</Text>
                            <Text style={styles.castCharacter} numberOfLines={1}>{person.character}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Similar Movies Section */}
            {movie.similar?.results?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Similar Movies</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {movie.similar.results.slice(0, 5).map(similarMovie => (
                            <TouchableOpacity 
                                key={similarMovie.id} 
                                style={styles.similarMovieCard}
                                onPress={() => navigation.push('MovieDetails', { movieId: similarMovie.id })}
                            >
                                <Image
                                    source={{
                                        uri: similarMovie.poster_path
                                            ? `${BASE_IMAGE_URL}/w185${similarMovie.poster_path}`
                                            : 'https://via.placeholder.com/185x278?text=No+Poster',
                                    }}
                                    style={styles.similarMovieImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    backdropContainer: {
        height: 250,
        position: 'relative',
    },
    backdrop: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    headerContent: {
        flexDirection: 'row',
        padding: 20,
        marginTop: -50,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#333',
    },
    headerText: {
        flex: 1,
        marginLeft: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    metaContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
    },
    metaText: {
        color: '#888',
        marginLeft: 5,
        fontSize: 14,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    genrePill: {
        backgroundColor: '#333',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
        marginBottom: 8,
    },
    genreText: {
        color: 'white',
        fontSize: 12,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    overview: {
        color: '#ccc',
        lineHeight: 22,
        fontSize: 15,
    },
    trailerButton: {
        flexDirection: 'row',
        backgroundColor: '#e50914',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    trailerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    castCard: {
        width: 120,
        marginRight: 15,
    },
    castImage: {
        width: 120,
        height: 160,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    castName: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 14,
    },
    castCharacter: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    similarMovieCard: {
        width: 120,
        marginRight: 15,
    },
    similarMovieImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
        backgroundColor: '#333',
    },
});

export default MovieDetailsScreen;