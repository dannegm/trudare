<template>
  <v-app>
    <v-toolbar
      app>
      <v-btn icon href="#/">
        <v-icon>home</v-icon>
      </v-btn>


      <v-badge v-if="auth.is && user.role == 'super'"
        right overlap color="purple">
        <v-icon slot="badge" dark size="10">fa-star</v-icon>
        <v-avatar size="32">
          <img
            :src="user.photoURL"
            alt="Avatar" >
        </v-avatar>
      </v-badge>

      <v-badge v-if="auth.is && user.role == 'moder'"
        right overlap color="grey darken-1">
        <v-icon slot="badge" dark size="10">fa-glasses</v-icon>
        <v-avatar size="32">
          <img
            :src="user.photoURL"
            alt="Avatar" >
        </v-avatar>
      </v-badge>

      <v-avatar
        v-if="auth.is && (user.role != 'super' && user.role != 'moder')"
        size="32">
        <img
          :src="user.photoURL"
          alt="Avatar" >
      </v-avatar>

      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu :nudge-width="100" transition="slide-x-transition">
        <v-btn :color="colors [level]" slot="activator" class="white--text">
          <span>{{levels [level]}}</span>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile
            v-for="(item, index) in levels"
            v-if="index > 0"
            active-class="primary"
            :color="level == index ? colors [index] : 'undefined'"
            @click="setLevel (index)">
            <v-list-tile-title>{{item}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-btn icon href="#/list">
        <v-icon>list</v-icon>
      </v-btn>
      <v-btn icon v-if="auth.is">
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn icon v-if="!auth.is" @click="requestLogin">
        <v-icon>person</v-icon>
      </v-btn>
      <v-btn icon v-if="auth.is" @click="requestOut">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { levels, levelsColors } from '@/utils';
import { firebase, database, auth } from '@/services/firebase';
const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider ();

export default {
  name: 'App',
  methods: {
    async requestLogin () {
      const AuthResult = await auth.signInWithPopup (GoogleAuthProvider);
    },
    async requestOut () {
      return await auth.signOut ();
    },
    setLevel (level) {
      this.level = level;
      this.$store.commit ('level', level);
    }
  },
  async mounted () {
    this.levels = levels;
    this.colors = levelsColors;
    this.$store.commit ('level', this.level);

    auth.onAuthStateChanged (user => {
      this.auth.is = user ? true : false;
      if (this.auth.is) {
        this.auth.uid = user.uid;
        database.ref (`users/${user.uid}`).once ('value', results => {
          if (!results.val ()) {
            this.user = {
              uid : user.uid,
              email: user.email,
              name: user.displayName,
              role: 'player',
              timestamp: (new Date).getTime (),
              photoURL: user.photoURL,
            };
            database.ref (`users/${user.uid}`).set (this.user);
          } else {
            this.user = results.val ();
          }
        });
      }
    });
  },
  data () {
    return {
      auth: {
        is: false,
        uid: null,
      },
      user: {},
      title: 'Truth or Dare',
      level: 3,
      levels: [],
      colors: [],
    }
  }
};
</script>
