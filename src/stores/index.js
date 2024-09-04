import Vuex from 'vuex';
import movies from './movies';
import actors from './actors';
import producers from './producers';
import genres from './genres';
import notifications from './notifications';

export default new Vuex.Store({
    modules: {
        movies,
        actors,
        producers,
        genres,
        notifications,
    }
});
