<template>
  <div id="page">
    <h1>{{ msg }}</h1>
    <div v-if="!scanGameQrCode">
      <button v-on:click="createNewGame">
        Create Game
      </button>
    </div>
    <div v-if="!showGameQrCode">
      <button v-on:click="joinGame">
        Join
      </button>
    </div>

    <div v-if="showGameQrCode">
      <qr-code v-bind:text="qrcodetext"></qr-code>
      <button v-on:click="toNextPage">
        Finish
      </button>

      <ul>
        <li v-for="n in players">{{ n }}</li>
      </ul>
    </div>

    <div v-if="scanGameQrCode">
      <qrcode-reader @decode="onDecode" :paused="paused"></qrcode-reader>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Page',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      showGameQrCode: false,
      scanGameQrCode: false,
      qrcodetext: '',
      video: '',
      paused: true,
      myPlayer: 0,
      players: []
    }
  },
  methods: {
    createNewGame: function(event) {
      console.log("Creating game...")
      fetch("http://localhost:5000/creategame")
      .then((data) => data.json())
      .then((myJson) => {
        console.log(myJson.gameId)
        this.qrcodetext = myJson.gameId.toString()
        this.myPlayer = myJson.playerId
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
        console.log(player)
        this.players.push(player)
        this.$router.push({name: 'FillName', params: {gameId: decodedString, playerId: player}})
      })
    },
    toNextPage: function(event) {
      this.$router.push({name: 'FillName', params: {gameId: parseInt(this.qrcodetext, 10), playerId: this.myPlayer}})
    }
  }
}
</script>
