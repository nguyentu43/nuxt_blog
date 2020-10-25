export default function({ $axios, store, app }) {
  $axios.setHeader('X-CSRF-TOKEN', store.state.csrfToken)
  $axios.onError(({ response }) => {
    store.dispatch('ADD_ALERT', {
      type: 'error',
      message:
        process.env.NODE_ENV === 'production'
          ? app.$t('message.error')
          : response.data.message
    })
  })
}
