<template>
  <div>
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
        <v-list-item v-for="(item, i) in links" :key="i" link style="padding: 0 40px" @click="showSurveyModal(item)">
          <v-icon class="mb-2" style="color: #000;width: 15px">{{ item.icon }}</v-icon>
          <v-list-item-subtitle style="color: #000;font-size: 16px;margin-left: 20px">{{ item.text }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <Survey 
      :show-modal="showModal" 
      :selected-item-text="selectedItemText"
      @close-modal="closeSurveyModal"
    />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Survey from './Survey.vue'

export default {
  components: {
    Survey
  },
  data() {
    return {
      showModal: false,
      selectedItemText: ''
    };
  },

  computed: {
    ...mapState(['drawer']),
    ...mapState(['links'])
  },
  methods: {
    showSurveyModal(item) {
      this.selectedItemText = item.text;
      this.showModal = true;
    },
    closeSurveyModal() {
      this.showModal = false;
      this.selectedItemText = '';
    }
  },


};
</script>

<style>
</style>