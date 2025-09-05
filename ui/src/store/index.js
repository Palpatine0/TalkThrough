// store/index.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        drawer: true,
        awsS3RequestUrl: "https://percival-s3-zillow.s3.us-east-1.amazonaws.com/",
        awsS3ImagePaths: {
            item: 'public/image/item/'
        },
        links: [
            {icon: 'fa-solid fa-layer-group', text: 'Professional'},
            {icon: 'fas fa-laptop-house', text: 'Romantic'},
            {icon: 'fa-lg fa-solid fa-user', text: 'Casual'},
        ]
    },
    mutations: {
        toggleDrawer(state) {
            state.drawer = !state.drawer;
        },
    },
    actions: {
        initializeStore({commit}) {
        }
    },
    modules: {}
});
