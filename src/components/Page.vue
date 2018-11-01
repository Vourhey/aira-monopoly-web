<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height text-xs-center id="page">
        <v-layout row wrap column>
          <v-flex>
            <h1>{{ msg }}</h1>
          </v-flex>
          <v-flex align-center>
            <v-card>
            <div v-if="!showGameQrCode && !scanGameQrCode">
              <v-btn v-on:click="createNewGame">
                Create Game
              </v-btn>
            </div>
            <div v-if="showGameQrCode">
              <div style="margin: auto; width: 256px;">
                <qr-code v-bind:text="qrcodetext"></qr-code>
              </div>
              <div>
                <v-btn v-on:click="toNextPage">
                  Finish
                </v-btn>
              </div>
              <div>
                <v-list>
                  <v-list-tile
                    v-for="n in players">
                    <v-list-tile-content>
                      <v-list-tile-title  style="text-align: center;">{{n}}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </div>
            </div>
            <div>
              <v-btn v-on:click="joinGame" v-if="!showGameQrCode && !scanGameQrCode">
                Join
              </v-btn>
              <div v-if="scanGameQrCode">
                <qrcode-reader @decode="onDecode" :paused="paused"></qrcode-reader>
              </div>
            </div>
          </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Page',
  data () {
    return {
      msg: 'Welcome to Aira Monopoly',
      showGameQrCode: false,
      scanGameQrCode: false,
      gameId: 0,
      paused: true,
      players: []
    }
  },
  created: function() {
    // this.$mqtt.subscribe('game/' + this.gameId + '/player/joined')
  },
  computed: {
    qrcodetext: function () {
      return this.gameId.toString()
    }
  },
  mqtt: {
    'game/+/player/joined': function(data, topic) {
      var player = new TextDecoder('utf-8').decode(data)
      this.players.push(player)
    }
  },
  methods: {
    createNewGame: function(event) {
      console.log("Creating game...")
      fetch("http://localhost:5000/creategame")
      .then((data) => data.json())
      .then((myJson) => {
        console.log(myJson.gameId)
        this.$mqtt.subscribe('game/' + myJson.gameId + '/player/joined')
        this.gameId = myJson.gameId
        this.players.push(myJson.playerId)
        this.showGameQrCode = true
      })
    },
    joinGame: function(event) {
      this.scanGameQrCode = true
      this.paused = false
    },
    onDecode: function(decodedString) {
      // console.log(decodedString)
      this.paused = true
      this.scanGameQrCode = false

      fetch("http://localhost:5000/game/join/" + decodedString)
      .then((data) => data.json()) 
      .then((player) => {
        this.$router.push({name: 'FillName', params: {gameId: decodedString, playerId: player.playerId}})
      })
    },
    toNextPage: function(event) {
      this.$router.push({name: 'FillName', params: {gameId: this.gameId, playerId: this.players[0]}})
    }
  }
}
</script>
