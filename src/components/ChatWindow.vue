
<template>
  <v-card v-if="answers.length > 0">
    <v-container
      grid-list-md
      text-xs-center
    >
      <v-layout
        column
        wrap
        v-if="answers.length > 0"
        v-for="(a,index) in answers"
      >
        <v-layout
          column
          wrap
          align-end
        >
          <v-flex xs6>
            <div class="chat">
              <div class="mine messages">
                <div class="message last">
                  {{a.query}}
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>
        <v-layout
          column
          wrap
          align-start
        >
          <v-flex xs6>
            <div class="yours messages">
              <div class="message last">
                {{a.answer.text}}
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
  </v-card>
</template>


<script>

export default {
  name: 'ChatWindow',
  props: {
    answers: {
      type: Array,
      default: []
    }
  }
}
</script>


<style>
.body {
  font-family: helvetica;
  font-size: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat {
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.messages {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}

.message {
  border-radius: 20px;
  padding: 8px 15px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: inline-block;
}

.yours {
  align-items: flex-start;
}

.yours .message {
  margin-right: 25%;
  background-color: #eee;
  position: relative;
}

.yours .message.last:before {
  content: "";
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: -7px;
  height: 20px;
  width: 20px;
  background: #eee;
  border-bottom-right-radius: 15px;
}
.yours .message.last:after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: -10px;
  width: 10px;
  height: 20px;
  background: white;
  border-bottom-right-radius: 10px;
}

.mine {
  align-items: flex-end;
}

.mine .message {
  color: white;
  margin-left: 25%;
  background: linear-gradient(to bottom, #00d0ea 0%, #0085d1 100%);
  background-attachment: fixed;
  position: relative;
}

.mine .message.last:before {
  content: "";
  position: absolute;
  z-index: 0;
  bottom: 0;
  right: -8px;
  height: 20px;
  width: 20px;
  background: linear-gradient(to bottom, #00d0ea 0%, #0085d1 100%);
  background-attachment: fixed;
  border-bottom-left-radius: 15px;
}

.mine .message.last:after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: -10px;
  width: 10px;
  height: 20px;
  background: white;
  border-bottom-left-radius: 10px;
}

.v-card {
  border-radius: 10px;
}
</style>