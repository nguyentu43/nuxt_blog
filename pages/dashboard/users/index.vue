<template>
  <v-card>
    <v-card-title class="deep-orange darken-2 white--text py-0">
      <h3>{{ $t('text.account.list') }}</h3>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        color="primary"
        :to="localePath({ name: 'dashboard-users-edit' })"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-icon="search"
        single-line
        hide-details
        :label="$t('text.textField.search')"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :rows-per-page-items="[10, 20, 30]"
      :pagination.sync="pagination"
      select-all
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
        <td>
          <v-avatar size="40">
            <v-img :src="`/api/front/photo/${props.item._id}`"></v-img>
          </v-avatar>
        </td>
        <td>{{ props.item.firstName }}</td>
        <td>{{ props.item.lastName }}</td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.role }}</td>
        <td>{{ props.item.createdAt | dateFromNow }}</td>
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
        {
          text: this.$t('text.account.photo'),
          value: 'email',
          sortable: false
        },
        { text: this.$t('text.account.firstName'), value: 'firstName' },
        { text: this.$t('text.account.lastName'), value: 'lastName' },
        { text: this.$t('text.account.email'), value: 'email' },
        { text: this.$t('text.account.role'), value: 'role' },
        { text: this.$t('text.account.createdAt'), value: 'createdAt' },
        { text: this.$t('text.account.action'), value: 'email' }
      ],
      pagination: {
        rowsPerPage: 10
      },
      deleting: false,
      selected: []
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/back/users').then(({ data }) => {
      return {
        items: data.users
      }
    })
  },
  methods: {
    async del(item) {
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        const { status } = await this.$axios.$delete(
          `/api/back/users/${item._id}`
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
          await this.$axios.$delete(`/api/back/users/${item._id}`)
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
          name: 'dashboard-users-edit',
          query: { id: item._id }
        })
      )
    }
  },
  head() {
    return {
      title: this.$t('head.duser.index')
    }
  }
}
</script>

<style></style>
