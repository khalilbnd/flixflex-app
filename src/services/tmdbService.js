import axios from 'axios';

const API_KEY = '81f86678919b0e7ccd6f9192f5f4293b'; // Get this from TMDB
const READING_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MWY4NjY3ODkxOWIwZTdjY2Q2ZjkxOTJmNWY0MjkzYiIsIm5iZiI6MTc0MjgzMDQ4Ny4zNTYsInN1YiI6IjY3ZTE3Yjk3MWYyNTZhZWYxY2M3MTQ4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3GlvPZ5WqqFZl1DTsOe-rlE6rZRJH4YQ1ugD8QO8upU'
const BASE_URL = 'https://api.themoviedb.org/3';
export const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p';
const tmdb = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${READING_TOKEN}`,
    },
    params: {
        api_key: API_KEY,
        language: 'en-US',
    },
});


export const getPopularMovies = async (page = 1) => {
    try {
        const response = await tmdb.get(`${BASE_URL}/movie/popular`, {
            params: { page }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};


export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: query,
                language: 'en-US',
                page: 1,
                include_adult: false,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

export const getTopRatedTVShows = async (page = 1) => {
    try {
        const response = await tmdb.get('/tv/top_rated', { params: { page } });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching top rated TV shows:', error);
        return [];
    }
};

export const getPopularTVShows = async (page = 1) => {
    try {
        const response = await tmdb.get('/tv/popular', { params: { page } });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular TV shows:', error);
        return [];
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdb.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'videos,credits,similar',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

export const getTVShowDetails = async (id) => {
    console.log('id', id);

    try {
        const response = await tmdb.get(`/tv/${id}`, {
            params: {
                append_to_response: 'videos,credits,similar,content_ratings',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching TV show details:', error);
        throw error;
    }
};

export const searchTVShows = async (query, page = 1) => {
    try {
        const response = await tmdb.get('/search/tv', {
            params: { query, page },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error searching TV shows:', error);
        throw error;
    }
};


export const getUpcomingMovies = async () => {
    try {
        const response = await tmdb.get('/movie/upcoming');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        return [];
    }
};

export const getTopRatedMovies = async () => {
    try {
        const response = await tmdb.get('/movie/top_rated');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        return [];
    }
};