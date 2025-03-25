import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { BASE_IMAGE_URL, getTVShowDetails } from '../../services/tmdbService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';

const TVShowDetailsScreen = ({ route }) => {
    const { showId } = route.params;
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trailerKey, setTrailerKey] = useState(null);

    console.log(showId);
    
    useEffect(() => {
        const fetchTVShowDetails = async () => {
            try {
                setLoading(true);
                const details = await getTVShowDetails(showId);
                
                if (!details) {
                    throw new Error('No TV show details returned');
                }

                setShow(details);
                

                // Find first available trailer or teaser
                const trailer = details.videos?.results?.find(
                    video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
                );
                setTrailerKey(trailer?.key || null);
            } catch (error) {
                console.error("Error fetching TV show details:", error);
                setShow(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTVShowDetails();
    }, [showId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    if (!show) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load TV show details</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Backdrop with Gradient */}
            <View style={styles.backdropContainer}>
                <Image 
                    source={{ 
                        uri: show.backdrop_path 
                            ? `${BASE_IMAGE_URL}/w1280${show.backdrop_path}`
                            : 'https://via.placeholder.com/1280x720?text=No+Backdrop'
                    }} 
                    style={styles.backdrop}
                />
                <LinearGradient
                    colors={['transparent', '#1a1a1a']}
                    style={styles.gradient}
                />
            </View>

            {/* Show Header */}
            <View style={styles.headerContent}>
                <Image 
                    source={{ 
                        uri: show.poster_path 
                            ? `${BASE_IMAGE_URL}/w500${show.poster_path}`
                            : 'https://via.placeholder.com/500x750?text=No+Poster'
                    }} 
                    style={styles.poster}
                />
                <View style={styles.headerText}>
                    <Text style={styles.title}>{show.name}</Text>
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Icon name="calendar-today" size={16} color="#888" />
                            <Text style={styles.metaText}>
                                {show.first_air_date?.split('-')[0] || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="star" size={16} color="#FFD700" />
                            <Text style={styles.metaText}>
                                {show.vote_average?.toFixed(1) || 'N/A'}/10
                            </Text>
                        </View>
                    </View>
                    <View style={styles.genreContainer}>
                        {show.genres?.slice(0, 3).map(genre => (
                            <Text key={genre.id} style={styles.genreText}>{genre.name}</Text>
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
                        play={false}
                        videoId={trailerKey}
                    />
                </View>
            )}

            {/* Overview Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Overview</Text>
                <Text style={styles.overview}>
                    {show.overview || 'No overview available.'}
                </Text>
            </View>

            {/* Seasons Section */}
            {show.seasons?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seasons</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {show.seasons.map(season => (
                            <View key={season.id} style={styles.seasonCard}>
                                <Image 
                                    source={{ 
                                        uri: season.poster_path 
                                            ? `${BASE_IMAGE_URL}/w185${season.poster_path}`
                                            : 'https://via.placeholder.com/185x278?text=No+Image' 
                                    }} 
                                    style={styles.seasonImage} 
                                />
                                <Text style={styles.seasonTitle}>{season.name}</Text>
                                <Text style={styles.seasonEpisodeCount}>
                                    {season.episode_count} episodes
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a1a' },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#1a1a1a' 
    },
    errorText: { color: 'white', fontSize: 18 },
    backdropContainer: { height: 250, position: 'relative' },
    backdrop: { width: '100%', height: '100%' },
    gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
    headerContent: { 
        flexDirection: 'row', 
        padding: 20, 
        marginTop: -50,
        alignItems: 'flex-end'
    },
    poster: { 
        width: 120, 
        height: 180, 
        borderRadius: 8, 
        borderWidth: 2, 
        borderColor: '#333' 
    },
    headerText: { flex: 1, marginLeft: 20 },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: 10 
    },
    metaContainer: { 
        flexDirection: 'row', 
        marginBottom: 10,
        flexWrap: 'wrap'
    },
    metaItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginRight: 15,
        marginBottom: 5
    },
    metaText: { 
        color: '#888', 
        marginLeft: 5, 
        fontSize: 14 
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    },
    genreText: {
        backgroundColor: '#333',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
        fontSize: 12
    },
    section: { 
        paddingHorizontal: 20, 
        marginBottom: 25 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: 15 
    },
    overview: { 
        color: '#ccc', 
        lineHeight: 22, 
        fontSize: 15 
    },
    seasonCard: { 
        width: 120, 
        marginRight: 15 
    },
    seasonImage: { 
        width: 120, 
        height: 180, 
        borderRadius: 8, 
        backgroundColor: '#333' 
    },
    seasonTitle: { 
        color: 'white', 
        fontWeight: 'bold', 
        marginTop: 8, 
        fontSize: 14 
    },
    seasonEpisodeCount: {
        color: '#888',
        fontSize: 12,
        marginTop: 2
    }
});

export default TVShowDetailsScreen;