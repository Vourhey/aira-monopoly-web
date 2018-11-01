<template>
  <v-dialog 
    v-model="aboutToSend"
    width="400">
    <v-btn
      slot="activator"
      @click="launchQRReader">
      <slot></slot>
    </v-btn>

    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Send XRT
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <qrcode-reader v-if="showQRReader" @decode="onDecode" :paused="pausedQR"></qrcode-reader>
              <p v-if="!showQRReader">
                To: {{ to_address }}
                From: {{ from_address }}
              </p>
              <v-text-field label="Amount" v-model="amount" suffix="XRT" :rules="[rules.amount]"/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="sendApproved"
        >
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: 'SendDialog',
  props: ['to_address', 'from_address', 'game_id'],
  data () {
    return {
      aboutToSend: false,
      pausedQR: true,
      showQRReader: false,
      amount: 0,
      rules: {
        amount: value => {return !isNaN(value)}
      }
    }  
  },
  methods: {
    launchQRReader: function(event) {
      console.log(this.to_address)
      if(this.to_address == 'x') {
        this.showQRReader = true
        this.pausedQR = false
      }
    },
    onDecode: function(decodedString) {
      this.pausedQR = true
      this.showQRReader = false
      this.to_address = decodedString
    },
    sendApproved: function(event) {
      this.aboutToSend = false
      this.showQRReader = false
      this.pausedQR = true

      fetch('http://osticket.corp.aira.life/server/game/send/'+ this.game_id + '/' + this.from_address + '/' + this.to_address + '/' + this.amount)
      .then((data) => {
        console.log(data)
      })
    }
  }
}
</script>
