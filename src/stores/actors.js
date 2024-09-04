import axios from 'axios';
const root = "https://localhost:44328/Actors";

export default {
    state: {
        actors: [],
        actor: {}, // To store a single actor when needed
        error: '',
    },
    mutations: {
        SET_ACTORS(state, actors) {
            state.actors = actors;
        },
        SET_ACTOR(state, actor) {
            state.actor = actor;
        },
    },
    actions: {
        async fetchActors({ dispatch, commit }) {
            try {
                await axios.get(`${root}`).then((response) => {
                    if (response.status == 200) {
                        commit('SET_ACTORS', response.data);
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error fetching actors', { root: true });
                    }
                });
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error fetching actors', { root: true });
            }
        },
        async fetchActor({ dispatch, commit }, id) {
            try {
                await axios.get(`${root}/${id}`).then((response) => {
                    if (response.status == 200) {
                        commit('SET_ACTOR', response.data);
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error fetching actor details', { root: true });
                    }
                });
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error fetching actor details', { root: true });
            }
        },
        async addActor({ dispatch }, actor) {
            try {
                await axios.post(`${root}`, actor).then((response) => {
                    if (response.status == 201) {
                        dispatch('fetchActors');
                        dispatch('notifications/setSuccessMessage', 'Actor added successfully', { root: true });
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error adding actor', { root: true });
                    }
                });
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error adding actor', { root: true });
            }
        },
        async deleteActor({ dispatch }, id) {
            try {
                await axios.delete(`${root}/${id}`).then((response) => {
                    if (response.status == 200) {
                        dispatch('fetchActors');
                        dispatch('notifications/setSuccessMessage', 'Actor deleted successfully', { root: true });
                    } else {
                        dispatch('notifications/setErrorMessage', 'Error deleting actor', { root: true });
                    }
                });
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error deleting actor', { root: true });
            }
        },
        async editActor({ dispatch }, actor) {
            try {
                const response = await axios.put(`${root}/${actor.id}`, actor);
                if (response.status == 200 || response.status == 204) {
                    dispatch('fetchActors');
                    dispatch('notifications/setSuccessMessage', 'Actor updated successfully', { root: true });
                } else {
                    dispatch('notifications/setErrorMessage', 'Error updating actor', { root: true });
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', 'Error updating actor', { root: true });
            }
        },
    },
    getters: {
        getActors: state => state.actors,
        getActor: state => state.actor,
    }
};
