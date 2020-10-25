<template>
  <v-app>
    <alert-container />
    <v-content>
      <v-container id="header" fluid>
        <v-layout wrap align-center class="px-4 header white--text elevation-3">
          <v-flex>
            <v-btn outline dark :to="localePath({ name: 'index' })">
              <h1 class="display-1">{{ options.title.toUpperCase() }}</h1>
            </v-btn>
          </v-flex>
          <v-flex class="hidden-xs-only">
            <v-text-field
              v-model="search"
              dark
              prepend-icon="search"
              single-line
              :label="$t('text.textField.search')"
              @keydown.enter="
                $router.push(
                  localePath({ name: 'search', query: { keyword: search } })
                )
              "
            ></v-text-field>
          </v-flex>
          <v-flex class="text-xs-right hidden-md-and-up">
            <v-menu offset-y>
              <template #activator="{ on }">
                <v-btn fab small v-on="on">
                  <v-icon>menu</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-tile class="pt-1 hidden-sm-only">
                  <v-text-field
                    v-model="search"
                    prepend-icon="search"
                    single-line
                    :label="$t('text.textField.search')"
                    @click.stop=""
                    @keydown.enter="
                      $router.push(
                        localePath({
                          name: 'search',
                          query: { keyword: search }
                        })
                      )
                    "
                  ></v-text-field>
                </v-list-tile>

                <template v-if="user">
                  <v-list-tile :to="localePath({ name: 'auth-user' })">
                    <v-list-tile-action>
                      <v-avatar size="40">
                        <v-img
                          :src="`/api/front/photo/${user._id}`"
                          alt="avatar"
                        ></v-img>
                      </v-avatar>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      {{ $t('text.btn.accountInfo') }}
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile :to="localePath({ name: 'dashboard' })">
                    <v-list-tile-action>
                      <v-icon>dashboard</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      {{ $t('text.btn.dashboard') }}
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile @click="logOut">
                    <v-list-tile-action>
                      <v-icon>arrow_forward</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{
                      $t('text.btn.logOut')
                    }}</v-list-tile-title>
                  </v-list-tile>
                </template>

                <template v-else>
                  <v-list-tile :to="localePath({ name: 'auth-login' })">
                    <v-list-tile-action>
                      <v-icon>vpn_key</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{
                      $t('text.btn.logIn')
                    }}</v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile :to="localePath({ name: 'auth-register' })">
                    <v-list-tile-action>
                      <v-icon>how_to_reg</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{
                      $t('text.btn.register')
                    }}</v-list-tile-title>
                  </v-list-tile>
                </template>

                <v-list-tile
                  v-for="locale in availableLocales"
                  :key="locale.code"
                  :to="switchLocalePath(locale.code)"
                >
                  <v-list-tile-action>
                    <v-icon>language</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>{{ locale.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
          <v-flex class="text-md-right hidden-sm-and-down">
            <template v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="user.role !== 'subscriber'"
                    small
                    fab
                    dark
                    color="primary"
                    icon
                    :to="localePath({ name: 'dashboard' })"
                    v-on="on"
                  >
                    <v-icon>dashboard</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('text.btn.dashboard') }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    :to="localePath({ name: 'auth-user' })"
                    fab
                    icon
                    v-on="on"
                  >
                    <v-avatar size="40">
                      <v-img
                        :src="`/api/front/photo/${user._id}`"
                        alt="avatar"
                      ></v-img>
                    </v-avatar>
                  </v-btn>
                </template>
                <span>{{ $t('text.btn.accountInfo') }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small fab icon color="error" v-on="on" @click="logOut">
                    <v-icon>arrow_forward</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('text.btn.logOut') }}</span>
              </v-tooltip>
            </template>
            <template v-else>
              <v-btn color="primary" :to="localePath({ name: 'auth-login' })">
                {{ $t('text.btn.logIn') }}
              </v-btn>
              <v-btn
                color="green"
                dark
                :to="localePath({ name: 'auth-register' })"
                >{{ $t('text.btn.register') }}</v-btn
              >
            </template>
            <v-menu v-if="user" offset-y>
              <template #activator="{ on }">
                <v-btn color="orange" fab icon small dark v-on="on">
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
            <v-menu v-else offset-y>
              <template #activator="{ on }">
                <v-btn color="orange" dark v-on="on">
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
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-parallax :src="`/api/files/${options.bgHeader}`"></v-parallax>
          </v-flex>
        </v-layout>
        <v-layout id="menu" wrap>
          <v-toolbar color="primary" dark>
            <v-toolbar-items>
              <v-menu
                v-for="item in options.menu"
                :key="item.id"
                :open-on-click="false"
                :open-on-hover="true"
                offset-y
              >
                <template #activator="{ on }">
                  <v-btn flat :to="localePath({ name: item.link })" v-on="on">
                    <v-icon v-if="item.icon" class="mr-1">
                      {{ item.icon }}
                    </v-icon>
                    {{ item.name.toUpperCase() }}
                  </v-btn>
                </template>
                <v-list v-if="item.children.length > 0">
                  <v-list-tile
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    :to="localePath({ name: subItem.link })"
                  >
                    <v-list-tile-avatar>
                      <v-icon v-if="subItem.icon">{{ subItem.icon }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-title>
                      {{ subItem.name.toUpperCase() }}
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-layout>
      </v-container>
      <nuxt id="main" />
    </v-content>
    <v-footer class="blue darken-3 white--text" height="auto">
      <v-container fill-height>
        <v-layout row wrap>
          <v-flex xs6 sm3 class="text-xs-center px-4">
            <v-img :src="`/api/files/${options.icon}`"></v-img>
          </v-flex>
          <v-flex xs12 sm9>{{ options.description }}</v-flex>
          <v-flex xs12>
            <div class="text-xs-center">
              {{ options.title }} ({{ new Date().getFullYear() }})
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import AlertContainer from '~/components/AlertContainer'
import { mapState } from 'vuex'
export default {
  components: { AlertContainer },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState(['user', 'options']),
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
.v-content {
  background: transparent;
  z-index: 0;
}

.header {
  background: rgba(255, 255, 255, 0.4);
}

#menu {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 50vh;
}

.v-parallax {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  height: 50vh !important;
}

#main {
  margin-top: 45vh;
}

@media screen and (max-width: 900px) {
  #main {
    margin-top: 48vh;
  }
}

@media screen and (max-width: 600px) {
  #main {
    margin-top: 50vh;
  }
}
</style>
