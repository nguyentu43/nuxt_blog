<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4>
        <v-card>
          <v-card-title class="py-1">
            <v-btn to="/dashboard/posts" fab color="red" dark>
              <v-icon>class</v-icon>
            </v-btn>
            <div class="sub-info">
              <h2>{{ posts.count }}</h2>
              <div>{{ $t('text.textField.post') }}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 md4>
        <v-card>
          <v-card-title class="py-1">
            <v-btn to="/dashboard/tags" fab color="indigo" dark>
              <v-icon>local_offer</v-icon>
            </v-btn>
            <div class="sub-info">
              <h2>{{ tags.count }}</h2>
              <div>{{ $t('text.textField.tag') }}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3>
        <v-card>
          <v-card-title class="py-1">
            <v-btn to="/dashboard/users" fab color="deep-orange" dark>
              <v-icon>group</v-icon>
            </v-btn>
            <div class="sub-info">
              <h2>{{ users.count }}</h2>
              <div>{{ $t('text.textField.account') }}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card class="mt-4">
          <v-card-title class="red white--text">
            <h3>{{ $t('text.post.newest') }}</h3>
          </v-card-title>
          <v-data-table :items="posts.newest" :headers="postsHeader">
            <template v-slot:items="props">
              <td>{{ props.item.title }}</td>
              <td>{{ props.item.status }}</td>
              <td>{{ props.item.user | fullName }}</td>
              <td>{{ props.item.createdAt | dateFromNow }}</td>
              <td>
                <v-icon
                  small
                  class="mr-2"
                  @click="
                    $router.push(
                      localePath({
                        name: 'slug',
                        params: { slug: props.item.slug }
                      })
                    )
                  "
                  >visibility</v-icon
                >
                <v-icon
                  small
                  @click="
                    $router.push(`/dashboard/posts/edit?id=${props.item._id}`)
                  "
                  >edit</v-icon
                >
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card v-if="users.newest" class="mt-4">
          <v-card-title class="deep-orange white--text">
            <h3>{{ $t('text.account.newest') }}</h3>
          </v-card-title>
          <v-data-table :items="users.newest" :headers="usersHeader">
            <template v-slot:items="props">
              <td>
                <v-avatar size="40">
                  <v-img :src="`/api/front/photo/${props.item._id}`"></v-img>
                </v-avatar>
              </td>
              <td>{{ props.item | fullName }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.role }}</td>
              <td>{{ props.item.createdAt | dateFromNow }}</td>
              <td>
                <v-icon
                  small
                  @click="
                    $router.push(`/dashboard/users/edit?id=${props.item._id}`)
                  "
                  >edit</v-icon
                >
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'dashboard',
  data() {
    return {
      user: {},
      tags: {},
      posts: {},
      usersHeader: [
        { text: this.$t('text.account.photo'), value: 'lastName' },
        { text: this.$t('text.account.fullName'), value: 'lastName' },
        { text: this.$t('text.account.email'), value: 'email' },
        { text: this.$t('text.account.role'), value: 'role' },
        { text: this.$t('text.account.createdAt'), value: 'createdAt' },
        { text: this.$t('text.account.action'), value: 'email' }
      ],
      postsHeader: [
        { text: this.$t('text.post.title'), value: 'title' },
        { text: this.$t('text.post.status'), value: 'status' },
        { text: this.$t('text.post.user'), value: 'user.lastName' },
        { text: this.$t('text.post.createdAt'), value: 'createdAt' },
        { text: this.$t('text.post.action'), value: 'title' }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/back/dashboard').then(({ data }) => {
      return {
        ...data.dashboard
      }
    })
  },
  head() {
    return {
      title: this.$t('head.dashboard')
    }
  }
}
</script>

<style scoped>
.sub-info {
  flex-grow: 2;
  text-align: center;
}
</style>
