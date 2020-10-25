<template>
  <v-app>
    <alert-container />
    <v-toolbar color="primary" dark>
      <v-toolbar-side-icon @click="show = !show"></v-toolbar-side-icon>
      <v-toolbar-title>{{
        $t('text.btn.dashboard').toUpperCase()
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-text-field color="white" single-line prepend-icon="search" :placeholder="$t('text.textField.search')"></v-text-field> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              small
              fab
              icon
              :to="localePath({ name: 'index' })"
              color="green"
              dark
              v-on="on"
            >
              <v-icon>home</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('text.btn.home') }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn small fab icon color="error" v-on="on" @click="logOut">
              <v-icon>arrow_forward</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('text.btn.logOut') }}</span>
        </v-tooltip>
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn small color="orange" dark fab icon v-on="on">
              <v-icon>language</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="locale in availableLocales"
              :key="locale.code"
              :to="switchLocalePath(locale.code)"
            >
              <v-list-tile-title>{{ locale.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer
      stateless
      width="280"
      :value="show"
      dark
      touchless
      class="blue-grey darken-4"
    >
      <v-list>
        <v-list-tile v-if="user" :to="localePath({ name: 'auth-user' })">
          <v-list-tile-avatar>
            <v-avatar size="40">
              <v-img :src="`/api/front/photo/${user._id}`"></v-img>
            </v-avatar>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{
              `${user.firstName} ${user.lastName}`
            }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ user.role }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile
          exact
          active-class="white black--text"
          :to="localePath({ name: 'dashboard' })"
        >
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{
            $t('text.btn.dashboard')
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-group
          v-for="menu in menus"
          :key="menu.name"
          active-class="white--text"
          :prepend-icon="menu.icon"
        >
          <template #activator>
            <v-list-tile exact active-class="white black--text">
              <v-list-tile-content>{{ menu.title }}</v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile
            v-for="submenu in menu.submenus"
            :key="submenu.name"
            exact
            active-class="white black--text"
            :to="localePath(submenu.to)"
          >
            <v-list-tile-action>
              <v-icon>{{ submenu.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ submenu.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile
          exact
          :to="localePath({ name: 'dashboard-comments' })"
          active-class="white black--text"
        >
          <v-list-tile-action>
            <v-icon>comment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{
            $t('text.btn.comment')
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          exact
          :to="localePath({ name: 'dashboard-files' })"
          active-class="white black--text"
        >
          <v-list-tile-action>
            <v-icon>attachment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ $t('text.btn.file') }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          exact
          :to="localePath({ name: 'dashboard-settings' })"
          active-class="white black--text"
        >
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{
            $t('text.btn.setting')
          }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content :class="{ showNavDraw: show }">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AlertContainer from '~/components/AlertContainer'
export default {
  components: { AlertContainer },
  data() {
    return {
      show: true,
      menus: [
        {
          name: 'posts',
          title: this.$t('text.textField.post'),
          icon: 'class',
          submenus: [
            {
              name: 'edit',
              to: { name: 'dashboard-posts-edit' },
              icon: 'add_circle',
              title: this.$t('text.btn.create')
            },
            {
              name: 'list',
              to: { name: 'dashboard-posts' },
              icon: 'list',
              title: this.$t('text.btn.list')
            }
          ]
        },
        {
          name: 'tags',
          title: this.$t('text.textField.tag'),
          icon: 'local_offer',
          submenus: [
            {
              name: 'edit',
              to: { name: 'dashboard-tags-edit' },
              icon: 'add_circle',
              title: this.$t('text.btn.create')
            },
            {
              name: 'list',
              to: { name: 'dashboard-tags' },
              icon: 'list',
              title: this.$t('text.btn.list')
            }
          ]
        },
        {
          name: 'users',
          title: this.$t('text.textField.account'),
          icon: 'group',
          submenus: [
            {
              name: 'edit',
              to: { name: 'dashboard-users-edit' },
              icon: 'add_circle',
              title: this.$t('text.btn.create')
            },
            {
              name: 'list',
              to: { name: 'dashboard-users' },
              icon: 'list',
              title: this.$t('text.btn.list')
            }
          ]
        }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    availableLocales() {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  },
  methods: {
    logOut() {
      this.$axios.$get('/api/auth/logout').then(result => {
        if (result.status === 'success') {
          this.$store.commit('SET_USER', null)
          this.$router.replace('/')
        }
      })
    }
  }
}
</script>
<style scoped>
.v-navigation-drawer {
  top: 65px;
  position: absolute;
  height: calc(100vh - 65px) !important;
}

.v-toolbar {
  z-index: 4;
}

.v-content {
  position: absolute;
  width: 100vw;
  top: 65px;
  overflow-y: auto;
  height: calc(100vh - 65px) !important;
}

.v-content.showNavDraw {
  padding: 0 0 0 280px !important;
}

@media screen and (max-width: 900px) {
  .v-content,
  .v-navigation-drawer {
    top: 49px;
  }
}

@media screen and (max-width: 600px) {
  .v-content,
  .v-navigation-drawer {
    top: 57px;
  }
}

@media screen and (max-width: 400px) {
  .v-content.showNavDraw {
    display: none;
  }

  .v-navigation-drawer.v-navigation-drawer--open {
    width: 100vh !important;
  }
}
</style>
