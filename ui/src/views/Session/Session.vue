<template>
  <v-app>
    <v-layout class="bg">
      <NavBar />
      <v-container class="chat-window">
        <div class="chat-body">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
          >
            <div class="message-content">
              <span v-if="message.sender === 'user'">{{ message.text }}</span>
              <span v-else v-html="renderMarkdown(message.text)"></span>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <v-col>
            <v-row>
              <div v-if="loading" class="loading">
                <span style="position: relative;top: 1.5px;margin-right: 4px;">Generating response</span>
                <v-icon size="14" color="info">fas fa-spinner fa-pulse</v-icon>
              </div>
            </v-row>
            <v-row>
              <v-text-field
                v-model="userInput"
                placeholder="Type your message..."
                hide-details
                outlined
                rounded
                @keyup.enter="sendMessage"
                style="background-color: white"
              ></v-text-field>
              <v-btn icon @click="sendMessage">
                <v-icon class="mt-4">fas fa-paper-plane</v-icon>
              </v-btn>
            </v-row>

          </v-col>
        </div>
      </v-container>

    </v-layout>
  </v-app>
</template>

<script>
import MarkdownIt from 'markdown-it';
import NavBar from "@/components/NavBar.vue";
import {mapState} from "vuex";
import common from "@/utils/common";

const md = new MarkdownIt({
  breaks: true,
  html: true
});

export default {
  name: "Session",
  components: {
    NavBar
  },
  data() {
    return {
      userInput: '',
      messages: [
        {text: 'Hi there! How can I help you today?', sender: 'bot'},
      ],

      // config
      loading: false
    }
  },
  computed: {
    ...mapState([
      "user"
    ]),
  },
  mounted() {

  },
  methods: {
    renderMarkdown(text) {
      return md.render(text);
    },

    sendMessage() {
      if (this.userInput.trim()) {
        this.loading = !this.loading
        this.messages.push({text: this.userInput, sender: 'user'});
        const query = this.userInput;
        this.userInput = '';

        this.chatLLM(query);
      }
    },
    chatLLM(query) {
      console.log("DDD")
      this.$api.chat.message({
        sessionId: common.generateUniqueCode(),
        query: query,
      })
        .then((res) => {
          this.loading = !this.loading
          this.messages.push({
            text: res.data,
            sender: 'bot',
          });
        })
        .catch((error) => {
          this.loading = !this.loading
          console.error('Error in chatLLM:', error);
          this.messages.push({
            text: 'Sorry, there was an error processing your request.',
            sender: 'bot',
          });
        });
    },
  },

}
</script>

<style>
li {
  display: list-item !important;
  margin-bottom: 18px !important;
}

.bg {
  background: radial-gradient(circle at center, rgba(223, 255, 0, 0.13) 0%, rgba(234, 255, 0, 0.07) 60%, #ffffff 100%);
}


.chat-window {
  padding-top: 10vh;
  height: 100vh;
  width: 60vw;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 44px;
}

.chat-title {
  font-size: 16px;
  font-weight: bold;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.loading {
  padding: 5px;
  font-size: 14px;
  color: #999999
}

.message {
  margin-bottom: 10px;
  display: flex;
}

.bot-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-content {
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.bot-message .message-content {
  color: #000;
  border-radius: 12px;
  padding: 3px 2px;
  max-width: 100%;
  font-size: 16px;
}

.user-message .message-content {
  background-color: rgba(55, 53, 47, 0.04);
  border-radius: 12px;
  padding: 4px 14px;
  max-width: 80%;
  font-size: 14px;
}

.chat-footer {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
