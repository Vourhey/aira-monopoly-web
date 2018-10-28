<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <img src='../assets/logo.png' v-on:click="imageClick"/>
    <div v-if="ddebug">
      GameId is {{ gameId }}, playerId is {{ playerId }}
    </div>
    <div>
      Name: {{ nameOfUser }}
    </div>
    <div>
      Balance: {{ myBalance }}
    </div>

    <div>
      <button>
        Send
      </button>
      <button>
        Get From Bank
      </button>
      <button>
        Send to Bank
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  props: ['nameOfUser', 'gameId', 'playerId'],
  data () {
    return {
      msg: 'Welcome to Profile component',
      ddebug: true,
      myBalance: 0
    }  
  },
  created: function() {
    fetch('http://localhost:5000/game/balance/' + this.gameId + '/' + this.playerId)
    .then((data) => data.json())
    .then((myJson) => {
      this.myBalance = myJson.balance
    })
  },
  methods: {
    imageClick: function(event) {
      console.log("Hi from image!")
    }
  }
}
</script>
