<template>
  <v-app>
    <v-layout row class="bg fill-height">
      <NavBar />
      <v-flex md3>
        <v-container>
        </v-container>
      </v-flex>
      <v-flex md9 class="d-flex align-center justify-center">
        <v-container class="survey-container">
          <v-row justify="center" align="center">
            <v-col cols="12" md="10" lg="8" xl="6">
              PersonalSurvey <v-card class="elevation-8" style="border-radius: 20px;">
                <v-card-title class="text-center pa-6">
                  <v-avatar size="60" class="mb-3" style="background-color: #00bcd4;">
                    <v-icon size="30" color="white">self_improvement</v-icon>
                  </v-avatar>
                  <h2 class="headline mb-2"> Personal Coach Survey</h2>
                  <p class="subtitle-1" style="color: #7f8c8d;">
                    Help me understand your current personal relationship situation
                </v-card-title>

                <v-card-text class="pa-6">
                  <v-form ref="form" v-model="valid">
                    <!-- Question 1: Growth Area -->
                    <v-card class="mb-6" style="border-radius: 15px; border-left: 4px solid #00bcd4;">
                      <v-card-text class="pa-4">
                        <h4 class="subtitle-1 mb-3" style="color: #2c3e50;">
                          1. What area of personal growth are you focusing on?
                        </h4>
                        <v-radio-group v-model="answers.growthArea" :rules="[v => !!v || 'Please select an option']">
                          <v-radio 
                            v-for="option in growthAreaOptions" 
                            :key="option.value"
                            :label="option.label" 
                            :value="option.value"
                            color="cyan"
                          ></v-radio>
                        </v-radio-group>
                      </v-card-text>
                    </v-card>

                    <!-- Question 2: Current Confidence Level -->
                    <v-card class="mb-6" style="border-radius: 15px; border-left: 4px solid #00bcd4;">
                      <v-card-text class="pa-4">
                        <h4 class="subtitle-1 mb-3" style="color: #2c3e50;">
                          2. How confident do you feel in this area right now?
                        </h4>
                        <v-slider
                          v-model="answers.confidenceLevel"
                          :min="1"
                          :max="10"
                          :step="1"
                          thumb-label
                          color="cyan"
                          track-color="cyan lighten-3"
                          class="mt-4"
                        >
                          <template v-slot:thumb-label="{ value }">
                            {{ value }}/10
                          </template>
                        </v-slider>
                        <div class="d-flex justify-space-between mt-2">
                          <span class="caption" style="color: #7f8c8d;">Not Confident</span>
                          <span class="caption" style="color: #7f8c8d;">Very Confident</span>
                        </div>
                      </v-card-text>
                    </v-card>

                    <!-- Question 3: Support System -->
                    <v-card class="mb-6" style="border-radius: 15px; border-left: 4px solid #00bcd4;">
                      <v-card-text class="pa-4">
                        <h4 class="subtitle-1 mb-3" style="color: #2c3e50;">
                          3. How would you describe your current support system?
                        </h4>
                        <v-radio-group v-model="answers.supportSystem" :rules="[v => !!v || 'Please select an option']">
                          <v-radio 
                            v-for="option in supportSystemOptions" 
                            :key="option.value"
                            :label="option.label" 
                            :value="option.value"
                            color="cyan"
                          ></v-radio>
                        </v-radio-group>
                      </v-card-text>
                    </v-card>

                    <!-- Question 4: Specific Goal -->
                    <v-card class="mb-6" style="border-radius: 15px; border-left: 4px solid #00bcd4;">
                      <v-card-text class="pa-4">
                        <h4 class="subtitle-1 mb-3" style="color: #2c3e50;">
                          4. What specific goal or challenge would you like help with?
                        </h4>
                        <v-textarea
                          v-model="answers.specificGoal"
                          :rules="[v => !!v || 'Please describe your goal or challenge']"
                          placeholder="e.g., I want to build more confidence in public speaking, I need help setting boundaries with family, I want to develop better communication skills..."
                          rows="3"
                          style="border-radius: 10px;"
                        ></v-textarea>
                      </v-card-text>
                    </v-card>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-6">
                  <v-btn @click="goBack" text color="grey">
                    <v-icon left>arrow_back</v-icon>
                    Back
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn 
                    :disabled="!valid"
                    @click="submitSurvey"
                    color="cyan"
                    style="border-radius: 25px; padding: 0 30px;"
                    class="font-weight-bold"
                  >
                    <v-icon left>send</v-icon>
                    Start Coaching
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: 'PersonalSurvey',
  components: { NavBar },
  data() {
    return {
      valid: false,
      answers: {
        growthArea: '',
        confidenceLevel: 5,
        supportSystem: '',
        specificGoal: ''
      },
      growthAreaOptions: [
        { value: 'confidence', label: 'Building self-confidence' },
        { value: 'communication', label: 'Improving communication skills' },
        { value: 'boundaries', label: 'Setting healthy boundaries' },
        { value: 'emotional_intelligence', label: 'Developing emotional intelligence' },
        { value: 'decision_making', label: 'Better decision making' },
        { value: 'stress_management', label: 'Managing stress and anxiety' },
        { value: 'goal_setting', label: 'Setting and achieving goals' },
        { value: 'self_awareness', label: 'Increasing self-awareness' }
      ],
      supportSystemOptions: [
        { value: 'strong', label: 'Strong - I have close friends and family who support me' },
        { value: 'moderate', label: 'Moderate - Some support but could use more' },
        { value: 'limited', label: 'Limited - I have few people I can rely on' },
        { value: 'isolated', label: 'Isolated - I feel like I\'m mostly on my own' },
        { value: 'professional', label: 'Professional - I rely on therapists or coaches' }
      ]
    }
  },
  methods: {
    submitSurvey() {
      if (this.$refs.form.validate()) {
        const surveyData = {
          coachType: 'personal',
          answers: this.answers,
          timestamp: new Date()
        }
        
        // Store survey data
        this.$store.dispatch('setSurveyData', surveyData)
        
        // Show success message
        this.$toast.success('Survey submitted successfully! Your personal coach is ready to help.')
        
        // Navigate back to home
        this.$router.push('/')
      }
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.survey-container {
  background: transparent;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.bg {
  background: radial-gradient(circle at center, rgba(223, 255, 0, 0.33) 0%, rgba(234, 255, 0, 0.18) 60%, #ffffff 100%);
  min-height: 100vh;
}

.fill-height {
  height: 100vh;
}

.v-card {
  overflow: hidden;
}

.v-radio-group {
  margin-top: 8px;
}

.v-slider {
  margin: 16px 0;
}

.v-textarea >>> .v-input__control {
  border-radius: 10px;
}

.v-textarea >>> .v-input__control >>> .v-input__slot {
  border-radius: 10px;
  padding: 12px 16px;
}
</style>
