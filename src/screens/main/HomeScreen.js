import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, BackHandler } from 'react-native';
import { 
    getPopularMovies, 
    getUpcomingMovies, 
    getTopRatedMovies, 
    getPopularTVShows, 
    getTopRatedTVShows 
} from '../../services/tmdbService';
import MovieCard from '../../components/MovieCard';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [popularTVShows, setPopularTVShows] = useState([]);
    const [topRatedTVShows, setTopRatedTVShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [popular, upcoming, topRated, popularTV, topRatedTV] = await Promise.all([
                    getPopularMovies(),
                    getUpcomingMovies(),
                    getTopRatedMovies(),
                    getPopularTVShows(),
                    getTopRatedTVShows()
                ]);
                
                setPopularMovies(popular);
                setUpcomingMovies(upcoming);
                setTopRatedMovies(topRated);
                setPopularTVShows(popularTV);
                setTopRatedTVShows(topRatedTV);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const backHandler = () => true; // Disable hardware back button
        const backHandlerListener = BackHandler.addEventListener('hardwareBackPress', backHandler);
        return () => backHandlerListener.remove();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MovieApp</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <MaterialIcons name="account-circle" size={32} color="#e50914" />
                </TouchableOpacity>
            </View>

            {/* Popular Movies */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Movies</Text>
                <FlatList
                    horizontal
                    data={popularMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard 
                            movie={item} 
                            size="medium"
                            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Upcoming Movies */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Coming Soon</Text>
                <FlatList
                    horizontal
                    data={upcomingMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard 
                            movie={item} 
                            size="medium"
                            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Top Rated Movies */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Rated Movies</Text>
                <FlatList
                    horizontal
                    data={topRatedMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard 
                            movie={item} 
                            size="medium"
                            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Popular TV Shows */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular TV Shows</Text>
                <FlatList
                    horizontal
                    data={popularTVShows}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard 
                            movie={item} 
                            size="medium"
                            onPress={() => navigation.navigate('TVShowDetails', { showId: item.id })}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Top Rated TV Shows */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Rated TV Shows</Text>
                <FlatList
                    horizontal
                    data={topRatedTVShows}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard 
                            movie={item} 
                            size="medium"
                            onPress={() => navigation.navigate('TVShowDetails', { showId: item.id })}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingTop: 30,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e50914',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        paddingLeft: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
});

export default HomeScreen;
