import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from "@/views/Dashboard/Dashboard.vue";
import PersonalSurvey from "@/views/PersonalSurvey.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
