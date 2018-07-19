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

            <template v-for="(item, index) in Object.values (items).filter (i => !i.updated)">

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
                  <v-btn icon v-if="auth.is" @click="restore (item.uuid)">
                    <v-icon color="grey lighten-1" small>fa-angle-double-up</v-icon>
                  </v-btn>
                </v-list-tile-action>

              </v-list-tile>
              <v-divider v-if="index + 1 < Object.values (items).filter (i => !i.updated).length"></v-divider>
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
  methods: {
    async restore (uuid) {
      await database.ref (`cards/${uuid}`).once ('value', async (results) => {
        if (!results.val ()) {
          const { appear_factor, author_id, ...item } = this.originalItems [uuid];
          const copy = {
            ...item,
            uuid : uuid,
            author_uid: this.auth.uid,
            timestamp: (new Date).getTime (),
            status: 'waiting',
          };
          await database.ref (`cards/${uuid}`).set (copy);
          this.items [uuid].updated = true;
          this.buildItems (Object.values (this.items));
        } else {
          this.items [uuid].updated = true;
          this.buildItems (Object.values (this.items));
        }
      });
    },
    buildItems (items) {
      this.items = {};
      items.map (i => {
        if (this.loaded) {
          return i;
        } else {
          return { ...i, updated: false };
        }
      }).forEach (i => {
        this.items [i.uuid] = i;
      });
    }
  },
  async mounted () {
    this.colors = levelsColors;
    auth.onAuthStateChanged ((user) => {
      this.auth.is = user ? true : false;

      if (this.auth.is) {
        this.auth.uid = user.uid;
        this.auth.name = user.displayName;
        this.auth.email = user.email;
        this.auth.photoURL = user.photoURL;
      }
    });

    database.ref ('actions/').on ('value', results => {
      this.originalItems = results.val ();
      this.buildItems (
        Object.values (results.val ())
          .map (i => transformItem (i))
      );
      this.loaded = true;
    });
  },
  data () {
    return {
      auth: {
        is: false,
        uid: null,
        name: null,
        email: null,
        photoURL: null,
      },
      loaded: false,
      items: {},
      originalItems: {},
      colors: [],
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