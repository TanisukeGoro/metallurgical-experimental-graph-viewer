<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mainVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} AbeKeishi</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Default extends Vue {
  clipped: boolean = true
  drawer: boolean = true
  fixed: boolean = false
  items: Array<any> = [
    {
      icon: 'mdi-apps',
      title: 'Dashboard',
      to: '/'
    },
    {
      icon: 'mdi-poll-box-outline',
      title: 'XRD plot',
      to: '/xrd'
    },
    {
      icon: 'mdi-poll-box-outline',
      title: 'Ternary plot',
      to: '/ternary-plot'
    },
    {
      icon: 'mdi-poll-box-outline',
      title: 'DTA plot',
      to: '/dta-plot'
    }
  ]

  mainVariant: boolean = false
  title: string = 'METALLURGICAL EXPERIMENTAL GRAPH VIEWER'
}
</script>
