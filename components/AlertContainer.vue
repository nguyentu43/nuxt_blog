<template>
  <div id="alert-container">
    <v-alert
      v-for="alert in alerts"
      :key="alert.id"
      dismissible
      :type="alert.type"
      value="true"
      >{{ alert.message }}</v-alert
    >
  </div>
</template>

<script>
export default {
  computed: {
    alerts() {
      return this.$store.state.alerts
    }
  }
}
</script>

<style scoped>
#alert-container {
  position: fixed;
  right: 10px;
  top: 20px;
  width: 35vw;
  z-index: 999;
}

@media screen and (max-width: 600px) {
  #alert-container {
    width: 60vw !important;
  }
}

@media screen and (max-width: 900px) {
  #alert-container {
    width: 40vw;
  }
}
</style>
