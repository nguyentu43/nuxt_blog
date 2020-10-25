<template>
  <v-app>
    <v-content>
      <alert-container />
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import AlertContainer from '~/components/AlertContainer'
export default {
  components: { AlertContainer },
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.state.user
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
