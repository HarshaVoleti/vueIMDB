import axios from 'axios';
const root = 'https://localhost:44328/Producers';

export default {
    state: {
        producers: [],
        producer: {}, // To store a single producer when needed
        error: '',
    },
    mutations: {
        SET_PRODUCERS(state, producers) {
            state.producers = producers;
        },
        SET_PRODUCER(state, producer) {
            state.producer = producer;
        },
    },
    actions: {
        async fetchProducers({ dispatch, commit }) {
            try {
                const response = await axios.get(`${root}`);
                if (response.status === 200) {
                    commit('SET_PRODUCERS', response.data);
                } else {
                    throw new Error('Error fetching producers');
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', e.message || 'Error fetching producers', { root: true });
            }
        },
        async fetchProducer({ dispatch, commit }, id) {
            try {
                const response = await axios.get(`${root}/${id}`);
                if (response.status === 200) {
                    commit('SET_PRODUCER', response.data);
                } else {
                    throw new Error('Error fetching producer details');
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', e.message || 'Error fetching producer details', { root: true });
            }
        },
        async addProducer({ dispatch }, producer) {
            try {
                const response = await axios.post(`${root}`, producer);
                if (response.status === 201) {
                    dispatch('fetchProducers');
                    dispatch('notifications/setSuccessMessage', 'Producer added successfully', { root: true });
                } else {
                    throw new Error('Error adding producer');
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', e.message || 'Error adding producer', { root: true });
            }
        },
        async deleteProducer({ dispatch }, id) {
            try {
                const response = await axios.delete(`${root}/${id}`);
                if (response.status === 200) {
                    dispatch('fetchProducers');
                    dispatch('notifications/setSuccessMessage', 'Producer deleted successfully', { root: true });
                } else {
                    throw new Error('Error deleting producer');
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', e.message || 'Error deleting producer', { root: true });
            }
        },
        async editProducer({ dispatch }, producer) {
            try {
                const response = await axios.put(`${root}/${producer.id}`, producer);
                if (response.status === 200 || response.status === 204) {
                    dispatch('fetchProducers');
                    dispatch('notifications/setSuccessMessage', 'Producer updated successfully', { root: true });
                } else {
                    throw new Error('Error updating producer');
                }
            } catch (e) {
                dispatch('notifications/setErrorMessage', e.message || 'Error updating producer', { root: true });
            }
        },
    },
    getters: {
        getProducers: state => state.producers,
        getProducer: state => state.producer,
    }
};
