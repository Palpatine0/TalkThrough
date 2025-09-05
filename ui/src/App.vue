<template>
  <v-app>

    <v-main class="grey lighten-5">
      <router-view class="grey lighten-5" />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: "App",
  components: {
    NavBar,
  },
  provide() {
    return {
      globalData: this.globalData,
      reload: this.reload
    };
  },
  data() {
    return {
      globalData: {
        deviceWidth: 0
      },
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  },
  mounted() {
    this.globalData.deviceWidth = window.screen.width;
  }
};
</script>

<style lang="less">
* {
  font-family: Arial;
  //outline: 1px solid red;
}

.center-h {
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 0 auto;
}

.center-v {
  display: flex;
  align-items: center;
}
</style>
