<template>
  <v-app>
    <ternaly-plot></ternaly-plot>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import TernalyPlot from '~/components/TernalyPlot.vue'

@Component({
  components: {
    TernalyPlot
  }
})
export default class TernalyPlotView extends Vue {}
</script>
