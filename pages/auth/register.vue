<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
        <v-card>
          <v-card-title class="blue darken-4 white--text">
            <h3>{{ $t('text.btn.register') }}</h3>
          </v-card-title>
          <v-container fluid grid-list-sm>
            <v-form ref="form" lazy-validation>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-alert
                    type="error"
                    transition="scale-transition"
                    :value="alert.show"
                    >{{ alert.message }}</v-alert
                  >
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="firstName"
                    outline
                    :label="$t('text.textField.firstName')"
                    :rules="firstNameRules"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="lastName"
                    outline
                    :label="$t('text.textField.lastName')"
                    :rules="lastNameRules"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="email"
                    :label="$t('text.textField.email')"
                    type="email"
                    :rules="emailRules"
                    outline
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :label="$t('text.textField.password')"
                    :rules="passwordRules"
                    :type="showPass1 ? 'text' : 'password'"
                    :append-icon="showPass1 ? 'visibility' : 'visibility_off'"
                    outline
                    required
                    @click:append="showPass1 = !showPass1"
                  ></v-text-field>
                  <v-text-field
                    v-model="rePassword"
                    :label="$t('text.textField.rePassword')"
                    :rules="rePasswordRules"
                    :type="showPass2 ? 'text' : 'password'"
                    :append-icon="showPass2 ? 'visibility' : 'visibility_off'"
                    outline
                    required
                    @click:append="showPass2 = !showPass2"
                  ></v-text-field>
                  <v-btn
                    color="green"
                    dark
                    :loading="loading"
                    @click="register"
                    >{{ $t('text.btn.register') }}</v-btn
                  >
                  <v-btn @click="reset">{{ $t('text.btn.delete') }}</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rePassword: '',
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
      rePasswordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 }),
        v =>
          v === this.password ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ],
      firstNameRules: [v => !!v || this.$t('rules.firstName.required')],
      lastNameRules: [v => !!v || this.$t('rules.lastName.required')],
      alert: {
        show: false,
        messages: []
      },
      loading: false,
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
    register() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios
          .$post('/api/auth/register', {
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName
          })
          .then(result => {
            if (result.status === 'success') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'success',
                message: this.$t('message.success.register')
              })
              this.$router.replace({ name: 'auth' })
            } else if (result.status === 'fail') {
              this.loading = false
              this.alert = {
                show: true,
                message: this.$t('rules.email.duplicate')
              }
            }
          })
      }
    },
    reset() {
      this.$refs.form.reset()
      this.$refs.form.resetValidation()
    }
  },
  head() {
    return {
      title: `${this.$t('head.register')} | ${this.options.title}`,
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

<style></style>
