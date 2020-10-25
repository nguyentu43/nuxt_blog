import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'

export default function({ app }) {
  const locale = app.i18n.locale
  const text = {
    vi: {
      yes: 'Có',
      no: 'Không'
    },
    en: {
      yes: 'Yes',
      no: 'No'
    }
  }
  Vue.use(VuetifyConfirm, {
    buttonTrueText: text[locale].yes,
    buttonFalseText: text[locale].no
  })
}
