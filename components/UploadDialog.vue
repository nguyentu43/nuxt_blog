<template>
  <v-dialog v-model="value" hide-overlay persistent width="500">
    <v-card>
      <v-card-title class="green white--text">
        <h3>{{ $t('text.file.upload') }}</h3>
      </v-card-title>
      <v-card-text>
        <input
          id="files"
          type="file"
          multiple
          class="d-none"
          @change="loadFiles"
        />
        <v-container class="pa-0">
          <v-layout wrap>
            <v-flex xs12>
              <v-list v-if="files.length > 0">
                <v-list-tile v-for="(item, index) in files" :key="item.name">
                  <v-list-tile-title>
                    <v-list-tile-content>{{
                      index + 1 + '. ' + item.name
                    }}</v-list-tile-content>
                    <v-list-tile-sub-title>{{
                      item.size
                    }}</v-list-tile-sub-title>
                  </v-list-tile-title>
                  <v-list-tile-action>
                    <v-icon @click="deleteFile(index)">delete</v-icon>
                    <v-icon v-if="item.status === 'success'" class="green--text"
                      >done</v-icon
                    >
                    <v-icon
                      v-else-if="item.status === 'error'"
                      class="red--text"
                      >error</v-icon
                    >
                  </v-list-tile-action>
                  <v-divider></v-divider>
                </v-list-tile>
              </v-list>
            </v-flex>
            <v-progress-linear
              :color="processUploadColor"
              height="5"
              :value="processUpload"
            ></v-progress-linear>
            <v-flex xs12>
              <v-btn fab small color="primary" @click="selectFiles">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn fab small color="green" dark @click="uploadFiles">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
              <div>
                <small>{{ $t('rules.file.max', { max: 10 }) }}</small>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat
          @click="
            $emit('input', false)
            files = []
          "
          >{{ $t('text.btn.close') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      files: [],
      inputFile: null,
      processUpload: 0,
      processUploadColor: 'green'
    }
  },
  mounted() {
    this.inputFile = document.querySelector('#files')
  },
  methods: {
    loadFiles($event) {
      this.files = this._.unionBy(this.files, [...$event.target.files], 'name')
    },
    selectFiles() {
      this.inputFile.click()
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    uploadFiles() {
      this.processUploadColor = 'success'
      this.processUpload = 0
      const totalFile = this._.countBy(this.files, v => !v.status).true
      this.files.forEach((file, index) => {
        if (!file.status) {
          const formData = new FormData()
          formData.append('file', file)
          this.$axios
            .$post('/api/files', formData, {
              'Content-Type': 'multipart/form-data'
            })
            .then(({ status, data }) => {
              if (status === 'success') {
                file.status = 'success'
                this.processUpload += 100 / totalFile
                Vue.set(this.files, index, file)
              }
            })
            .catch(({ status }) => {
              file.status = 'error'
              this.processUploadColor = 'error'
              Vue.set(this.files, index, file)
            })
        }
      })
    }
  }
}
</script>

<style></style>
