<template>
  <v-container grid-list-lg>
    <v-subheader>
      <h2>{{ $t('text.post.newest') }}</h2>
    </v-subheader>
    <v-layout wrap>
      <v-flex v-for="post in topPosts" :key="post._id" xs6 sm4 md3>
        <post :post="post" />
      </v-flex>
    </v-layout>
    <v-subheader>
      <h2>{{ $t('text.textField.tag') }}</h2>
    </v-subheader>
    <v-layout wrap>
      <v-flex xs12>
        <v-btn
          v-for="tag in tags"
          :key="tag._id"
          :to="`/tags/${tag.slug}`"
          dark
          color="green"
        >
          <span>{{ tag.name }}</span>
          <v-chip small>{{ tag.postCount }}</v-chip>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Post from '@/components/Post'

export default {
  components: { Post },
  data() {
    return {
      topPosts: [],
      posts: [],
      page: 1,
      tags: []
    }
  },
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  asyncData({ $axios }) {
    return $axios
      .$get('/api/front/posts', { params: { sortBy: '-createdAt' } })
      .then(({ data }) => {
        return data.posts
      })
      .then(posts => {
        return $axios.$get('/api/front/tags').then(({ data }) => {
          return {
            topPosts: posts,
            tags: data.tags
          }
        })
      })
  },
  mounted() {
    this.getMorePosts()
  },
  methods: {
    getMorePosts() {
      this.$axios
        .$get('/api/front/posts', {
          query: { sortBy: '-createdAt', page: this.page }
        })
        .then(({ data }) => {
          this.page++
          this.posts.push(...data.posts)
        })
    }
  },
  head() {
    return {
      title: `${this.$t('head.home')} | ${this.options.title}`,
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
        { property: 'og:title', content: this.options.title },
        { property: 'og:site_name', content: this.options.title },
        { property: 'og:locale', content: this.$i18n.locale }
      ]
    }
  }
}
</script>

<style></style>
