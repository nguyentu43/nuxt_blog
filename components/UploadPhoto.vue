<template>
  <div class="text-xs-center">
    <v-avatar size="120" color="grey lighten-4">
      <img id="photo" :src="src" alt="avatar" />
    </v-avatar>
    <br />
    <div>
      <small>{{ $t('rules.file.max', { max: 2 }) }}</small>
    </div>
    <v-btn color="primary" @click="choosePhoto">{{
      $t('text.btn.choosePhoto')
    }}</v-btn>
    <input id="photoInput" accept="image/*" type="file" style="display: none" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  mounted() {
    const photoInput = document.querySelector('#photoInput')
    const photo = document.querySelector('#photo')

    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0]
      const reader = new FileReader()
      reader.onload = function(event) {
        if (event.target.result) photo.src = event.target.result
      }
      reader.readAsDataURL(file)
    })
  },
  methods: {
    choosePhoto() {
      const photoInput = document.querySelector('#photoInput')
      photoInput.click()
    },
    getPhoto() {
      const photoInput = document.querySelector('#photoInput')
      if (photoInput.files.length > 0) return photoInput.files[0]
      else return false
    }
  }
}
</script>

<style></style>
