export default {
    namespaced: true,
    state: {
        errorMessage: '',
        successMessage: '',
    },
    mutations: {
        SET_ERROR_MESSAGE(state, message) {
            state.errorMessage = message;
        },
        SET_SUCCESS_MESSAGE(state, message) {
            state.successMessage = message;
        },
        CLEAR_MESSAGES(state) {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    actions: {
        setErrorMessage({ commit }, message) {
            commit('SET_ERROR_MESSAGE', message);
            setTimeout(() => {
                commit('CLEAR_MESSAGES');
            }, 3000); // Clears the message after 3 seconds
        },
        setSuccessMessage({ commit }, message) {
            commit('SET_SUCCESS_MESSAGE', message);
            setTimeout(() => {
                commit('CLEAR_MESSAGES');
            }, 3000); // Clears the message after 3 seconds
        },
        clearMessages({ commit }) {
            commit('CLEAR_MESSAGES');
        }
    },
    getters: {
        getError: state => state.errorMessage,
        getSuccess: state => state.successMessage,
    }
}