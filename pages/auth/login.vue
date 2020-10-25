<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
        <v-card>
          <v-card-title class="blue darken-4 white--text">
            <h3>{{ $t('text.btn.logIn') }}</h3>
          </v-card-title>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs12>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    v-model="email"
                    :label="$t('text.textField.email')"
                    type="email"
                    :rules="emailRules"
                    required
                    outline
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :label="$t('text.textField.password')"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    required
                    :append-icon="
                      showPassword ? 'visibility' : 'visibility_off'
                    "
                    outline
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                  <v-checkbox
                    v-model="isRemember"
                    style="margin-top: 0px !important"
                    :label="$t('text.textField.remember')"
                  ></v-checkbox>
                  <v-btn
                    color="primary"
                    :loading="loginLoading"
                    @click="login"
                    >{{ $t('text.btn.logIn') }}</v-btn
                  >
                  <v-btn to="/auth/reset" @click="reset">
                    {{ $t('text.btn.forgotPassword') }}
                  </v-btn>
                  <v-btn @click="reset">{{ $t('text.btn.delete') }}</v-btn>
                </v-form>
              </v-flex>
              <v-flex xs12 mt-2>
                <v-divider></v-divider>
                <div>
                  <small>{{ $t('text.btn.logInProvider') }}</small>
                </div>
                <v-btn @click="logInWith('google')">
                  <img src="~assets/google.png" /> Google
                </v-btn>
                <v-btn @click="logInWith('facebook')">
                  <img src="~assets/facebook.png" /> Facebook
                </v-btn>
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
      isRemember: false,
      email: '',
      password: '',
      emailRules: [
        v => !!v || this.$t('rules.email.required'),
        v => /.+@.+\..+/g.test(v) || this.$t('rules.email.notValid')
      ],
      passwordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ],
      loginLoading: false,
      showPassword: false
    }
  },
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loginLoading = true
        this.$axios
          .$post('/api/auth/login', {
            email: this.email,
            password: this.password,
            remember: this.isRemember
          })
          .then(({ status, message }) => {
            if (status === 'success') {
              this.$store.dispatch('GET_USER').then(() => {
                this.$router.replace('/')
                this.$store.dispatch('ADD_ALERT', {
                  type: 'success',
                  message: this.$t('message.success.logIn'),
                  timeout: 5000
                })
              })
            } else if (status === 'fail') {
              this.loginLoading = false
              this.$store.dispatch('ADD_ALERT', {
                type: 'warning',
                message: this.$t('logIn.fail')
              })
            }
          })
          .catch(() => {
            this.loginLoading = false
          })
      }
    },
    reset() {
      this.$refs.form.reset()
      this.$refs.form.resetValidation()
    },
    logInWith(provider) {
      window.location.href = '/api/auth/' + provider
    }
  },
  head() {
    return {
      title: `${this.$t('head.login')} | ${this.options.title}`,
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

<style scoped>
img {
  width: 25px;
  margin-right: 5px;
}
</style>
