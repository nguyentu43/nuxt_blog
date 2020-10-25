<template>
  <v-container>
    <v-layout wrap>
      <v-flex v-if="post.photo" xs12>
        <v-img id="featured-photo" :src="`/api/files/${post.photo}`"></v-img>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title v-if="post.status === 'private' && !post.content">
            <v-flex xs12 sm3 offset-sm4>
              <v-text-field
                v-model="password"
                name="password"
                :label="$t('text.textField.password')"
                type="password"
                single-line
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-btn @click="openContent">
                {{ $t('text.btn.open') }}
              </v-btn>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-4">
        <v-card>
          <v-card-title style="justify-content: center">
            <h1>{{ post.title }}</h1>
          </v-card-title>
          <v-card-text
            v-if="post.content"
            class="ql-editor"
            v-html="post.content"
          ></v-card-text>
          <v-card-title class="py-0">
            <v-subheader class="px-0">
              {{ $t('text.timeUpdate') }}
              {{ post.updatedAt | dateFromNow }}
            </v-subheader>
            <v-subheader v-if="post.tags.length > 0">
              {{ $t('text.textField.tag') }}
            </v-subheader>
            <v-btn
              v-for="tag in post.tags"
              :key="tag._id"
              color="green"
              dark
              round
              small
              @click="
                $router.push(
                  localePath({ name: 'tags-slug', params: { slug: tag.slug } })
                )
              "
              >{{ tag.name }}</v-btn
            >
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-4">
        <v-card
          :to="localePath({ name: 'users-id', params: { id: post.user._id } })"
        >
          <v-card-title style="justify-content:center">
            <v-avatar size="100">
              <v-img :src="`/api/front/photo/${post.user._id}`"></v-img>
            </v-avatar>
            <h2 class="ml-2">{{ post.user | fullName }}</h2>
          </v-card-title>
          <v-card-actions>
            <v-btn
              v-if="prevPost"
              outline
              color="primary"
              :to="`/${prevPost.slug}`"
            >
              <v-icon>chevron_left</v-icon>
              {{ prevPost.title }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="nextPost"
              outline
              color="primary"
              :to="`/${nextPost.slug}`"
            >
              {{ nextPost.title }}
              <v-icon>chevron_right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-4">
        <v-card>
          <comment-box :postid="post._id" :post-slug="post.slug" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Vue from 'vue'
import CommentBox from '@/components/CommentBox'

export default {
  components: { CommentBox },
  data() {
    return {
      post: {},
      nextPost: null,
      prevPost: null,
      password: ''
    }
  },
  computed: {
    options() {
      return this.$store.state.options
    }
  },
  asyncData({ $axios, params }) {
    return $axios.$get(`/api/front/posts/${params.slug}`).then(({ data }) => {
      return {
        post: data.post,
        nextPost: data.next,
        prevPost: data.prev
      }
    })
  },
  methods: {
    openContent() {
      this.$axios
        .$post(`/api/front/posts/${this.$route.params.slug}`, {
          password: this.password
        })
        .then(({ status, data }) => {
          if (status === 'fail') {
            this.$store.dispatch('ADD_ALERT', {
              type: 'warning',
              message: this.$t('rules.password.wrong')
            })
          } else {
            Vue.set(this.post, 'content', data.post.content)
          }
        })
    }
  },
  head() {
    return {
      title: `${this.$t('head.post')} - ${this.post.title} | ${
        this.options.title
      }`,
      meta: [
        {
          name: 'description',
          content:
            this.$t('head.post') +
            ' - ' +
            this.post.title +
            ' ' +
            this.options.description
        },
        {
          name: 'keywords',
          content: this.$t('head.post') + ' - ' + this.post.keyword
        },
        {
          property: 'og:url',
          content: this.options.hostname + this.$route.fullPath
        },
        { property: 'og:type', content: 'article' },
        {
          property: 'og:description',
          content: this.$t('head.post') + ' - ' + this.post.excerpt
        },
        {
          property: 'og:image',
          content: `${this.options.hostname}/api/files/${this.post.photo}`
        },
        {
          property: 'og:title',
          content: `${this.$t('head.post')} - ${this.post.title} | ${
            this.options.title
          }`
        },
        { property: 'og:site_name', content: this.options.title },
        { property: 'og:locale', content: this.$i18n.locale },
        { property: 'article:tag', content: this.post.keyword },
        {
          property: 'article:published_time',
          content: this.post.createdAt
        },
        { property: 'article:modified_time', content: this.post.updatedAt }
      ]
    }
  }
}
</script>
<style>
#featured-photo {
  max-height: 400px;
}
</style>
