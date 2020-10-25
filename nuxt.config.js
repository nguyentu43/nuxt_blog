const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'white' },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/app.styl',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/axios',
    '@/plugins/lodash',
    { src: '@/plugins/vuetify-confirm', ssr: false },
    '@/plugins/filter',
    { src: '@/plugins/quill', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    [
      'nuxt-i18n',
      {
        locales: [{ name: 'Tiếng Việt', code: 'vi', iso: 'vi', file: 'vi.js' }],
        langDir: 'lang/',
        defaultLocale: 'vi',
        lazy: true,
        seo: false
      }
    ]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.APP_URL || '/'
  },

  serverMiddleware: [
    '~/api/index.js',
    '~/api/auth/index.js',
    '~/api/routes/back/index.js',
    '~/api/routes/front/index.js',
    '~/api/routes/file.js',
    { path: '/api', handler: '~/api/middleware/validation.js' },
    { path: '/api', handler: '~/api/middleware/error.js' }
  ],

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: ['auth']
  }
}
