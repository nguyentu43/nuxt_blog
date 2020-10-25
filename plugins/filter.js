import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'

export default function({ app }) {
  dayjs.locale(app.i18n.locale)
  dayjs.extend(relativeTime)

  Vue.filter('dateFromNow', function(date) {
    return dayjs(date).fromNow()
  })

  Vue.filter('fullName', function(user) {
    return `${user.firstName} ${user.lastName}`
  })
}
