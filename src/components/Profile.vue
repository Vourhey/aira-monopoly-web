<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height text-xs-center id="page">
        <v-layout row wrap column>
          <v-card>
            <v-container fluid grid-list-md>
              <v-layout row wrap>
                <v-flex xs12>
                  <h1>{{ msg }}</h1>
                </v-flex>
                <v-flex xs6>
                  <qr-code v-bind:text="qrcodetext" style="margin: auto; width: 256px;"></qr-code>
                </v-flex>
                <v-flex xs6>
                  <h2>
                    Name: {{ nameOfUser }}
                  </h2>
                  <h2>
                    Balance: {{ myBalance }}
                  </h2>
                </v-flex>
                <v-flex xs12>
                  <template>
                  <v-dialog 
                    v-model="aboutToSend"
                    width="400">
                    <v-btn
                      slot="activator"
                      @click="launchQRReader">
                      Send
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
                                To: {{ toAddress }}
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
                  <v-btn v-on:click="getFromBank">
                    Get From Bank
                  </v-btn>
                  <v-btn v-on:click="sendToBank">
                    Send to Bank
                  </v-btn>
                  </template>
                </v-flex>
                <v-flex xs12>
                  <v-list >
                    <v-list-tile
                      v-for="tx in txs">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ tx }}
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>

          <div v-if="formAmount">
            <input type='text' v-model="amount">
            <button @click="amount = +amount + 0.1">
              +0.1
            </button>
            <button v-on:click="amount = +amount + 0.5">
              +0.5
            </button>
            <button v-on:click="amount = +amount + 1">
              +1
            </button>
            <button v-on:click="amount = +amount + 2">
              +2
            </button>
            <button v-on:click="amount = +amount + 5">
              +5
            </button>
            <button v-on:click="amount = +amount + 10">
              +10
            </button>
            <button v-on:click="amount = +amount + 50">
              +50
            </button>
            <button @click="approve">
              Ok
            </button>
          </div>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Profile',
  props: ['nameOfUser', 'gameId', 'playerId'],
  data () {
    return {
      msg: 'Welcome to Profile component',
      ddebug: true,
      aboutToSend: false,
      pausedQR: true,
      showQRReader: false,
      myBalance: 0,
      formAmount: false,
      toAddress: '',
      fromAddress: '',
      amount: 0,
      txs: [],
      rules: {
        amount: value => {return !isNaN(value)}
      }
    }  
  },
  created: function() {
    fetch('http://localhost:5000/game/balance/' + this.gameId + '/' + this.playerId)
    .then((data) => data.json())
    .then((myJson) => {
      this.myBalance = myJson.balance
      this.msg = "Welcome " + this.nameOfUser
    })
  },
  computed: {
    qrcodetext: function () {
      return this.playerId.toString()
    }
  },
  methods: {
    launchQRReader: function(event) {
      this.showQRReader = true
      this.pausedQR = false
    },
    onDecode: function(decodedString) {
      this.pausedQR = true
      this.showQRReader = false
      this.toAddress = decodedString
    },
    sendApproved: function(event) {
      this.aboutToSend = false
      this.showQRReader = false
      this.pausedQR = true
      this.fromAddress = this.playerId

      fetch('http://localhost:5000/game/send/'+ this.gameId + '/' + this.fromAddress + '/' + this.toAddress + '/' + this.amount)
      .then((data) => {
        fetch('http://localhost:5000/game/balance/' + this.gameId + '/' + this.playerId)
          .then((data) => data.json())
          .then((myJson) => {
            this.myBalance = myJson.balance
          })
      })
    },
    sendToBank: function(event) {
      this.formAmount = true
      this.toAddress = 0
      this.fromAddress = this.playerId
    },
    getFromBank: function(event) {
      this.formAmount = true
      this.toAddress = this.playerId
      this.fromAddress = 0
    },
    approve: function(event) {
      fetch('http://localhost:5000/game/send/' + this.gameId + '/' + this.fromAddress + '/' + this.toAddress + '/' + this.amount)
      .then((data) => {
        fetch('http://localhost:5000/game/balance/' + this.gameId + '/' + this.playerId)
          .then((data) => data.json())
          .then((myJson) => {
            this.myBalance = myJson.balance
          })
      })
    }
  }
}
</script>
