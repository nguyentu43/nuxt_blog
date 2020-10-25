<template>
  <v-card>
    <v-card-title class="deep-orange darken-4 white--text">
      <h3>
        {{
          isCreate
            ? $t('text.btn.create').toUpperCase()
            : $t('text.btn.update').toUpperCase()
        }}
        {{ $t('text.textField.account').toUpperCase() }}
      </h3>
    </v-card-title>
    <v-container>
      <v-form ref="form" lazy-validation>
        <v-layout row wrap>
          <v-flex xs6>
            <upload-photo ref="photo" :src="`/api/front/photo/${user._id}`" />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="user.email"
              label="E-mail"
              :rules="emailRules"
              :disabled="!isCreate"
              outline
            ></v-text-field>
            <v-text-field
              v-model="user.firstName"
              outline
              :label="$t('text.textField.firstName')"
              :rules="firstNameRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.lastName"
              outline
              :label="$t('text.textField.lastName')"
              :rules="lastNameRules"
              required
            ></v-text-field>
            <template
              v-if="
                !isCreate &&
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
            <template
              v-if="(!isCreate && user.providers.includes('email')) || isCreate"
            >
              <v-checkbox
                v-if="!isCreate"
                v-model="isChangePassword"
                :label="$t('text.textField.changePassword')"
              ></v-checkbox>
              <v-text-field
                v-if="isChangePassword || isCreate"
                v-model="user.password"
                :label="$t('text.textField.password')"
                type="password"
                :rules="passwordRules"
                outline
                required
              ></v-text-field>
            </template>
            <v-select
              v-model="user.role"
              outline
              :label="$t('text.account.role')"
              :rules="[v => !!v || $t('rules.role.required')]"
              :items="roles"
            ></v-select>
          </v-flex>
          <v-flex xs12>
            <v-btn color="green" dark :loading="loading" @click="save">{{
              isCreate ? $t('text.btn.create') : $t('text.btn.update')
            }}</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import UploadPhoto from '~/components/UploadPhoto'
export default {
  layout: 'dashboard',
  components: { UploadPhoto },
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      firstNameRules: [v => !!v || this.$t('rules.firstName.required')],
      lastNameRules: [v => !!v || this.$t('rules.lastName.required')],
      emailRules: [
        v => !!v || this.$t('rules.email.required'),
        v => /.+@.+\..+/g.test(v) || this.$t('rules.email.notValid')
      ],
      isChangePassword: false,
      passwordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ],
      loading: false,
      isCreate: false,
      roles: ['administrator', 'editor', 'author', 'contributor', 'subscriber']
    }
  },
  asyncData({ $axios, route }) {
    if (route.query.id) {
      return $axios
        .$get(`/api/back/users/${route.query.id}`)
        .then(({ data }) => ({ user: { ...data.user, password: '' } }))
    } else {
      return {
        isCreate: true
      }
    }
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = new FormData()
        data.append('firstName', this.user.firstName)
        data.append('lastName', this.user.lastName)
        data.append('role', this.user.role)
        const photo = this.$refs.photo.getPhoto()
        if (photo) data.append('photo', photo)
        if (this.isChangePassword || this.isCreate)
          data.append('password', this.user.password)
        if (this.isCreate) data.append('email', this.user.email)

        if (this.isCreate) {
          this.$axios
            .$post(`/api/back/users`, data, {
              'Content-Type': 'multipart/form-data'
            })
            .then(({ status, data }) => {
              if (status === 'success') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'success',
                  message: this.$t('message.success.create')
                })
                this.$router.replace('/dashboard/users')
              } else if (status === 'fail') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'warning',
                  message: this.$t('rules.email.duplicate')
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$axios
            .$patch(`/api/back/users/${this.user._id}`, data, {
              'Content-Type': 'multipart/form-data'
            })
            .then(({ status }) => {
              if (status === 'success') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'success',
                  message: this.$t('message.success.update')
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    }
  },
  head() {
    return {
      title: this.$t('head.duser.edit')
    }
  }
}
</script>

<style></style>
