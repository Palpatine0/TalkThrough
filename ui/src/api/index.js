// index.js
import base from "./base"
import qs from "querystring"
import axios from 'axios'


const api = {
    relationships: {
        survey() {
            return axios.get(base.baseUrl + base.relationships.survey)
        },
    },

    chat: {
        message(params) {
            return axios.post(base.baseUrl + base.chat.message, qs.stringify(params));
        },
    },

}

export default api;