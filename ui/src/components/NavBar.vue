<template>
<v-navigation-drawer :value="drawer" dark style="background: #FFFFFF;margin: 50px;width: 200px;border-radius: 25px" >

    <v-list>
        <v-list-item class="mb-12">
            <v-list-item-action>
            </v-list-item-action>
        </v-list-item>
    </v-list>
    <v-list flat>
        <v-list-item v-for="(item, i) in links" :key="i" link @click="navigateTo(item.route)" >
            <v-list-item-content>
                <v-icon class="mb-4" v-text="item.icon" style="color: rgba(193,193,193,0.67);"></v-icon>
                <v-list-item-subtitle v-text="item.text" align="center" style="color: rgba(193,193,193,0.67);"></v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data() {
        return {};
    },

    computed: {
        ...mapState(['drawer']),
        ...mapState(['links'])
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        }
    },


};
</script>
