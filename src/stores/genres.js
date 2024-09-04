import axios from "axios";
const root = "https://localhost:44328/Genre";

export default {
    state: {
        genres: [],
        genre: {}, // To store a single genre when needed
        error: "",
    },
    mutations: {
        SET_GENRES(state, genres) {
            state.genres = genres;
        },
        SET_GENRE(state, genre) {
            state.genre = genre;
        },
    },
    actions: {
        async fetchGenres({ dispatch, commit }) {
            try {
                await axios.get(`${root}`).then((response) => {
                    if (response.status == 200) {
                        commit("SET_GENRES", response.data);
                    } else {
                        dispatch(
                            "notifications/setErrorMessage",
                            "Error fetching genres",
                            { root: true }
                        );
                    }
                });
            } catch (e) {
                dispatch(
                    "notifications/setErrorMessage",
                    "Error fetching genres",
                    { root: true }
                );
            }
        },
        async fetchGenre({ dispatch, commit }, id) {
            try {
                await axios.get(`${root}/${id}`).then((response) => {
                    if (response.status == 200) {
                        commit("SET_GENRE", response.data);
                    } else {
                        dispatch(
                            "notifications/setErrorMessage",
                            "Error fetching genre details",
                            { root: true }
                        );
                    }
                });
            } catch (e) {
                dispatch(
                    "notifications/setErrorMessage",
                    "Error fetching genre details",
                    { root: true }
                );
            }
        },
        async addGenre({ dispatch }, genre) {
            try {
                await axios.post(`${root}`, genre).then((response) => {
                    if (response.status == 201) {
                        dispatch("fetchGenres");
                        dispatch(
                            "notifications/setSuccessMessage",
                            "Genre added successfully",
                            { root: true }
                        );
                    } else {
                        dispatch(
                            "notifications/setErrorMessage",
                            "Error adding genre",
                            { root: true }
                        );
                    }
                });
            } catch (e) {
                dispatch(
                    "notifications/setErrorMessage",
                    "Error adding genre",
                    { root: true }
                );
            }
        },
        async deleteGenre({ dispatch }, id) {
            try {
                await axios.delete(`${root}/${id}`).then((response) => {
                    if (response.status == 200) {
                        dispatch("fetchGenres");
                        dispatch(
                            "notifications/setSuccessMessage",
                            "Genre deleted successfully",
                            { root: true }
                        );
                    } else {
                        dispatch(
                            "notifications/setErrorMessage",
                            "Error deleting genre",
                            { root: true }
                        );
                    }
                });
            } catch (e) {
                dispatch(
                    "notifications/setErrorMessage",
                    "Error deleting genre",
                    { root: true }
                );
            }
        },
        async editGenre({ dispatch }, genre) {
            try {
                const response = await axios.put(`${root}/${genre.id}`, genre);
                if (response.status == 200 || response.status == 204) {
                    dispatch("fetchGenres");
                    dispatch(
                        "notifications/setSuccessMessage",
                        "Genre updated successfully",
                        { root: true }
                    );
                } else {
                    dispatch(
                        "notifications/setErrorMessage",
                        "Error updating genre",
                        { root: true }
                    );
                }
            } catch (e) {
                dispatch(
                    "notifications/setErrorMessage",
                    "Error updating genre",
                    { root: true }
                );
            }
        },
    },
    getters: {
        getGenres: (state) => state.genres,
        getGenre: (state) => state.genre,
    },
};
