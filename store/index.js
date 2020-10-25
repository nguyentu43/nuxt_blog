let alertsLen = 0
export const state = () => ({
  user: null,
  csrfToken: null,
  options: null,
  alerts: []
})

export const mutations = {
  SET_CSRF_TOKEN(state, data) {
    state.csrfToken = data
  },
  SET_OPTIONS(state, data) {
    state.options = data
  },
  SET_USER(state, data) {
    state.user = data
  },
  ADD_ALERT(state, data) {
    state.alerts.push(data)
  },
  REMOVE_ALERT(state, id) {
    state.alerts = state.alerts.filter(v => v.id !== id)
  },
  SET_LAYOUT(state, layout) {
    state.layout = layout
  }
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, route, $axios, params }) {
    commit('SET_USER', req.user)
    commit('SET_CSRF_TOKEN', req.csrfToken())
    await dispatch('GET_OPTIONS')
  },
  GET_USER({ commit }) {
    return this.$axios.$get('/api/auth/user').then(result => {
      commit('SET_USER', result.data.user)
    })
  },
  ADD_ALERT({ commit }, data) {
    const id = alertsLen++
    data.timeout = data.timeout || 1000 * 10
    const item = { id, ...data }
    commit('ADD_ALERT', item)
    setTimeout(() => commit('REMOVE_ALERT', id), item.timeout)
  },
  GET_OPTIONS({ commit }) {
    return this.$axios.$get('/api/front/options').then(result => {
      commit('SET_OPTIONS', result.data.options)
    })
  }
}
