import MoviesList from "./views/MoviesList";
import AddEditMovie from './components/addComponents/AddEditMovie';
import ActorsList from "./views/ActorsList";
import { createRouter, createWebHistory } from 'vue-router'
import ProducerList from "./views/ProducerList.vue";
import GenreList from "./views/GenreList.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: MoviesList
    },
    {
        path: '/actors',
        name: 'actors',
        component: ActorsList
    },
    {
        path: '/add-movie',
        name: 'add-movie',
        component: AddEditMovie
    },
    {
        path: '/edit-movie/:id',
        name: 'edit-movie',
        component: AddEditMovie,
        props: true,
    },
    {
        path: '/genres',
        name: 'genres',
        component: GenreList,
    },
    {
        path: '/producers',
        name: 'producers',
        component: ProducerList,
    },
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
