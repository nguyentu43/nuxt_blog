<template>
  <v-card>
    <v-card-title class="py-1">
      <v-chip
        v-for="tag in post.tags"
        :key="tag._id"
        color="green"
        small
        dark
        @click="
          $router.push(
            localePath({ name: 'tags-slug', params: { slug: tag.slug } })
          )
        "
        >{{ tag.name }}</v-chip
      >
    </v-card-title>
    <v-divider v-if="post.tags.length > 0" light></v-divider>
    <v-img
      v-if="post.photo"
      :src="`/api/files/${post.photo}`"
      aspect-ratio="1.5"
    ></v-img>
    <v-card-title class="py-0 px-0">
      <v-flex xs12 sm3>
        <v-btn
          fab
          flat
          icon
          :to="localePath({ name: 'users-id', params: { id: post.user._id } })"
        >
          <v-avatar>
            <v-img
              :src="`/api/front/photo/${post.user._id}`"
              alt="avatar"
            ></v-img>
          </v-avatar>
        </v-btn>
      </v-flex>
      <v-flex xs12 sm9>
        <strong>{{ post.user | fullName }}</strong
        ><br />
        <small>{{ post.createdAt | dateFromNow }}</small>
      </v-flex>
    </v-card-title>
    <v-divider light></v-divider>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ post.title }}</h3>
        <div
          v-html="
            post.excerpt && post.excerpt != ''
              ? post.excerpt
              : getExcerpt(post.content)
          "
        ></div>
      </div>
    </v-card-title>
    <v-divider light></v-divider>
    <v-card-actions>
      <v-btn
        :to="localePath({ name: 'slug', params: { slug: post.slug } })"
        color="primary"
        >{{ $t('text.btn.read') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import striptags from 'striptags'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    getExcerpt(content) {
      return striptags(content, null, ' ').substr(0, 150) + '...'
    }
  }
}
</script>

<style></style>
