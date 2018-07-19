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

          <div v-else>
            <v-jumbotron v-if="loaded" dark :gradient="gardients [item.level]">
              <v-container fill-height>
                <v-layout align-center text-xs-center>
                  <v-flex>
                    <h3 class="ma-5 display-1" :class="{ copied }">{{item.text}}</h3>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-jumbotron>

            <v-card-actions>
              <v-btn flat @click="doLike (item.uuid)">
                <v-icon left>fa-arrow-up</v-icon>
                <span>{{item.rate.likes}} likes</span>
              </v-btn>
              <v-btn flat @click="doDislike (item.uuid)">
                <v-icon left>fa-arrow-down</v-icon>
                <span>{{item.rate.dislikes}} dislikes</span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="copyText">
                <v-icon>far fa-clone</v-icon>
              </v-btn>
            </v-card-actions>

            <div
              class="underline"
              :class="item.type"></div>
          </div>
        </v-card>

        <v-card class="pa-2">
          <v-layout row justify-center align-center>
            <v-flex sm3 xs4>
              <v-btn color="green" dark block round @click="getTruth">
                <span>VERDAD</span>
              </v-btn>
            </v-flex>

            <v-flex sm2 xs4 text-xs-center>
              <v-btn color="blue" dark fab @click="getRandom">
                <v-icon>fa-random</v-icon>
              </v-btn>
            </v-flex>

            <v-flex sm3 xs4>
              <v-btn color="red" dark block round @click="getDare">
                <span>RETO</span>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { transformItem, levelsGardients, rand } from '@/utils';
import { database, auth } from '@/services/firebase';

export default {
  methods: {
    doLike (uuid) {
      let count = this.item.rate.likes;
      database.ref (`cards/${uuid}/rate`).update ({
        likes:  ++count,
      });
    },
    doDislike (uuid) {
      let count = this.item.rate.dislikes;
      database.ref (`cards/${uuid}/rate`).update ({
        dislikes:  ++count,
      });
    },
    async copyText () {
      await this.$copyText (this.item.text);
      this.copied = true;
    },

    getItem () {
      if (typeof this.$route.params.uuid == 'undefined') {
        const items = Object.values (this.items).filter (i => i.level <= this.level);
        const uuid = items [ rand (0, items.length - 1) ].uuid;
        this.$router.push ({ path: `/cards/${uuid}` });
      }

      if (this.items) {
        this.item = this.items [ this.$route.params.uuid ];
      }
      this.copied = false;
    },
    getRandom () {
      const items = Object.values (this.items).filter (i => i.level <= this.level);
      const uuid = items [ rand (0, items.length - 1) ].uuid;
      this.$router.push ({ path: `/cards/${uuid}` });
      this.copied = false;
    },
    getTruth () {
      const items = Object.values (this.items).filter (i => i.type == 'truth').filter (i => i.level <= this.level);
      const uuid = items [ rand (0, items.length - 1) ].uuid;
      this.$router.push ({ path: `/cards/${uuid}` });
      this.copied = false;
    },
    getDare () {
      const items = Object.values (this.items).filter (i => i.type == 'dare').filter (i => i.level <= this.level);
      const uuid = items [ rand (0, items.length - 1) ].uuid;
      this.$router.push ({ path: `/cards/${uuid}` });
      this.copied = false;
    }
  },
  async mounted () {
    this.gardients = levelsGardients;

    auth.onAuthStateChanged ((user) => {
      this.auth.is = user ? true : false;
    });

    database.ref ('cards/').on ('value', results => {
      this.loaded = true;
      this.items = results.val ();
      this.getItem ();
    });
  },
  watch: {
    $route () {
      this.getItem ();
    },
    level (newLevel, oldLevel) {
      this.getRandom ();
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
      },
      copied: false,
      liked: false,
      loaded: false,
      items: {},
      item: null,
      gardients: [],
    }
  }
};
</script>

<style scoped>
.v-progress-circular {
  margin: 3rem;
}
.underline {
  display: block;
  height: 6px;
  widows: 100%;
  background: #9C27B0;
  transition: all .2s;
}
.underline.truth {
  background: #4CAF50
}
.underline.dare {
  background: #F44336
}
.copied {
  background: #9C27B0;
  transition: all .2s;
}

</style>