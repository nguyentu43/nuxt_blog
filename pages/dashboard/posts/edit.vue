<template>
  <div id="post-edit">
    <div
      v-quill:myQuillEditor="editorOptions"
      class="quill-editor"
      :content="post.content"
      @change="onEditorChange($event)"
    ></div>
    <PostInfoEdit :post="post" />
    <v-btn fixed right bottom fab color="red" dark @click="save">
      <v-icon>save</v-icon>
    </v-btn>
  </div>
</template>

<script>
import PostInfoEdit from '@/components/PostInfoEdit.vue'

export default {
  layout: 'edit',
  components: { PostInfoEdit },
  data() {
    return {
      post: {
        title: '',
        content: '',
        status: 'publish',
        schedule: { open: null, close: null },
        password: '',
        tags: [],
        meta: {},
        excerpt: '',
        keyword: ''
      },
      isCreated: true,
      editorOptions: {}
    }
  },
  asyncData({ $axios, route }) {
    if (route.query.id) {
      return $axios
        .$get(`/api/back/posts/${route.query.id}`)
        .then(({ data }) => {
          return {
            post: data.post,
            isCreated: false
          }
        })
    }
  },
  methods: {
    save() {
      if (this.isCreated) {
        this.$axios
          .$post('/api/back/posts', this.post)
          .then(({ data, status }) => {
            if (status === 'success') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'success',
                message: this.$t('message.success.create')
              })
              this.$router.replace(`/dashboard/posts/edit?id=${data.post._id}`)
            } else if (status === 'fail') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'warning',
                message: this.$t('message.fail')
              })
            }
          })
      } else {
        this.$axios
          .$patch(`/api/back/posts/${this.post._id}`, this.post)
          .then(() => {
            this.$store.dispatch('ADD_ALERT', {
              type: 'success',
              message: this.$t('message.success.update')
            })
          })
      }
    },
    onEditorChange({ editor, html, text }) {
      this.post.content = html
    }
  },
  head() {
    return {
      title: this.$t('head.duser.edit')
    }
  }
}
</script>

<style>
.quill-editor {
  height: 50vh;
}

.v-btn--floating.v-btn--fixed,
.v-btn--floating.v-btn--absolute {
  z-index: 999;
}
</style>
