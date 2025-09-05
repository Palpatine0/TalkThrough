<template>
  <v-dialog
    :value="showModal"
    @input="closeModal"
    max-width="700px"
    persistent
    scrollable
  >
    <v-card class="elevation-8" style="border-radius: 20px;">
      <v-card-title class="text-center pa-6 pb-4" style="flex-direction: column;">
        <div class="d-flex align-center justify-center mb-4">
          <v-avatar size="50" style="background-color: #E1FF05; margin-right: 16px;">
            <v-icon size="24" color="white">self_improvement</v-icon>
          </v-avatar>
          <div class="text-left">
            <h2 class="headline mb-1">{{ selectedItemText || 'Personal' }} Coach Survey</h2>
            <p class="subtitle-2 ma-0" style="color: #7f8c8d;">
              Help me understand your current {{ selectedItemText || 'personal' }} situation
            </p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-4 pt-2">
        <v-form ref="form" v-model="valid">
          <!-- Question 1: Growth Area -->
          <div class="question-section mb-5">
            <v-card class="question-card" style="border-radius: 12px; border-left: 4px solid #E1FF05; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <v-card-text class="pa-4">
                <h4 class="subtitle-1 mb-3 font-weight-medium" style="color: #2c3e50;">
                  1. What area of personal growth are you focusing on?
                </h4>
                <v-radio-group v-model="answers.growthArea" :rules="[v => !!v || 'Please select an option']" class="mt-2">
                  <v-radio
                    v-for="option in growthAreaOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                    color="cyan"
                    class="mb-1"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </div>

          <!-- Question 2: Current Confidence Level -->
          <div class="question-section mb-5">
            <v-card class="question-card" style="border-radius: 12px; border-left: 4px solid #E1FF05; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <v-card-text class="pa-4">
                <h4 class="subtitle-1 mb-3 font-weight-medium" style="color: #2c3e50;">
                  2. How confident do you feel in this area right now?
                </h4>
                <div class="slider-container mt-3">
                  <v-slider
                    v-model="answers.confidenceLevel"
                    :min="1"
                    :max="10"
                    :step="1"
                    thumb-label
                    color="#000"
                    track-color="#000"
                    class="mt-2"
                  >
                    <template v-slot:thumb-label="{ value }">
                      {{ value }}/10
                    </template>
                  </v-slider>
                  <div class="d-flex justify-space-between mt-1">
                    <span class="caption" style="color: #7f8c8d;">Not Confident</span>
                    <span class="caption" style="color: #7f8c8d;">Very Confident</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Question 3: Support System -->
          <div class="question-section mb-5">
            <v-card class="question-card" style="border-radius: 12px; border-left: 4px solid #E1FF05; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <v-card-text class="pa-4">
                <h4 class="subtitle-1 mb-3 font-weight-medium" style="color: #2c3e50;">
                  3. How would you describe your current support system?
                </h4>
                <v-radio-group v-model="answers.supportSystem" :rules="[v => !!v || 'Please select an option']" class="mt-2">
                  <v-radio
                    v-for="option in supportSystemOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                    color="cyan"
                    class="mb-1"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </div>

          <!-- Question 4: Specific Goal -->
          <div class="question-section mb-4">
            <v-card class="question-card" style="border-radius: 12px; border-left: 4px solid #E1FF05; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <v-card-text class="pa-4">
                <h4 class="subtitle-1 mb-3 font-weight-medium" style="color: #2c3e50;">
                  4. What specific goal or challenge would you like help with?
                </h4>
                <v-textarea
                  v-model="answers.specificGoal"
                  :rules="[v => !!v || 'Please describe your goal or challenge']"
                  placeholder="e.g., I want to build more confidence in public speaking, I need help setting boundaries with family, I want to develop better communication skills..."
                  rows="3"
                  outlined
                  class="mt-2"
                  style="border-radius: 10px;"
                ></v-textarea>
              </v-card-text>
            </v-card>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2" style="background-color: #fafafa; border-top: 1px solid #e0e0e0;">
        <v-btn @click="goBack" text color="grey" class="ml-2">
          <v-icon left size="20">arrow_back</v-icon>
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!valid"
          @click="submitSurvey"
          color="cyan"
          depressed
          style="border-radius: 20px; padding: 0 24px; text-transform: none;"
          class="font-weight-medium mr-2"
        >
          <v-icon left size="20">send</v-icon>
          Start Coaching Session
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PersonalSurvey',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    selectedItemText: {
      type: String,
      default: ''
    }
  },
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
        {value: 'confidence', label: 'Building self-confidence'},
        {value: 'communication', label: 'Improving communication skills'},
        {value: 'boundaries', label: 'Setting healthy boundaries'},
        {value: 'emotional_intelligence', label: 'Developing emotional intelligence'},
        {value: 'decision_making', label: 'Better decision making'},
        {value: 'stress_management', label: 'Managing stress and anxiety'},
        {value: 'goal_setting', label: 'Setting and achieving goals'},
        {value: 'self_awareness', label: 'Increasing self-awareness'}
      ],
      supportSystemOptions: [
        {value: 'strong', label: 'Strong - I have close friends and family who support me'},
        {value: 'moderate', label: 'Moderate - Some support but could use more'},
        {value: 'limited', label: 'Limited - I have few people I can rely on'},
        {value: 'isolated', label: 'Isolated - I feel like I\'m mostly on my own'},
        {value: 'professional', label: 'Professional - I rely on therapists or coaches'}
      ]
    }
  },
  methods: {
    submitSurvey() {
      if (this.$refs.form.validate()) {
        const surveyData = {
          coachType: this.selectedItemText.toLowerCase() || 'personal',
          answers: this.answers,
          timestamp: new Date()
        }

        // Store survey data (if store is available)
        if (this.$store) {
          this.$store.dispatch('setSurveyData', surveyData)
        }

        // Show success message
        if (this.$toast) {
          this.$toast.success(`Survey submitted successfully! Your ${this.selectedItemText || 'personal'} coach is ready to help.`)
        }

        // Close modal
        this.closeModal()
      }
    },
    goBack() {
      this.closeModal()
    },
    closeModal() {
      this.$emit('close-modal')
    }
  }
}
</script>

<style scoped>
.question-section {
  margin-bottom: 1.5rem;
}

.question-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.slider-container {
  padding: 8px 0;
}

.v-radio-group >>> .v-radio {
  margin-bottom: 4px;
}

.v-radio-group >>> .v-input--selection-controls__input {
  margin-right: 12px;
}

.v-textarea >>> .v-input__control {
  border-radius: 8px;
}

.v-textarea >>> .v-input__control >>> .v-input__slot {
  padding: 12px 16px;
}

.v-dialog > .v-card > .v-card__text {
  max-height: 70vh;
  overflow-y: auto;
}

/* Custom scrollbar for dialog content */
.v-dialog > .v-card > .v-card__text::-webkit-scrollbar {
  width: 6px;
}

.v-dialog > .v-card > .v-card__text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.v-dialog > .v-card > .v-card__text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.v-dialog > .v-card > .v-card__text::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
