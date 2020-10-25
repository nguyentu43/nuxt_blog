<template>
  <v-container>
    <v-progress-linear
      v-if="loading"
      :indeterminate="loading"
    ></v-progress-linear>
    <comment
      v-for="comment in comments"
      :key="comment._id"
      :postid="postid"
      :link="link"
      :comment="comment"
      :sub="false"
      @reload="getComments"
    ></comment>
    <comment-reply :postid="postid" :link="link" @reload="getComments" />
  </v-container>
</template>

<script>
import Comment from './Comment'
import CommentReply from './CommentReply'

export default {
  components: { Comment, CommentReply },
  props: {
    postid: {
      type: String,
      required: true
    },
    postSlug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      loading: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    link() {
      return `/api/front/posts/${this.postSlug}/comments`
    }
  },
  mounted() {
    this.getComments()
  },
  methods: {
    getComments() {
      this.loading = true
      return this.$axios
        .$get(`/api/front/posts/${this.postSlug}/comments`)
        .then(({ data }) => {
          this.comments = data.comments
          this.loading = false
        })
    }
  }
}
</script>

<style></style>
