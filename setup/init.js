/* eslint-disable */
require('dotenv').config()
require('../api/db')
  .then(async function() {
    const User = require('../api/db/models/user')
    const Option = require('../api/db/models/option')

    await Option.insertMany([
      { name: 'title', value: 'Blog' },
      { name: 'description', value: 'Description' },
      {
        name: 'menu',
        value: [
          { name: 'Trang chủ', link: 'index', icon: 'home', children: [] },
          { name: 'Blog', link: 'blog', icon: 'favorite', children: [] }
        ]
      },
      { name: 'bgHeader', value: '' },
      { name: 'icon', value: '' },
      { name: 'hostname', value: '' },
      { name: 'keywords', value: '' }
    ])
    
    const admin = new User({
      firstName: 'User',
      lastName: 'Admin',
      email: 'example@example.com',
      password: '123456',
      role: 'administrator'
    })

    await admin.save()

    console.log('Init done!')
    process.exit(0)
  })
  .catch(function(err) {
    console.log(err)
  })
