<template>
  <v-dialog
    v-model="showApproveDialog"
    persistent
    width="400">

    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Approve XRT
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              A player {{ playerId }} asked {{ amount }} XRT from The Bank
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          @click="rejectApprove"
        >
          Reject
        </v-btn>
        <v-btn
          color="primary"
          @click="approveXRT"
        >
          Approve
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import * as config from '../config'

export default {
  name: 'Approve',
  props: ['showApproveDialog', 'playerId', 'gameId', 'amount'],
  data () {
    return {
    }
  },
  methods: {
    rejectApprove: function(event) {
      this.$mqtt.publish('game/' + this.gameId + '/player/approved', "0")

      this.$emit('done')
    },
    approveXRT: function(event) {
      this.$mqtt.publish('game/' + this.gameId + '/player/approved', "1")

      this.$emit('done')
    }
  }
}
</script>
