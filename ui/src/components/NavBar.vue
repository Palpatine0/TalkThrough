<template>
  <v-navigation-drawer
    :value="drawer"

  >
    <v-list>
      <v-list-item class="mb-12 mt-6 center-h">
        <v-img
          src="@/assets/icon.png"
          alt="Logo"
          max-width="150"
        ></v-img>
      </v-list-item>
    </v-list>
    <v-list flat>
      <v-list-item v-for="(item, i) in links" :key="i" link style="padding: 0 40px" @click="navigateTo(item)">
        <v-icon class="mb-2" style="color: #000;width: 15px">{{ item.icon }}</v-icon>
        <v-list-item-subtitle style="color: #000;font-size: 16px;margin-left: 20px">{{ item.text }}</v-list-item-subtitle>
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
    navigateTo(item) {
      // Navigate to Survey with the item text as a parameter
      this.$router.push({
        path: '/survey',
        query: { selectedItem: item.text }
      });
    }
  },


};
</script>

<style>
</style>