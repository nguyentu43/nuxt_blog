<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
        <v-card>
          <v-card-title class="teal darken-4 white--text">
            <h3>{{ $t('text.btn.resetPassword') }}</h3>
          </v-card-title>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs12>
                <v-alert
                  :type="alert.type || 'error'"
                  transition="scale-transition"
                  :value="alert.show"
                  >{{ alert.message }}</v-alert
                >
              </v-flex>
              <v-flex xs12>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    v-model="password"
                    :label="$t('text.textField.password')"
                    :rules="passwordRules"
                    :type="showPass1 ? 'text' : 'password'"
                    :append-icon="showPass1 ? 'visibility' : 'visibility_off'"
                    required
                    outline
                    @click:append="showPass1 = !showPass1"
                  ></v-text-field>
                  <v-text-field
                    v-model="rePassword"
                    :label="$t('text.textField.rePassword')"
                    :rules="rePasswordRules"
                    outline
                    :type="showPass2 ? 'text' : 'password'"
                    :append-icon="showPass2 ? 'visibility' : 'visibility_off'"
                    required
                    @click:append="showPass2 = !showPass2"
                  ></v-text-field>
                  <v-btn color="primary" :loading="loading" @click="request">{{
                    $t('text.btn.resetPassword')
                  }}</v-btn>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      password: '',
      rePassword: '',
      passwordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ],
      rePasswordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 }),
        v =>
          v === this.password ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ],
      loading: false,
      alert: {
        show: false,
        message: ''
      },
      showPass1: false,
      showPass2: false
    }
  },
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  methods: {
    request() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios
          .$post('/api/auth/reset/' + this.$route.params.key, {
            password: this.password
          })
          .then(({ status, data }) => {
            if (status === 'success') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'success',
                message: this.$t('message.success.update')
              })
              this.$router.replace({ name: 'auth' })
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  },
  head() {
    return {
      title: `${this.$t('head.resetKey')} | ${this.options.title}`,
      meta: [
        { name: 'description', content: this.options.description },
        { name: 'keywords', content: this.options.description },
        { property: 'og:url', content: this.options.hostname },
        { property: 'og:type', content: 'website' },
        { property: 'og:description', content: this.options.description },
        {
          property: 'og:image',
          content: `${this.options.hostname}/api/files/${this.options.icon}`
        },
        {
          property: 'og:title',
          content: this.options.title + +this.$route.fullPath
        },
        { property: 'og:site_name', content: this.options.title },
        { property: 'og:locale', content: this.$i18n.locale }
      ]
    }
  }
}
</script>

<style scoped></style>
