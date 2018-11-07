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
                  <SendDialog 
                    to_address='x' 
                    v-bind:from_address="playerId" 
                    v-bind:game_id="gameId">
                    Send
                  </SendDialog>
                  <SendDialog 
                    v-bind:to_address="playerId" 
                    from_address="0x0" 
                    v-bind:game_id="gameId">
                    Get From Bank
                  </SendDialog>
                  <SendDialog 
                    to_address="0x0" 
                    v-bind:from_address="playerId" 
                    v-bind:game_id="gameId">
                    Send To Bank
                  </SendDialog>
                </v-flex>
                <v-flex xs12>
                  <v-list three-line>
                    <v-list-tile
                      v-for="tx in txs">
                      <v-list-tile-content>
                        <v-list-tile-title v-html="tx.txhash"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="tx.from + tx.to"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import SendDialog from './SendDialog'
import * as config from '../config'

export default {
  name: 'Profile',
  components: {
    SendDialog
  },
  props: ['nameOfUser', 'gameId', 'playerId'],
  data () {
    return {
      msg: '',
      myBalance: 0,
      askedFromBank: false,
      txs: []
    }  
  },
  created: function() {
    fetch(config.SERVER + 'game/balance/' + this.gameId + '/' + this.playerId)
    .then((data) => data.json())
    .then((myJson) => {
      this.myBalance = myJson.balance
      this.msg = "Welcome " + this.nameOfUser
    })

    this.$mqtt.subscribe('game/' + this.gameId + '/player/' + this.playerId)
    this.$mqtt.subscribe('game/' + this.gameId + '/txs/' + this.playerId)
    this.$mqtt.subscribe('game/' + this.gameId + '/player/getfrombank')
  },
  mqtt: {
    'game/+/player/+': function(data, topic) {
      this.myBalance = new TextDecoder('utf-8').decode(data)
    },
    'game/+/txs/+': function(data, topic) {
      var tx = new TextDecoder('utf-8').decode(data)
      this.txs.push(JSON.parse(tx))
    },
    'game/+/player/getfrombank': function(data, topic) {
      console.log("Asking for an approve")
      this.$mqtt.publish('game/' + this.gameId + '/player/approved', this.playerId)
    }
  },
  computed: {
    qrcodetext: function () {
      return this.playerId.toString()
    }
  },
  methods: {
    
  }
}
</script>
