<template>
  <v-container>
    <v-layout id="user-info">
      <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
        <v-card>
          <v-card-title class="blue darken-4 white--text">
            <h3>{{ $t('text.btn.accountInfo') }}</h3>
          </v-card-title>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <v-form ref="form" lazy-validation>
                  <upload-photo
                    ref="photo"
                    :src="`/api/front/photo/${user._id}`"
                  />
                  <v-text-field
                    v-model="email"
                    outline
                    :label="$t('text.textField.email')"
                    disabled
                  ></v-text-field>
                  <v-text-field
                    v-model="firstName"
                    :label="$t('text.textField.firstName')"
                    :rules="firstNameRules"
                    required
                    outline
                  ></v-text-field>
                  <v-text-field
                    v-model="lastName"
                    :label="$t('text.textField.lastName')"
                    :rules="lastNameRules"
                    required
                    outline
                  ></v-text-field>
                  <template
                    v-if="
                      !(
                        user.providers.length === 1 &&
                        user.providers.includes('email')
                      )
                    "
                  >
                    <h4 class="mb-1">
                      {{ $t('text.linkAccount') }}
                      <img
                        v-for="p in user.providers"
                        :key="p"
                        class="mr-1"
                        width="40"
                        height="40"
                        :src="`~/assets/${p}.png`"
                      />
                    </h4>
                  </template>

                  <template v-if="user.providers.includes('email')">
                    <v-checkbox
                      v-model="isChangePassword"
                      :label="$t('text.textField.changePassword')"
                    ></v-checkbox>
                    <template v-if="isChangePassword">
                      <v-text-field
                        v-model="oldPassword"
                        :label="$t('text.textField.oldPassword')"
                        type="password"
                        :rules="oldPasswordRules"
                        required
                        outline
                      ></v-text-field>
                      <v-text-field
                        v-model="password"
                        :label="$t('text.textField.password')"
                        type="password"
                        :rules="passwordRules"
                        required
                        outline
                      ></v-text-field>
                      <v-text-field
                        v-model="rePassword"
                        :label="$t('text.textField.rePassword')"
                        type="password"
                        :rules="rePasswordRules"
                        required
                        outline
                      ></v-text-field>
                    </template>
                  </template>
                  <v-btn
                    color="green"
                    dark
                    :loading="loading"
                    @click="update"
                    >{{ $t('text.btn.update') }}</v-btn
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
import UploadPhoto from '~/components/UploadPhoto'
export default {
  components: { UploadPhoto },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      oldPassword: '',
      oldPasswordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ],
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
      firstNameRules: [v => !!v || this.$t('rules.firstName.required')],
      lastNameRules: [v => !!v || this.$t('rules.lastName.required')],
      alert: {
        show: false,
        messages: []
      },
      loading: false,
      isChangePassword: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    options() {
      return this.$store.state.options
    }
  },
  created() {
    this.firstName = this.user.firstName
    this.lastName = this.user.lastName
    this.email = this.user.email
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = new FormData()
        if (this.isChangePassword) {
          data.append('password', this.password)
          data.append('oldPassword', this.oldPassword)
        }
        data.append('firstName', this.firstName)
        data.append('lastName', this.lastName)

        const photoInput = this.$refs.photo.getPhoto()
        if (photoInput) data.append('photo', photoInput)

        this.$axios
          .$patch('/api/front/user', data, {
            'Content-Type': 'multipart/form-data'
          })
          .then(result => {
            if (result.status === 'success') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'success',
                message: this.$t('message.success.update'),
                timeout: 5000
              })
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
      title: `${this.$t('head.user')} | ${this.options.title}`,
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
          content: this.options.title + this.$route.fullPath
        },
        { property: 'og:site_name', content: this.options.title },
        { property: 'og:locale', content: this.$i18n.locale }
      ]
    }
  }
}
</script>

<style></style>
