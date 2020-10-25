<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn
        style="right: 80px"
        color="green"
        fixed
        right
        bottom
        fab
        dark
        v-on="on"
      >
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="green white--text">
        <h3>{{ $t('text.btn.update') }}</h3>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form ref="form" lazy-validation>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="post.title"
                  :label="$t('text.post.title')"
                  outline
                  :rules="[v => !!v || $t('rules.post.title')]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="post.excerpt"
                  :label="$t('text.post.excerpt')"
                  outline
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-if="user.role != 'contributor'"
                  v-model="post.status"
                  :items="statusList"
                  :label="$t('text.post.status')"
                  outline
                  :rules="[v => !!v || $t('rules.post.status')]"
                ></v-select>
              </v-flex>
              <v-flex v-if="post.status === 'future'" xs12 sm6>
                <v-text-field
                  v-model="post.schedule.open"
                  :label="$t('text.post.beginDate')"
                  outline
                  type="date"
                  :rules="[v => !!v || $t('rules.post.open')]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex v-if="post.status === 'future'" xs12 sm6>
                <v-text-field
                  v-model="post.schedule.close"
                  :label="$t('text.post.closeDate')"
                  outline
                  type="date"
                  :rules="[v => !!v || $t('rules.post.close')]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-if="post.status === 'private'"
                  v-model="post.password"
                  :label="$t('text.textField.password')"
                  outline
                  required
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  v-model="post.tags"
                  multiple
                  item-text="name"
                  item-value="_id"
                  chips
                  :items="tags"
                  :label="$t('text.textField.tag')"
                  outline
                  required
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="post.keyword"
                  :label="$t('text.post.keyword')"
                  outline
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                <v-avatar v-if="post.photo" size="200" tile>
                  <img :src="`/api/files/${post.photo}`" />
                </v-avatar>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                <photo-box
                  v-model="photoBoxDialog"
                  :fileid="post.photo"
                  @change="setPhoto"
                />
                <v-btn small color="primary" @click="photoBoxDialog = true">
                  <v-icon class="mr-1">insert_photo</v-icon>
                  {{ $t('text.btn.choosePhoto') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">{{
          $t('text.btn.close')
        }}</v-btn>
        <v-btn color="blue darken-1" flat @click="save">{{
          $t('text.btn.ok')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PhotoBox from './PhotoBox'
export default {
  components: { PhotoBox },
  props: {
    post: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        content: '',
        status: 'publish',
        schedule: { open: null, close: null },
        password: '',
        tags: [],
        meta: {},
        excerpt: '',
        keyword: ''
      })
    }
  },
  data() {
    return {
      dialog: false,
      showPassword: false,
      tags: [],
      prePost: {},
      photoBoxDialog: false,
      statusList: ['publish', 'private', 'pending', 'future', 'draft'],
      passwordRules: [
        v => !!v || this.$t('rules.password.required'),
        v =>
          (v && (v.length >= 6 && v.length <= 25)) ||
          this.$t('rules.password.length', { min: 6, max: 25 })
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  watch: {
    'post.status': function(value) {
      if (value === 'future') {
        this.post.schedule = {
          open: null,
          close: null
        }
      } else {
        this.post.schedule = null
      }
    }
  },
  created() {
    this.$axios.$get('/api/back/tags').then(({ data }) => {
      this.tags = data.tags
    })
  },
  mounted() {
    Object.assign(this.prePost, this.post)
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        Object.assign(this.prePost, this.post)
      }
    },
    close() {
      this.dialog = false
      Object.assign(this.post, this.prePost)
    },
    setPhoto(fileid) {
      this.post.photo = fileid
    }
  }
}
</script>

<style></style>
