import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    Text,
    TouchableOpacity
} from 'react-native';
import { searchMovies, searchTVShows } from '../../services/tmdbService';
import MediaCard from '../../components/MediaCard'; // Updated component name
import { debounce, min } from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('movies'); // 'movies' or 'tv'

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchQuery) => {
            if (searchQuery.length > 2) {
                try {
                    setLoading(true);
                    setError(null);

                    let data = [];
                    if (searchType === 'movies') {
                        data = await searchMovies(searchQuery);
                    } else {
                        data = await searchTVShows(searchQuery);
                    }

                    setResults(data);
                } catch (err) {
                    setError('Failed to fetch results');
                    console.error('Search error:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500),
        [searchType] // Recreate debounce when searchType changes
    );

    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query, searchType]);

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        Keyboard.dismiss();
    };

    const navigateToDetails = (item) => {
        if (searchType === 'movies') {
            navigation.navigate('Home', {
                screen: 'MovieDetails',
                params: { movieId: item.id },
            });
        } else {
            navigation.navigate('Home', {
                screen: 'TVShowDetails',
                params: { showId: item.id },
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Type Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, searchType === 'movies' && styles.activeToggle]}
                    onPress={() => setSearchType('movies')}
                >
                    <Text style={[styles.toggleText, searchType === 'movies' && styles.activeToggleText]}>Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, searchType === 'tv' && styles.activeToggle]}
                    onPress={() => setSearchType('tv')}
                >
                    <Text style={[styles.toggleText, searchType === 'tv' && styles.activeToggleText]}>TV Shows</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={`Search ${searchType === 'movies' ? 'movies' : 'TV shows'}...`}
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                    clearButtonMode="while-editing"
                />
                {query.length > 0 && (
                    <MaterialIcons
                        name="close"
                        size={24}
                        color="#666"
                        onPress={clearSearch}
                        style={styles.clearIcon}
                    />
                )}
            </View>

            {/* Results */}
            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} color="#e50914" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => `${item.id}-${searchType}`}
                    renderItem={({ item }) => (
                        <MediaCard
                            item={item}
                            type={searchType}
                            
                            onPress={() => navigateToDetails(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    ListEmptyComponent={
                        query.length > 2 ? (
                            <Text style={styles.emptyText}>No results found</Text>
                        ) : (
                            <Text style={styles.emptyText}>
                                {`Search for ${searchType === 'movies' ? 'movies' : 'TV shows'} by title`}
                            </Text>
                        )
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 10,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#333',
        overflow: 'hidden',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#e50914',
    },
    toggleText: {
        color: '#999',
        fontWeight: 'bold',
    },
    activeToggleText: {
        color: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: 'white',
        paddingLeft: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    clearIcon: {
        padding: 5,
    },
    listContent: {
        paddingBottom: 20,
    },
    loader: {
        marginTop: 50,
    },
    errorText: {
        color: '#e50914',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});

export default SearchScreen;