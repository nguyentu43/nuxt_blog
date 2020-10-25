<template>
  <v-container grid-list-lg>
    <v-subheader>
      <h2>{{ tag.name }}</h2>
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
      tag: {}
    }
  },
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  asyncData({ $axios, params }) {
    return $axios
      .$get(`/api/front/tags/${params.slug}`)
      .then(({ data }) => {
        return data.tag
      })
      .then(tag => {
        return $axios
          .$get('/api/front/posts', {
            params: { sortBy: '-createdAt', exactTag: tag._id }
          })
          .then(({ data }) => {
            return {
              posts: data.posts,
              tag
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
            exactTag: this.tag._id,
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
      title: `${this.$t('head.tag')} - ${this.$route.params.slug} | ${
        this.options.title
      }`,
      meta: [
        {
          name: 'description',
          content:
            this.$t('head.tag') +
            ' - ' +
            this.$route.params.slug +
            ' ' +
            this.options.description
        },
        {
          name: 'keywords',
          content: this.$t('head.tag') + ' - ' + this.$route.params.slug
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
            this.$route.params.slug +
            this.options.description
        },
        {
          property: 'og:image',
          content: `${this.options.hostname}/api/files/${this.options.icon}`
        },
        {
          property: 'og:title',
          content: `${this.$t('head.tag')} - ${this.$route.params.slug} | ${
            this.options.title
          }`
        },
        { property: 'og:site_name', content: this.options.title },
        { property: 'og:locale', content: this.$i18n.locale }
      ]
    }
  }
}
</script>

<style></style>
