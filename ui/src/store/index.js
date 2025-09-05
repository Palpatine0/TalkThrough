// store/index.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        drawer: true,
        surveyData: null,
        awsS3RequestUrl: "https://percival-s3-zillow.s3.us-east-1.amazonaws.com/",
        awsS3ImagePaths: {
            item: 'public/image/item/'
        },
        links: [
            {icon: 'fas fa-laptop-house', text: 'Personal'},
            {icon: 'fa-solid fa-layer-group', text: 'Professional'},
            {icon: 'fa-lg fa-solid fa-user', text: 'Casual'},
        ]
    },
    mutations: {
        toggleDrawer(state) {
            state.drawer = !state.drawer;
        },
        setSurveyData(state, surveyData) {
            state.surveyData = surveyData;
        },
    },
    actions: {
        initializeStore({commit}) {
        },
        setSurveyData({commit}, surveyData) {
            commit('setSurveyData', surveyData);
        }
    },
    modules: {}
});
