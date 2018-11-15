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
                    v-bind:game_id="gameId"
                    v-on:asked="askedFromBank = true">
                    Get From Bank
                  </SendDialog>
                  <SendDialog
                    to_address="0x0"
                    v-bind:from_address="playerId"
                    v-bind:game_id="gameId">
                    Send To Bank
                  </SendDialog>
                  <Approve
                    v-bind:playerId="approveForPlayerId"
                    v-bind:gameId="gameId"
                    v-bind:amount="approveAmountXRT"
                    v-bind:showApproveDialog="showApproveDialog"
                    v-on:done="showApproveDialog = false"
                  ></Approve>
                </v-flex>
                <v-flex xs12>
                  <v-list three-line>
                    <v-list-tile
                      v-for="tx in txs"
                      :key="tx.txhash">
                      <v-list-tile-content>
                        <v-list-tile-title v-html="tx.txhash"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="tx.value + ': ' + tx.from + ' -> ' + tx.to"></v-list-tile-sub-title>
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
import Approve from './Approve.vue'

export default {
  name: 'Profile',
  components: {
    SendDialog,
    Approve
  },
  props: ['nameOfUser', 'gameId', 'playerId'],
  data () {
    return {
      msg: '',
      myBalance: 0,
      askedFromBank: false,
      showApproveDialog: false,
      approveForPlayerId: '',
      approveAmountXRT: 0,
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

    this.$mqtt.subscribe('game/' + this.gameId + '/balance/' + this.playerId)
    this.$mqtt.subscribe('game/' + this.gameId + '/txs/' + this.playerId)
    this.$mqtt.subscribe('game/' + this.gameId + '/player/getfrombank')
  },
  mqtt: {
    'game/+/balance/+': function(data, topic) {
      this.myBalance = new TextDecoder('utf-8').decode(data)
    },
    'game/+/txs/+': function(data, topic) {
      var tx = new TextDecoder('utf-8').decode(data)
      this.txs.push(JSON.parse(tx))
    },
    'game/+/player/getfrombank': function(data, topic) {
      if (!this.askedFromBank) {
        console.log("Asking for an approve")
        var data = new TextDecoder('utf-8').decode(data)
        var obj = JSON.parse(data)
        this.approveForPlayerId = obj.playerId
        this.approveAmountXRT = obj.amountXRT
        this.showApproveDialog = true
      }
      this.askedFromBank = false
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
