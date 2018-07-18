<template>
  <v-container grid-list-xl>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
      <v-flex md8 offset-md2 sm10 offset-sm1 xs12>

        <v-card>
          <div v-if="!loaded" class="text-xs-center">
            <v-progress-circular
              indeterminate
              color="primary"></v-progress-circular>
          </div>

          <v-list v-if="loaded" two-line>
            
          </v-list>
        </v-card>

      </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { database, auth } from '@/services/firebase';

export default {
  async mounted () {
    auth.onAuthStateChanged ((user) => {
      this.auth.is = user ? true : false;
    });

    database.ref ('actions/').on ('value', results => {
      this.loaded = true;
      this.items = Object.values (results.val ());
    });
  },
  data () {
    return {
      auth: {
        is: false,
      },
      loaded: false,
      items: [],
    }
  }
};
</script>