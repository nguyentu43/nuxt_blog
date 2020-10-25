<template>
  <v-container grid-list-lg>
    <v-subheader>
      <h2>{{ $t('text.searchKeyword', { keyword: $route.query.keyword }) }}</h2>
    </v-subheader>
    <v-layout wrap>
      <v-flex v-for="post in posts" :key="post._id" xs6 sm4 md3>
        <post :post="post" />
      </v-flex>
      <v-flex v-if="posts.length === 0">
        <h2 class="py-2 text-xs-center">
          {{ $t('text.textField.searchNotFound') }}
        </h2>
      </v-flex>
      <v-flex v-if="posts.length > 0" xs12 class="text-xs-center">
        <v-btn round :loading="loading" @click="getMorePosts">{{
          $t('text.btn.readMore')
        }}</v-btn>
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
      posts: [],
      page: 2,
      loading: false
    }
  },
  watchQuery: true,
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  asyncData({ $axios, query }) {
    return $axios
      .$get('/api/front/posts', {
        params: { sortBy: '-createdAt', keyword: query.keyword }
      })
      .then(({ data }) => {
        return {
          posts: data.posts
        }
      })
  },
  methods: {
    getMorePosts() {
      this.loading = true
      this.$axios
        .$get('/api/front/posts', {
          params: {
            sortBy: '-createdAt',
            page: this.page,
            keyword: this.$route.query.keyword
          }
        })
        .then(({ data }) => {
          this.page++
          this.posts.push(...data.posts)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  head() {
    return {
      title: `${this.$t('head.search')} - ${this.$route.query.keyword} | ${
        this.options.title
      }`,
      meta: [
        {
          name: 'description',
          content: `${this.$t('head.search')} ${this.$route.query.keyword}`
        },
        { name: 'keywords', content: this.$route.query.keyword },
        {
          property: 'og:url',
          content: this.options.hostname + this.$route.fullPath
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:description', content: this.options.description },
        {
          property: 'og:image',
          content: `${this.options.hostname}/api/files/${this.options.icon}`
        },
        {
          property: 'og:title',
          content: `${this.$t('head.search')} - ${
            this.$route.query.keyword
          } | ${this.options.title}`
        },
        { property: 'og:site_name', content: this.options.title },
        { property: 'og:locale', content: this.$i18n.locale }
      ]
    }
  }
}
</script>

<style></style>
