<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height text-xs-center id="page">
        <v-layout row wrap column>
          <v-flex>
            <h1>{{ msg }}</h1>
          </v-flex>
          <v-flex>
            <v-text-field 
              label="Your name" 
              v-model="nameFromInput" 
              @keyup.native.enter="toProfile" />
            <v-btn v-on:click="toProfile">
              Next
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'FillName',
  props: ['gameId', 'playerId'],
  data () {
    return {
      msg: 'Please fill your name',
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
