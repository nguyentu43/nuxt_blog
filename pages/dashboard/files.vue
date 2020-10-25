<template>
  <v-card>
    <v-card-title class="blue-grey white--text py-0">
      <h3>{{ $t('text.file.list') }}</h3>
      <v-spacer></v-spacer>
      <v-btn small fab color="green" dark @click="dialog = true">
        <v-icon>cloud_upload</v-icon>
      </v-btn>
      <v-btn small :loading="reload" fab color="primary" @click="reloadData">
        <v-icon>loop</v-icon>
      </v-btn>
    </v-card-title>
    <upload-dialog v-model="dialog" />
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
      v-model="selected"
      :rows-per-page-items="[10, 20, 30]"
      :pagination.sync="pagination"
      select-all
      :items="files"
      :search="search"
      :headers="headers"
    >
      <template #items="{ item }">
        <td>
          <v-checkbox v-model="item.selected" primary hide-details></v-checkbox>
        </td>
        <td>{{ item.filename }}</td>
        <td>{{ (item.length / 1024 / 1024).toFixed(2) }} MB</td>
        <td>{{ item.uploadDate | dateFromNow }}</td>
        <td>
          <v-icon small class="mr-2" @click="view(item)">pageview</v-icon>
          <v-icon small @click="del(item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
    <v-btn color="error" :loading="deleting" @click="deleteSelected">{{
      $t('text.btn.selectRemove')
    }}</v-btn>
  </v-card>
</template>

<script>
import UploadDialog from '@/components/UploadDialog'

export default {
  layout: 'dashboard',
  components: { UploadDialog },
  data() {
    return {
      selected: [],
      files: [],
      search: '',
      headers: [
        { text: this.$t('text.file.filename'), value: 'filename' },
        { text: this.$t('text.file.length'), value: 'length' },
        {
          text: this.$t('text.file.uploadDate'),
          value: 'uploadDate',
          sortable: true
        },
        { text: this.$t('text.file.action'), value: '_id' }
      ],
      reload: false,
      dialog: false,
      deleting: false,
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/files').then(({ data }) => {
      return {
        ...data
      }
    })
  },
  methods: {
    async del(item) {
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        const { status } = await this.$axios.$delete(`/api/files/${item._id}`)
        if (status === 'success') {
          this.$store.dispatch('ADD_ALERT', {
            type: 'success',
            message: this.$t('message.success.delete')
          })
          this.files = this.files.filter(v => v._id !== item._id)
        }
      }
    },
    async deleteSelected() {
      let deleteFiles
      if (this.selected.length > 0) {
        deleteFiles = this.selected
      }
      deleteFiles = this.files.filter(v => v.selected === true)
      const res = await this.$confirm(this.$t('text.textField.deleteItem'))
      if (res) {
        this.deleting = true
        for (const item of deleteFiles) {
          await this.$axios.$delete(`/api/files/${item._id}`)
          this.files = this.files.filter(v => v._id !== item._id)
        }
        this.deleting = false
        this.$store.dispatch('ADD_ALERT', {
          type: 'success',
          message: this.$t('message.success.delete')
        })
      }
    },
    view(item) {
      const link = document.createElement('a')
      link.href = `/api/files/${item._id}`
      link.target = '_blank'
      link.click()
    },
    reloadData() {
      this.reload = true
      this.$axios
        .$get('/api/files')
        .then(({ data }) => {
          this.files = data.files
        })
        .finally(() => {
          this.reload = false
        })
    }
  },
  head() {
    return {
      title: this.$t('head.file')
    }
  }
}
</script>

<style></style>
