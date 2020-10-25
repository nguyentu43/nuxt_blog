<template>
  <v-layout row wrap :class="{ 'pl-5': parent }">
    <template v-if="user">
      <v-flex xs3 sm2 md1 class="text-xs-center">
        <v-avatar size="70">
          <v-img :src="`/api/front/photo/${user._id}`"></v-img>
        </v-avatar>
      </v-flex>
      <v-flex xs9 sm10 md11>
        <v-layout wrap row>
          <v-flex xs12
            ><strong>{{ user | fullName }}</strong></v-flex
          >
          <v-flex xs12>
            <v-form ref="form" lazy-validation>
              <v-textarea
                v-model="comment.content"
                :placeholder="$t('text.textField.content')"
                required
                :rules="[v => !!v || $t('rules.content.required')]"
              ></v-textarea>
            </v-form>
          </v-flex>
          <v-flex xs12>
            <v-btn flat icon color="primary" @click="sendReply"
              ><v-icon small>send</v-icon></v-btn
            >
          </v-flex>
        </v-layout>
      </v-flex>
    </template>
    <v-flex v-else>
      <h3 class="py-2 text-xs-center">{{ $t('text.comment.logIn') }}</h3>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      required: true
    },
    postid: {
      type: String,
      required: true
    },
    parent: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      comment: {}
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    sendReply() {
      if (this.$refs.form.validate()) {
        this.comment.post = this.postid
        this.comment.user = this.user._id
        if (this.parent) this.comment.parent = this.parent
        this.$axios.$post(this.link, this.comment).then(({ status }) => {
          if (status === 'success') {
            this.comment = {}
            this.$store.dispatch('ADD_ALERT', {
              type: 'success',
              message: this.$t('message.success.create')
            })
            this.reply = false
            this.$emit('reload')
          }
        })
      }
    }
  }
}
</script>

<style></style>
