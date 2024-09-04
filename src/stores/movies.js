import axios from 'axios';
const root = "https://localhost:44328/Movies";

export default {
    state: {
        movies: [],
        movie: {},
        error: '',
    },
    mutations: {
        SET_MOVIES(state, movies) {
            state.movies = movies;
        },
        SET_MOVIE(state, movie) {
            state.movie = movie;
        },
    },
    actions: {
        async fetchMovies({ dispatch, commit }) {
            try {
                await axios.get(`${root}`).then((response) => {
                    if (response.status == 200) {
                        commit('SET_MOVIES', response.data);
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error fetching movies', { root: true });
                    }
                })
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error fetching movies', { root: true });
            }
        },
        async fetchMovie({ dispatch, commit }, id) {
            try {
                await axios.get(`${root}/${id}`).then((response) => {
                    if (response.status == 200) {
                        commit('SET_MOVIE', response.data);
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error fetching movie details', { root: true });
                    }
                })
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error fetching movie details', { root: true });
            }
        },
        async addMovie({ dispatch }, movie) {
            try {
                await axios.post(`${root}`, movie).then((response) => {
                    if (response.status == 201) {
                        dispatch('fetchMovies');
                        dispatch('notifications/setSuccessMessage', 'Movie added successfully', { root: true });
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error adding movie', { root: true });
                    }
                });
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error adding movie', { root: true });
            }
        },
        async deleteMovie({ dispatch }, id) {
            try {
                await axios.delete(`${root}/${id}`).then((response) => {
                    if (response.status == 200) {
                        dispatch('fetchMovies');
                        dispatch('notifications/setSuccessMessage', 'Movie deleted successfully', { root: true });
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error deleting movie', { root: true });
                    }
                });
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error deleting movie', { root: true });
            }
        },
        async editMovie({ dispatch }, movie) {
            let response = null
            try {
                response = await axios.put(`${root}/${movie.id}`, movie).catch((e) => {
                    console.log("error occured while posint movie" + "and " + e);
                });
                if (response.status == 200 || response.status == 204) {
                    dispatch('fetchMovies');
                    dispatch('notifications/setSuccessMessage', 'Movie updated successfully', { root: true });
                } else {
                    dispatch('notifications/setErrorMessage', 'Error updating movie', { root: true });
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error updating movie', { root: true });
            }
        },
    },
    getters: {
        getMovies: state => state.movies,
        getMovie: state => state.movie,
    }
};
