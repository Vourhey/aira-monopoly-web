<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <input id='user_name' type='text' v-model="nameFromInput" /> 
    <br>
    <button v-on:click="toProfile">
        Next
    </button>

  </div>
</template>

<script>
export default {
  name: 'FillName',
  props: ['gameId', 'playerId'],
  data () {
    return {
      msg: 'Welcome to FillName component',
      nameFromInput: ''
    }
  },
  methods: {
    toProfile: function(event) {
        this.$router.push({name: 'Profile', params: {nameOfUser: this.nameFromInput, gameId: this.gameId, playerId: this.playerId}})
    }
  }
}
</script>
