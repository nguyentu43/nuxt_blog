<template>
  <v-app>
    <v-content>
      <alert-container />
      <v-container fluid>
        <v-layout>
          <v-flex class="text-xs-right">
            <v-btn color="primary" :to="localePath({ name: 'auth-login' })">{{
              $t('text.btn.logIn')
            }}</v-btn>
            <v-btn
              color="green"
              dark
              :to="localePath({ name: 'auth-register' })"
              >{{ $t('text.btn.register') }}</v-btn
            >
            <v-menu offset-y>
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
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AlertContainer from '~/components/AlertContainer'
export default {
  components: { AlertContainer },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  }
}
</script>
<style scoped></style>
