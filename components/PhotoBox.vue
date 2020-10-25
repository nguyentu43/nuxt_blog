<template>
  <v-dialog v-model="value" hide-overlay persistent width="800">
    <v-card>
      <v-card-title class="py-0 blue white--text">
        <h3>{{ $t('text.btn.choosePhoto') }}</h3>
        <v-spacer></v-spacer>
        <upload-dialog v-model="uploadDialog" />
        <v-btn fab small @click="uploadDialog = true"
          ><v-icon>cloud_upload</v-icon></v-btn
        >
        <v-btn fab small @click="getData"><v-icon>sync</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <v-container class="pa-0" grid-list-md>
          <v-layout wrap>
            <v-flex v-for="file in files" :key="file._id" xs12 sm4>
              <v-card
                flat
                @click="
                  selected = file._id
                  $emit('change', file._id)
                "
              >
                <v-icon v-if="file._id === selected"
                  >radio_button_checked</v-icon
                >
                <v-icon v-else>radio_button_unchecked</v-icon>
                <v-img :src="`/api/files/${file._id}`"></v-img>
                {{ file.filename }}
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('input', false)">{{
          $t('text.btn.close')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import UploadDialog from './UploadDialog'

export default {
  components: { UploadDialog },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    fileid: {
      type: String
    }
  },
  data() {
    return {
      files: [],
      selected: '',
      uploadDialog: false
    }
  },
  watch: {
    uploadDialog(v) {
      if (!v) this.getData()
    }
  },
  mounted() {
    this.getData()
    this.selected = this.fileid
  },
  methods: {
    getData() {
      this.$axios.$get('/api/files').then(({ data }) => {
        this.files = data.files.filter(v =>
          /.+\.(jpg|gif|png|ico)/g.test(v.filename)
        )
      })
    }
  }
}
</script>

<style scoped>
img {
  height: 150px;
  width: 100%;
  object-fit: fill;
}
</style>
