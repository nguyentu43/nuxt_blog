<template>
  <v-card>
    <v-card-title class="indigo darken-4 white--text">
      <h3>
        {{
          isCreate
            ? $t('text.btn.create').toUpperCase()
            : $t('text.btn.update').toUpperCase()
        }}
        {{ $t('text.textField.tag').toUpperCase() }}
      </h3>
    </v-card-title>
    <v-container>
      <v-form ref="form" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              v-model="tag.name"
              :label="$t('text.tag.name')"
              :rules="nameRules"
              outline
            ></v-text-field>
            <v-text-field
              v-model="tag.slug"
              outline
              :label="$t('text.tag.slug')"
              disabled
            ></v-text-field>
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
export default {
  layout: 'dashboard',
  data() {
    return {
      tag: {
        name: '',
        slug: ''
      },
      nameRules: [v => !!v || this.$t('rule.tagName.required')],
      loading: false,
      isCreate: false
    }
  },
  asyncData({ $axios, route }) {
    if (route.query.id) {
      return $axios
        .$get(`/api/back/tags/${route.query.id}`)
        .then(({ data }) => ({ tag: { ...data.tag } }))
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

        if (this.isCreate) {
          this.$axios
            .$post(`/api/back/tags`, { name: this.tag.name })
            .then(({ status, data }) => {
              if (status === 'success') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'success',
                  message: this.$t('message.success.create')
                })
                this.$router.replace('/dashboard/tags')
              } else if (status === 'fail') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'warning',
                  message: this.$t('rules.tagName.duplicate')
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$axios
            .$patch(`/api/back/tags/${this.tag._id}`, { name: this.tag.name })
            .then(({ status }) => {
              if (status === 'success') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'success',
                  message: this.$t('message.success.update')
                })
              } else if (status === 'fail') {
                this.$store.dispatch('ADD_ALERT', {
                  type: 'warning',
                  message: this.$t('rules.tagName.duplicate')
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
      title: this.$t('head.dtag.edit')
    }
  }
}
</script>

<style></style>
