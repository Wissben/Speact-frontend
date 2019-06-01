<template>
  <main id="app">

    <v-container
      grid-list-md
      text-xs-center
    >
      <v-layout
        row
        wrap
      >
        <v-flex xs12>

          <!-- The input -->
          <div class="query">
            <div
              class="wrapper"
              v-if="micro == false"
            >
              <i
                class="material-icons iicon"
                @click="microphone(true)"
              >mic</i>
              <input
                :aria-label="config.locale.strings.queryTitle"
                autocomplete="off"
                v-model="query"
                class="queryform"
                @keyup.enter="submit()"
                :placeholder="config.locale.strings.queryTitle"
                autofocus
                type="text"
              >
              <i
                class="material-icons iicon t2s"
                @click="mute(true)"
                v-if="muted == false"
              >volume_up</i>
              <i
                class="material-icons iicon t2s"
                @click="mute(false)"
                v-else
              >volume_off</i>
            </div>
            <div
              class="wrapper"
              v-else
            >
              <i
                class="material-icons iicon recording"
                @click="microphone(false)"
              >mic</i><input
                class="queryform"
                :placeholder="speech"
                readonly
              >
            </div>
          </div>

        </v-flex>
        <section class="wrapper ai-window">

          <br>
          <br>

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

          <!-- Chat window -->
          <table
            v-for="a in answers"
            class="chat-window"
          >

            <!-- Your messages -->
            <tr>
              <td class="bubble">{{a.query}}</td>
            </tr>

            <!-- Dialogflow messages -->
            <tr>
              <td>

                <!-- Bot message types / Speech -->

                <div
                  v-if="a.answer"
                  class="bubble bot"
                >
                  {{a.answer.text}}
                </div>

                <!-- Google Assistant output -->
                <!-- <div v-for="r in a.result.fulfillment.messages"> -->

                <!-- Bot message types / Card -->

                <!-- <div
              class="mdc-card"
              v-if="r.type == 'basic_card'"
            >
              <img
                :title="r.image.accessibilityText"
                :alt="r.image.accessibilityText"
                class="mdc-card__media-item"
                :src="r.image.url"
                v-if="r.image"
              >
              <section class="mdc-card__primary">
                <h1 class="mdc-card__title">{{r.title}}</h1>
                <br>
                <h2 class="mdc-card__subtitle">{{r.subtitle}}</h2>
              </section>
              <section class="mdc-card__supporting-text">
                {{r.formattedText}}
              </section>
              <section
                class="mdc-card__actions"
                v-for="button in r.buttons"
              >
                <a
                  class="mdc-button mdc-button--compact themed mdc-card__action"
                  target="_blank"
                  :href="button.openUrlAction.url"
                >{{button.title}} <i class="material-icons openlink">open_in_new</i></a>
              </section>
            </div> -->

                <!-- Bot message types / Carousel Card -->

                <!-- Bot message types / List -->

                <!-- Bot message types / Link Chip -->

                <!-- Bot message types / Suggestion Chip -->

                <!-- Bot message types / Google Suggestion Chip -->

                <!-- </div> -->
              </td>
            </tr>
          </table>

          <br>
          <p
            class="copyright"
            v-if="answers.length > 0"
          >Proudly powered by <a href="https://ushakov.co">Ushakov</a> & <a href="https://dialogflow.com">Dialogflow</a></p>
          <a id="bottom"></a>
        </section>
        <v-flex xs6>

          <!-- File list display -->
        </v-flex>
        <v-list>
          <v-list-tile
            v-for="file in answers[answers.lentgth-1]"
            :key="file"
            avatar
            @click=""
          >
          </v-list-tile>
        </v-list>
        <v-flex xs6>

        </v-flex>
      </v-layout>
    </v-container>

  </main>
</template>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto')
@import "App.sass"
</style>

<script>
import { ApiAiClient } from 'api-ai-javascript'
import config from './../config'
import axios from 'axios'

const client = new ApiAiClient({ accessToken: config.app.token }) // <- replace it with yours

export default {
  name: 'app',
  data: function () {
    return {
      answers: [],
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
    submit () {
      axios.get('http://127.0.0.1:5000/api/req?text=' + this.query).then(r => {
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
  }
}
</script>