<template>
<v-app>
    <v-layout row class="bg">
      <NavBar />
      <PersonalSurvey />

        <v-flex md3>
            <v-container>
            </v-container>
        </v-flex>
        <v-flex md9>

        </v-flex>
    </v-layout>
</v-app>
</template>

<script>
import MarkdownIt from 'markdown-it';
import NavBar from "@/components/NavBar.vue";
import PersonalSurvey from "@/views/PersonalSurvey.vue";


const md = new MarkdownIt({
    breaks: true,
    html: true
});

export default {
    name: "Dashboard",
  components: {NavBar},
    data() {
        return {
            datePicker: new Date().toISOString().substr(0, 10),

            nrcValue: [],
            nrcSummary: '',
            housingVacanciesSummary: '',
            homeownershipSummary: '',
            estimatedRentedUnitsSummary: '',
        }
    },
    mounted() {
        this.getNewConstructionStatValues()
        this.getNewConstructionStatSummary()
        this.getHousingVacanciesStatSummary()
        this.getHomeownershipStatSummary()
        this.getEstimatedRentedUnitsStatSummary()
    },
    methods: {
        getNewConstructionStatValues() {
            this.$api.llm.getNewConstructionStatValues({})
            .then((res) => {
                this.nrcValue = res.data;
            })
        },
        getNewConstructionStatSummary() {
            this.$api.llm.getNewConstructionStatSummary({})
            .then((res) => {
                this.nrcSummary = res.data;
            })
        },
        getHousingVacanciesStatSummary() {
            this.$api.llm.getHousingVacanciesStatSummary({})
            .then((res) => {
                this.housingVacanciesSummary = res.data;
            })
        },
        getHomeownershipStatSummary() {
            this.$api.llm.getHomeownershipStatSummary({})
            .then((res) => {
                this.homeownershipSummary = res.data;
            })
        },
        getEstimatedRentedUnitsStatSummary() {
            this.$api.llm.getEstimatedRentedUnitsStatSummary({})
            .then((res) => {
                this.estimatedRentedUnitsSummary = res.data;
            })
        },

        renderMarkdown(text) {
            return md.render(text);
        },
        datePickerFunctionEvents(date) {
            const [, , day] = date.split('-')
            if([12, 17, 28].includes(parseInt(day, 10))) return true
            if([1, 19, 22].includes(parseInt(day, 10))) return ['red', '#00f']
            return false
        },
    },

}
</script>

<style>
.bg {
  background: radial-gradient(circle at center, rgba(223, 255, 0, 0.33) 0%, rgba(234, 255, 0, 0.18) 60%, #ffffff 100%);
}
li {
    display: list-item !important;
    margin-bottom: 18px !important;
}
</style>
