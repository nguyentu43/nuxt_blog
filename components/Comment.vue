<template>
  <v-layout row wrap>
    <v-flex xs3 sm2 md1 class="text-xs-center">
      <v-avatar size="70">
        <v-img
          :src="`/api/front/photo/${comment.user ? comment.user._id : 1}`"
        ></v-img>
      </v-avatar>
    </v-flex>
    <v-flex xs9 sm10 md11>
      <v-form ref="form" lazy-validation>
        <v-layout wrap row>
          <v-flex v-if="comment.user" sm12>
            <strong>
              {{ comment.user | fullName }}
              <small>{{ comment.updatedAt | dateFromNow }}</small>
            </strong>
          </v-flex>
          <v-flex v-else xs12>
            <h4>
              {{ $t('text.user.deleted') }}
              <small>{{ comment.updatedAt | dateFromNow }}</small>
            </h4>
          </v-flex>
          <template v-if="edit">
            <v-textarea
              v-model="updateComment.content"
              required
              :rules="[v => !!v || 'required']"
            ></v-textarea>
            <v-flex v-if="checkPermission" sm12>
              <v-btn flat icon color="primary" @click="update">
                <v-icon small>send</v-icon>
              </v-btn>
              <v-btn flat icon color="primary" @click="edit = false">
                <v-icon small>close</v-icon>
              </v-btn>
            </v-flex>
          </template>
          <template v-else>
            <v-flex xs12>{{ comment.content }}</v-flex>
            <v-flex v-if="checkPermission" sm12>
              <v-btn flat icon color="primary" @click="replyComment">
                <v-icon small>textsms</v-icon>
              </v-btn>
              <v-btn flat icon color="green" @click="openEdit">
                <v-icon small>edit</v-icon>
              </v-btn>
              <template v-if="isAdmin">
                <v-btn
                  v-if="comment.status === 'publish'"
                  flat
                  icon
                  color="green"
                  @click="lockComment('lock')"
                >
                  <v-icon small>lock</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  flat
                  icon
                  color="green"
                  @click="lockComment('publish')"
                >
                  <v-icon small>lock_open</v-icon>
                </v-btn>
              </template>
              <v-btn flat icon color="red" @click="del">
                <v-icon small>delete</v-icon>
              </v-btn>
            </v-flex>
          </template>
        </v-layout>
      </v-form>
    </v-flex>
    <v-flex v-if="comment.children.length > 0" xs12>
      <v-layout
        v-for="subItem in comment.children"
        :key="subItem._id"
        row
        wrap
        class="pl-5"
      >
        <comment
          :postid="postid"
          :link="link"
          :comment="subItem"
          @reply="reply = true"
          @reload="$emit('reload')"
        />
      </v-layout>
    </v-flex>
    <v-flex v-if="!sub && reply" xs12>
      <comment-reply
        :link="link"
        :postid="postid"
        :parent="comment._id"
        @reload="$emit('reload')"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import CommentReply from './CommentReply'

export default {
  name: 'Comment',
  components: { CommentReply },
  props: {
    comment: {
      type: Object,
      required: true
    },
    sub: {
      type: Boolean,
      default: true
    },
    link: {
      type: String,
      required: true
    },
    postid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reply: false,
      edit: false,
      updateComment: {}
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    checkPermission() {
      if (!this.user) return false
      return this.isAdmin || this.user._id === this.comment.user._id
    },
    isAdmin() {
      return this.user && this.user.role === 'administrator'
    }
  },
  methods: {
    update() {
      if (!this.$refs.form.validate()) return

      this.$axios
        .$patch(`${this.link}/${this.comment._id}`, this.updateComment)
        .then(({ status }) => {
          if (status === 'success') {
            this.$store.dispatch('ADD_ALERT', {
              type: 'success',
              message: this.$t('message.success.update')
            })
            this.edit = false
            this.$emit('reload')
          } else {
            this.$store.dispatch('ADD_ALERT', {
              type: 'warning',
              message: this.$t('message.fail')
            })
            this.edit = false
            this.$emit('reload')
          }
        })
    },
    async del() {
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        this.$axios
          .$delete(`${this.link}/${this.comment._id}`)
          .then(({ status }) => {
            if (status === 'success') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'success',
                message: this.$t('message.success.delete')
              })
              this.$emit('reload', 'delete')
            }
          })
      }
    },
    openEdit() {
      this.edit = true
      this.updateComment = Object.assign({}, this.comment)
    },
    lockComment(status) {
      this.updateComment = Object.assign({}, this.comment)
      this.updateComment.status = status
      this.update()
    },
    replyComment() {
      if (this.sub) {
        this.$emit('reply')
      } else this.reply = true
    }
  }
}
</script>

<style></style>
