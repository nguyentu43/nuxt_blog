<template>
  <v-card>
    <v-card-title class="indigo darken-2 white--text">
      <h3>{{ $t('text.comment.list') }}</h3>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        :label="$t('text.textField.search')"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :rows-per-page-items="[10, 20, 30]"
      :pagination.sync="pagination"
      :items="items"
      :headers="headers"
      :search="search"
      item-key="_id"
    >
      <template v-slot:items="props">
        <td>{{ props.item.content }}</td>
        <td v-if="props.item.user">{{ props.item.user | fullName }}</td>
        <td v-else>{{ $t('text.account.deleted') }}</td>
        <td>{{ props.item.post.title }}</td>
        <td>{{ props.item.updatedAt | dateFromNow }}</td>
        <td>
          <v-icon small @click="props.expanded = !props.expanded">chat</v-icon>
        </td>
      </template>
      <template v-slot:expand="{ item }">
        <v-container>
          <comment
            :postid="item.post._id"
            :sub="false"
            :link="`/api/back/comments`"
            :comment="getComment(item)"
            @reload="reloadComment(item)"
          />
        </v-container>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Comment from '@/components/Comment'

export default {
  layout: 'dashboard',
  components: { Comment },
  data() {
    return {
      items: [],
      search: '',
      headers: [
        { text: this.$t('text.comment.content'), value: 'content' },
        { text: this.$t('text.comment.user'), value: 'user' },
        { text: this.$t('text.comment.post'), value: 'post' },
        { text: this.$t('text.comment.createdAt'), value: 'createdAt' },
        { text: this.$t('text.comment.action'), value: 'name' }
      ],
      selected: [],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/back/comments').then(({ data }) => {
      return {
        items: data.comments
      }
    })
  },
  methods: {
    reloadComment(item) {
      let id = item._id
      if (item.parent) id = this.getComment(item)._id

      this.$axios.$get(`/api/back/comments/${id}`).then(({ data }) => {
        const index = this._.findIndex(this.items, v => v._id === id)
        Vue.set(this.items, index, data.comment)
      })
    },
    getComment(item) {
      if (item.parent) {
        return this.items.find(v => v._id === item.parent)
      } else return item
    }
  },
  head() {
    return {
      title: this.$t('head.comment')
    }
  }
}
</script>

<style></style>
