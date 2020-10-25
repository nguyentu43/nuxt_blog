<template>
  <v-container grid-list-lg>
    <v-subheader>
      <h2>{{ author | fullName }}</h2>
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
      loading: false,
      author: {}
    }
  },
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  asyncData({ $axios, params }) {
    return $axios.$get(`/api/front/users/${params.id}`).then(({ data }) => {
      const author = data.user
      return $axios
        .$get('/api/front/posts', {
          params: { sortBy: '-createdAt', exactUser: author._id }
        })
        .then(({ data }) => {
          this.$store.dispatch('GET_USER');
          return {
            posts: data.posts,
            author
          }
        })
    })
  },
  methods: {
    getMorePosts() {
      this.loading = true
      this.$axios
        .$get('/api/front/posts', {
          params: {
            sortBy: '-createdAt',
            exactUser: this.user._id,
            page: this.page
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
      title: `${this.$t('head.author')} - ${this.author.firstName} ${
        this.author.lastName
      } | ${this.options.title}`,
      meta: [
        {
          name: 'description',
          content:
            this.$t('head.user') +
            ' - ' +
            this.author.firstName +
            ' ' +
            this.author.lastName +
            ' ' +
            this.options.description
        },
        {
          name: 'keywords',
          content:
            this.$t('head.user') +
            ' - ' +
            this.author.firstName +
            ' ' +
            this.author.lastName
        },
        {
          property: 'og:url',
          content: this.options.hostname + this.$route.fullPath
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:description',
          content:
            this.$t('head.user') +
            ' - ' +
            this.author.firstName +
            ' ' +
            this.author.lastName +
            ' ' +
            this.options.description
        },
        {
          property: 'og:image',
          content: `${this.options.hostname}/api/front/photo/${this.author._id}`
        },
        {
          property: 'og:title',
          content: `${this.$t('head.author')} - ${this.author.firstName} ${
            this.author.lastName
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
