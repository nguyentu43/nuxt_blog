<template>
  <v-card>
    <v-card-title class="red darken-2 white--text py-0">
      <h3>{{ $t('text.post.list') }}</h3>
      <v-spacer></v-spacer>
      <v-btn fab small icon color="primary" to="/dashboard/posts/edit">
        <v-icon>add</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-icon="search"
        :label="$t('text.textField.search')"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      select-all
      :rows-per-page-items="[10, 20, 30]"
      :pagination.sync="pagination"
      :items="items"
      :headers="headers"
      :search="search"
    >
      <template v-slot:items="props">
        <td>
          <v-checkbox
            v-model="props.item.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td>{{ props.item.title }}</td>
        <td>{{ props.item.status }}</td>
        <td v-if="props.item.user">{{ props.item.user | fullName }}</td>
        <td v-else>{{ $t('text.account.deleted') }}</td>
        <td>{{ props.item.createdAt | dateFromNow }}</td>
        <td>
          <v-icon
            small
            class="mr-2"
            @click="
              $router.push(
                localePath({ name: 'slug', params: { slug: props.item.slug } })
              )
            "
            >visibility</v-icon
          >
          <v-icon small class="mr-2" @click="edit(props.item)">edit</v-icon>
          <v-icon small @click="del(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
    <v-btn color="error" :loading="deleting" @click="deleteSelected">{{
      $t('text.btn.selectRemove')
    }}</v-btn>
  </v-card>
</template>

<script>
export default {
  layout: 'dashboard',
  data() {
    return {
      items: [],
      search: '',
      headers: [
        { text: this.$t('text.post.title'), value: 'title' },
        { text: this.$t('text.post.status'), value: 'status' },
        { text: this.$t('text.account.fullName'), value: 'user.lastName' },
        { text: this.$t('text.post.createdAt'), value: 'createdAt' },
        { text: this.$t('text.post.action'), value: 'title' }
      ],
      pagination: {
        rowsPerPage: 10
      },
      selected: [],
      deleting: false
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/back/posts').then(({ data }) => {
      return {
        items: data.posts
      }
    })
  },
  methods: {
    async del(item) {
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        const { status } = await this.$axios.$delete(
          `/api/back/posts/${item._id}`
        )
        if (status === 'success') {
          this.$store.dispatch('ADD_ALERT', {
            type: 'success',
            message: this.$t('message.success.delete')
          })
          this.items = this.items.filter(v => v._id !== item._id)
        }
      }
    },
    async deleteSelected() {
      let deleteUsers
      if (this.selected.length > 0) {
        deleteUsers = this.selected
      }
      deleteUsers = this.items.filter(v => v.selected === true)
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        this.deleting = true
        for (const item of deleteUsers) {
          await this.$axios.$delete(`/api/back/posts/${item._id}`)
          this.items = this.items.filter(v => v._id !== item._id)
        }
        this.deleting = false
        this.$store.dispatch('ADD_ALERT', {
          type: 'success',
          message: this.$t('message.success.delete')
        })
      }
    },
    edit(item) {
      this.$router.push(
        this.localePath({
          name: 'dashboard-posts-edit',
          query: { id: item._id }
        })
      )
    }
  },
  head() {
    return {
      title: this.$t('head.dpost.index')
    }
  }
}
</script>

<style></style>
