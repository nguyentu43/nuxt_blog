export default function({ route, store, redirect }) {
  if (/^\/(dashboard|auth\/user)/g.test(route.path)) {
    if (!store.state.user) {
      redirect('/auth/login')
    } else if (/^\/dashboard/g.test(route.path)) {
      if (store.state.user.role === 'subscriber') {
        redirect('/')
      }
    }
  } else if (
    ['auth-login', 'auth-register', 'auth-reset', 'auth-reset-key'].includes(
      route.name
    )
  ) {
    if (store.state.user) {
      redirect('/')
    }
  }
}
