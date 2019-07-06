<template>
  <v-app>
    <v-container
      grid-list-md
      fluid
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          mt-3
        >
          <v-toolbar>
            <v-toolbar-items>
              <v-btn
                flat
                @click="microphone(true)"
                v-if="micro == false"
              >
                <v-icon dark>mic_none</v-icon>
              </v-btn>
              <v-btn
                flat
                @click="microphone(true)"
                v-if="micro == true"
              >
                <v-icon dark>mic</v-icon>
              </v-btn>
            </v-toolbar-items>

            <v-text-field
              single
              :aria-label="config.locale.strings.queryTitle"
              autocomplete="off"
              v-model="query"
              @keyup.enter="submit()"
              :placeholder="config.locale.strings.queryTitle"
              autofocus
              type="text"
            ></v-text-field>
            <v-toolbar-items>
              <v-btn
                flat
                @click="mute(true)"
                v-if="muted == false"
              >
                <v-icon dark>volume_up</v-icon>
              </v-btn>
              <v-btn
                flat
                @click="mute(false)"
                v-if="muted == true"
              >
                <v-icon dark>volume_off</v-icon>
              </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-btn
              round
              color="blue light-blue"
              dark
              @click="resetAgent()"
            >Reset agent</v-btn>
            <v-btn flat>
              <v-checkbox
                v-model="asrSwitch"
                :label="`Local ASR`"
                color="blue light-blue"
              ></v-checkbox>
            </v-btn>
            <v-btn flat>
              <v-checkbox
                v-model="debugSwitch"
                :label="`Debug mode`"
                color="blue light-blue"
              ></v-checkbox>
            </v-btn>
          </v-toolbar>

        </v-flex>

        <v-flex xs6>
          <v-container
            id="scroll-target"
            class="scroll-y"
          >
            <v-layout
              v-scroll:#scroll-target="onScroll"
              column
              style="height: 500px"
            >
              <chat :answers=answers>
              </chat>
              <a id="bottom"></a>

            </v-layout>
          </v-container>
        </v-flex>

        <v-flex
          xs3
          mt-3
        >
          <info-card
            v-if="answers.length > 0 "
            :filesList=answers[answers.length-1].answer.files
          >
          </info-card>
        </v-flex>

        <v-flex
          text-xs-left
          mt-3
        >
          <v-card v-if="answers.length > 0 && debugSwitch">
            <v-toolbar
              color="light-blue"
              dark
            >
              <v-toolbar-title>Debug</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container
              id="scroll-target"
              class="scroll-y"
            >

              <v-layout
                v-scroll:#scroll-target="onScroll2"
                column
                style="height: 500px"
              >
                <jsonTree
                  v-if="answers.length > 0 && debugSwitch"
                  :path="'res'"
                  :data=answers[answers.length-1].answer.parsed
                  highlightMouseoverNode
                >
                </jsonTree>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- Chat window -->
    <!-- Display Welcome Message -->
    <div v-if="answers.length == 0 && online == true">
      <h1 class="title mdc-typography--headline">
        <div class="material-icons up">arrow_upward</div>
        <br>
        <br>
        {{config.locale.strings.welcomeTitle}}

        <p class="mdc-typography--body2">{{config.locale.strings.welcomeDescription}}</p>
      </h1>
    </div>

    <!-- Display offline message -->
    <div v-if="answers.length == 0 && online == false">
      <h1 class="title mdc-typography--headline">
        <div class="material-icons up">cloud_off</div>
        <br>
        <br>
        {{config.locale.strings.offlineTitle}}

        <p class="mdc-typography--body2">{{config.locale.strings.offlineDescription}}</p>
      </h1>
    </div>
  </v-app>

</template>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto')
@import "App.sass"

</style>

<style>
.v-toolbar {
  border-radius: 10px;
}
</style>

<script>
// import { ApiAiClient } from 'api-ai-javascript'
import config from './../config'
import axios from 'axios'
import ChatWindow from './components/ChatWindow.vue'
import InfoCard from './components/InfoCard.vue'
import VueJsonPretty from 'vue-json-pretty'

// const client = new ApiAiClient({ accessToken: config.app.token }) // <- replace it with yours

export default {
  name: 'app',
  components: {
    chat: ChatWindow,
    infoCard: InfoCard,
    jsonTree: VueJsonPretty
  },
  data: () => {
    return {
      answers: [],
      debugSwitch: true,
      asrSwitch: false,
      query: '',
      speech: config.locale.strings.voiceTitle,
      micro: false,
      muted: config.app.muted,
      online: navigator.onLine,
      config
    }
  },
  watch: {
    answers: function (val) {
      setTimeout(() => {
        document.querySelector('#bottom').scrollIntoView({
          behavior: 'smooth'
        })
      }, 2) // if new answers arrive, wait for render and then smoothly scroll down to #bottom selector, used as anchor
    }
  },
  methods: {
    onScroll (e) {
      this.offsetTop = e.target.scrollDown
    },
    onScroll2 (e) {
      this.offsetTop = e.target.scrollDown
    },
    async submit () {
      await axios.get('http://127.0.0.1:5000/api/req?text=' + this.query).then(r => {
        let obj = {
          "query": this.query,
          "answer": r.data
        }
        this.answers.push(obj);
        this.handle(obj);
        this.query = '';
        this.speech = config.locale.strings.voiceTitle;
      })
      //   client.textRequest(this.query).then((response) => {
      //     if (response.result.action == "input.unknown" && this.config.app.googleIt == true) {
      //       response.result.fulfillment.messages[0].unknown = true
      //       response.result.fulfillment.messages[0].text = response.result.resolvedQuery
      //     } // if the googleIt is enabled, show the button
      //     console.log(response);
      //     this.answers.push(response)
      //     this.handle(response) // <- handle the response in handle() method

      //     this.query = ''
      //     this.speech = config.locale.strings.voiceTitle // <- reset query and speech
      //   })
    },
    handle (response) {
      if (response) {
        let speech = new SpeechSynthesisUtterance(response.answer.text)
        speech.voiceURI = 'native'
        speech.lang = config.locale.settings.speechLang

        if (this.muted == false) window.speechSynthesis.speak(speech) // <- Speech output if microphone is allowed
      }
    },
    autosubmit (suggestion) {
      this.query = suggestion
      this.submit()
    },
    mute (mode) {
      this.muted = mode
    },
    microphone (mode) {
      this.micro = mode
      let self = this // <- correct scope

      if (mode == true) {
        if (asrSwitch == false) {
          //Must replace with a call to the api 
          let recognition = new webkitSpeechRecognition() // <- chrome speech recognition

          recognition.interimResults = true
          recognition.lang = config.locale.settings.recognitionLang
          recognition.start()

          recognition.onresult = function (event) {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              self.speech = event.results[i][0].transcript
            }
          }

          recognition.onend = function () {
            recognition.stop()
            self.micro = false
            self.autosubmit(self.speech)
          }
        }

      }
    },
    resetAgent () {
      console.log('RESETTING AGENT ...');
    }
  }
}
</script>