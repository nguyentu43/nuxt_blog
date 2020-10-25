const { AbilityBuilder } = require('@casl/ability')

module.exports = function(user) {
  return AbilityBuilder.define(function(can, cannot) {
    switch (user.role) {
      case 'administrator':
        can('manage', 'all')
        break
      case 'editor':
        can('manage', 'Post')
        can(['read', 'update'], 'User', { _id: user._id })
        can(['manage'], 'Comment', { user: user._id })
        can(['manage'], 'Tag')
        break
      case 'author':
        can('manage', 'Post', { user: user._id })
        can(['read', 'update'], 'User', { _id: user._id })
        can(['manage'], 'Comment', { user: user._id })
        can(['manage'], 'Tag')
        break
      case 'contributor':
        can('manage', 'Post', { user: user._id })
        can(['read', 'update'], 'User', { _id: user._id })
        can(['manage'], 'Comment', { user: user._id })
        break
      case 'subscriber':
        can(['read', 'update'], 'User', { _id: user._id })
        can(['manage'], 'Comment', { user: user._id })
        break
      default:
    }
  })
}
