<template>
  <v-card>
    <v-card-title class="indigo darken-2 white--text py-0">
      <h3>{{ $t('text.tag.list') }}</h3>
      <v-spacer></v-spacer>
      <v-btn fab small to="/dashboard/tags/edit">
        <v-icon>add</v-icon>
      </v-btn>
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
      v-model="selected"
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
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.slug }}</td>
        <td>{{ props.item.postCount }}</td>
        <td>
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
        { text: this.$t('text.tag.name'), value: 'name' },
        { text: this.$t('text.tag.slug'), value: 'slug' },
        { text: this.$t('text.tag.postCount'), value: 'postCount' },
        { text: this.$t('text.tag.action'), value: 'name' }
      ],
      selected: [],
      pagination: {
        rowsPerPage: 10
      },
      deleting: false
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/back/tags').then(({ data }) => {
      return {
        items: data.tags
      }
    })
  },
  methods: {
    async del(item) {
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        const { status } = await this.$axios.$delete(
          `/api/back/tags/${item._id}`
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
          await this.$axios.$delete(`/api/back/tags/${item._id}`)
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
          name: 'dashboard-tags-edit',
          query: { id: item._id }
        })
      )
    }
  },
  head() {
    return {
      title: this.$t('head.dtag.index')
    }
  }
}
</script>

<style></style>
