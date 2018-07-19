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
            <template v-for="(item, index) in filtered">
              <v-list-tile avatar>
                <div class="line" :class="colors [item.level]"></div>

                <v-list-tile-avatar
                  v-if="item.type == 'truth'"
                  color="green">
                  <v-icon dark>far fa-surprise</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-avatar
                  v-else
                  color="red">
                  <v-icon dark>far fa-laugh-wink</v-icon>
                </v-list-tile-avatar>
  
                <v-list-tile-content>
                  <v-list-tile-title>{{item.title}}</v-list-tile-title>
                  <v-list-tile-sub-title>LVL: {{item.levelTxt}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-list-tile-action-text>{{item.time}}</v-list-tile-action-text>
                  <v-btn icon v-if="auth.is && user.role == 'super'">
                    <v-icon color="grey lighten-1" small>fa-pen</v-icon>
                  </v-btn>
                </v-list-tile-action>

              </v-list-tile>
              <v-divider v-if="index + 1 < filtered.length"></v-divider>
            </template>
          </v-list>
        </v-card>

      </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { database, auth } from '@/services/firebase';
import { transformItem, levelsColors } from '@/utils';

export default {
  async mounted () {
    this.colors = levelsColors;
    auth.onAuthStateChanged ((user) => {
      this.auth.is = user ? true : false;
      if (this.auth.is) {
        this.auth.uid = user.uid;
        database.ref (`users/${user.uid}`).once ('value', results => {
          this.user = results.val ();
        });
      }
    });

    database.ref ('cards/').on ('value', results => {
      this.loaded = true;
      this.items = Object.values (results.val ()).map (i => transformItem (i));
      this.filtered = this.items.filter (i => i.level <= this.level);
    });
  },
  watch: {
    level (newLevel, oldLevel) {
      this.filtered = this.items.filter (i => i.level <= newLevel);
    },
  },
  computed: {
    level () {
      return this.$store.state.level;
    }
  },
  data () {
    return {
      auth: {
        is: false,
        uid: null,
      },
      user: {},
      loaded: false,
      items: [],
      filtered: [],
      colors: []
    }
  }
};
</script>

<style scoped>
.v-progress-circular {
  margin: 3rem;
}
.line {
  height: 100%;
  width: 6px;
  margin-left: -1em;
  position: absolute;
}
</style>