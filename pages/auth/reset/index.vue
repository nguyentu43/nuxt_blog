<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
        <v-card>
          <v-card-title class="teal darken-2 white--text">
            <h3>{{ $t('text.btn.restorePassword') }}</h3>
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
                    v-model="email"
                    :label="$t('text.textField.email')"
                    type="email"
                    outline
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-btn
                    color="primary"
                    :loading="sendMailLoading"
                    @click="request"
                    >{{ $t('text.btn.send') }}</v-btn
                  >
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
      email: '',
      emailRules: [
        v => !!v || this.$t('rules.email.required'),
        v => /.+@.+\..+/g.test(v) || this.$t('rules.email.notValid')
      ],
      sendMailLoading: false,
      alert: {
        show: false,
        message: ''
      }
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
        this.sendMailLoading = true
        this.$axios
          .$post('/api/auth/reset', {
            email: this.email
          })
          .then(({ status, data }) => {
            this.alert = {
              show: true,
              message: this.$t('message.success.sendMailRestore'),
              type: 'success'
            }
          })
          .finally(() => {
            this.sendMailLoading = false
          })
      }
    }
  },
  head() {
    return {
      title: `${this.$t('head.reset')} | ${this.options.title}`,
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
