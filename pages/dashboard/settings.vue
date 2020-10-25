<template>
  <v-card>
    <v-card-title class="brown darken-2 white--text">
      <h3>{{ $t('text.setting.title') }}</h3>
    </v-card-title>
    <v-container class="py-1">
      <v-layout>
        <v-flex xs12>
          <v-form ref="form" lazy-validation>
            <v-tabs>
              <v-tab ripple>{{ $t('text.setting.menu1') }}</v-tab>
              <v-tab ripple>{{ $t('text.setting.menu2') }}</v-tab>
              <v-tab-item>
                <v-container class="pb-0">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        v-model="options.title"
                        outline
                        :rules="nameRules"
                        :label="$t('text.textField.title')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-textarea
                        v-model="options.description"
                        outline
                        :label="$t('text.textField.description')"
                      ></v-textarea>
                    </v-flex>
                    <v-flex xs12>
                      <v-textarea
                        v-model="options.keywords"
                        outline
                        :label="$t('text.textField.keywords')"
                      ></v-textarea>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="options.hostname"
                        outline
                        :label="$t('text.textField.hostname')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-btn
                        small
                        color="primary"
                        @click="bgHeaderDialog = true"
                      >
                        <v-icon class="mr-1">insert_photo</v-icon>
                        {{ $t('text.btn.bgHeader') }}
                      </v-btn>
                      <v-avatar v-if="options.bgHeader" size="100" tile>
                        <img :src="`/api/files/${options.bgHeader}`" />
                      </v-avatar>
                      <span v-else>{{ $t('rules.file.noImage') }}</span>
                      <photo-box
                        v-model="bgHeaderDialog"
                        :fileid="options.bgHeader"
                        @change="setBgHeader"
                      />
                    </v-flex>
                    <v-flex xs12 class="mt-2">
                      <v-btn small color="primary" @click="iconDialog = true">
                        <v-icon class="mr-1">insert_photo</v-icon>
                        {{ $t('text.btn.icon') }}
                      </v-btn>
                      <v-avatar v-if="options.icon" size="100" tile>
                        <img :src="`/api/files/${options.icon}`" />
                      </v-avatar>
                      <span v-else>{{ $t('rules.file.noImage') }}</span>
                      <photo-box
                        v-model="iconDialog"
                        :fileid="options.icon"
                        @change="setIcon"
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container grid-list-xl>
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-icon @click.self="addMenuItem()">add</v-icon>
                      <v-treeview
                        v-if="showTree"
                        :open-all="true"
                        activatable
                        active-class="primary--text"
                        :active.sync="activeMenuItem"
                        :items="menu"
                      >
                        <template v-slot:append="{ item }">
                          <v-icon @click.self.prevent="upMenuItem(item)"
                            >expand_less</v-icon
                          >
                          <v-icon @click.self.prevent="downMenuItem(item)"
                            >expand_more</v-icon
                          >
                          <v-icon
                            v-if="item.children"
                            @click.self.prevent="addMenuItem(item)"
                            >add</v-icon
                          >
                          <v-icon @click.self.prevent="removeMenuItem(item)"
                            >remove</v-icon
                          >
                        </template>
                      </v-treeview>
                    </v-flex>
                    <v-flex
                      v-if="selectedMenuItem && activeMenuItem.length > 0"
                      xs12
                      sm6
                    >
                      <h3 class="mb-2">{{ $t('text.textField.editMenu') }}</h3>
                      <v-text-field
                        v-model="selectedMenuItem.name"
                        :label="$t('text.textField.menuName')"
                        :rules="[v => !!v || 'Required']"
                        outline
                      ></v-text-field>
                      <v-text-field
                        v-model="selectedMenuItem.link"
                        :label="$t('text.textField.link')"
                        outline
                      ></v-text-field>
                      <v-text-field
                        v-model="selectedMenuItem.icon"
                        :label="$t('text.btn.icon')"
                        outline
                        :append-icon="selectedMenuItem.icon"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
            </v-tabs>
            <v-btn :loading="loading" color="green" dark @click="update">{{
              $t('text.btn.save')
            }}</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import Vue from 'vue'
import PhotoBox from '@/components/PhotoBox'

export default {
  layout: 'dashboard',
  components: { PhotoBox },
  data() {
    return {
      options: {},
      nameRules: [v => !!v || this.$t('rule.title.required')],
      loading: false,
      activeMenuItem: [],
      selectedMenuItem: null,
      showTree: true,
      bgHeaderDialog: false,
      iconDialog: false
    }
  },
  computed: {
    menu: {
      get() {
        return this.options.menu
      },
      set(items) {
        Vue.set(this.options, 'menu', items)
      }
    }
  },
  watch: {
    activeMenuItem(list) {
      if (list.length > 0) {
        const selectedItem = list[0]
        this.menu.forEach(item => {
          if (item.id === selectedItem) {
            this.selectedMenuItem = item
          }
          item.children.forEach(subItem => {
            if (subItem.id === selectedItem) {
              this.selectedMenuItem = subItem
            }
          })
        })
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/api/back/options').then(({ data }) => {
      return {
        options: data.options
      }
    })
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios
          .$patch('/api/back/options', { options: this.options })
          .then(({ status }) => {
            if (status === 'success') {
              this.$store.dispatch('ADD_ALERT', {
                type: 'success',
                message: this.$t('message.success.update')
              })
              this.$store.dispatch('GET_OPTIONS');
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    setBgHeader(fileid) {
      this.options.bgHeader = fileid
    },
    setIcon(fileid) {
      this.options.icon = fileid
    },
    addMenuItem(item = null) {
      if (item) {
        item.children.push({
          name: this.$t('text.textField.itemMenu'),
          parent: item.id,
          id: Date.now()
        })
      } else {
        this.menu.push({
          name: this.$t('text.textField.itemMenu'),
          children: [],
          id: Date.now()
        })
      }
    },
    removeMenuItem(deleteItem) {
      if (deleteItem.parent) {
        this.menu.forEach(item => {
          if (item.id === deleteItem.parent) {
            Vue.set(item.children, this._.pull(item.children, deleteItem))
          }
        })
      } else {
        Vue.set(this.menu, this._.pull(this.menu, deleteItem))
      }
      this.forceUpdateTree()
    },
    upMenuItem(item) {
      if (item.parent) {
        const parent = this.menu.find(v => v.id === item.parent)
        const index = this._.findIndex(parent.children, item)
        if (index > 0) {
          const prev = parent.children[index - 1]
          parent.children[index] = prev
          parent.children[index - 1] = item
        }
      } else {
        const index = this._.findIndex(this.menu, item)
        if (index > 0) {
          const prev = this.menu[index - 1]
          this.menu[index] = prev
          this.menu[index - 1] = item
        }
      }
      this.menu = this.menu
      this.forceUpdateTree()
    },
    downMenuItem(item) {
      if (item.parent) {
        const parent = this.menu.find(v => v.id === item.parent)
        const index = this._.findIndex(parent.children, item)
        if (index < parent.children.length - 1) {
          const next = parent.children[index + 1]
          parent.children[index] = next
          parent.children[index + 1] = item
        }
      } else {
        const index = this._.findIndex(this.menu, item)
        if (index < this.menu.length - 1) {
          const next = this.menu[index + 1]
          this.menu[index] = next
          this.menu[index + 1] = item
        }
      }
      this.menu = this.menu
      this.forceUpdateTree()
    },
    forceUpdateTree() {
      this.showTree = false
      setTimeout(() => {
        this.showTree = true
      }, 100)
    }
  },
  head() {
    return {
      title: this.$t('head.setting')
    }
  }
}
</script>

<style></style>
