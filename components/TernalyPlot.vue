<template>
  <div>
    <v-container grid-list-md>
      <v-row>
        <v-col md="6">
          <v-card outlined>
            <v-data-table
              :headers="headers"
              :items="rawData"
              :items-per-page="10"
              class="elevation-1"
            ></v-data-table>
          </v-card>
        </v-col>
        <v-col outlined md="6" cols="12">
          <v-card outlined>
            <div id="ternaly" ref="ternaly"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-select
      v-model="imgSelect"
      :items="items"
      item-text="title"
      item-value="src"
      label="Select"
      return-object
      single-line
    ></v-select>
    <v-slider
      v-model="imgXpoint"
      min="0"
      max="1"
      step="0.001"
      :label="`X: ${imgXpoint}`"
    ></v-slider>
    <v-slider
      v-model="imgYpoint"
      min="0"
      max="3"
      step="0.001"
      :label="`Y: ${imgYpoint}`"
    ></v-slider>
    <v-slider
      v-model="imgSize"
      min="0"
      max="3"
      step="0.01"
      :label="`SIZE: ${imgSize}`"
    ></v-slider>
    <v-slider
      v-model="imgOpacity"
      min="0"
      max="1"
      step="0.01"
      :label="`OPACITY: ${imgOpacity}`"
    ></v-slider>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import * as Plotly from 'plotly.js-dist'
import imageDefinition from '@/plugins/imageDefinition'

interface Select {
  title: string
  src: string
  x: number
  y: number
  size: number
}

@Component
export default class TernalyPlot extends Vue {
  imgXpoint: number = 0.379
  imgYpoint: number = 0.79
  imgSize: number = 0.86
  imgOpacity: number = 1
  items: object = imageDefinition
  imgSelect: Select = { ...imageDefinition[0] }
  rawData: {
    Al: number
    Ru: number
    Pd: number
    label: string
  }[] = [
    { Al: 72.2, Ru: 13.9, Pd: 13.9, label: 'P40<->C' },
    { Al: 71.4, Ru: 11.9, Pd: 16.7, label: 'P40 calc.' },
    { Al: 72.0, Ru: 11.6, Pd: 16.4, label: 'P40 obs.' },
    { Al: 71.0, Ru: 10, Pd: 19, label: '1/2 obs..' },
    { Al: 72.35862222, Ru: 11.97194444, Pd: 15.66941111, label: 'x = 0' },
    { Al: 71.26068333, Ru: 12.21173333, Pd: 16.5276, label: 'x = 10' },
    { Al: 70.43638333, Ru: 12.84366667, Pd: 16.71996667, label: 'x= 15' },
    { Al: 71.94599167, Ru: 12.491075, Pd: 15.56291667, label: 'x= 20' },
    // { Al: 67.2, Ru: 8.4, Pd: 24.4, label: 'P20 epma' },
    { Al: 70.0, Ru: 7.7, Pd: 22.3, label: 'P20 ref.' },
    { Al: 70.0, Ru: 9.0, Pd: 21.0, label: 'P20' }
    // { Al: 70.4, Ru: 14.9, Pd: 14.7, label: 'C1 epma' },
    // { Al: 71.2, Ru: 10.8, Pd: 18.0, label: 'N13 48h' },
    // { Al: 71.1, Ru: 11.1, Pd: 17.8, label: 'N13 120h' }
  ]

  headers: {
    text: string
    align: string
    sortable: boolean
    value: string
  }[] = [
    { text: 'label', align: 'start', sortable: true, value: 'label' },
    { text: 'Al at.%', align: 'center', sortable: true, value: 'Al' },
    { text: 'Pd at.%', align: 'center', sortable: true, value: 'Pd' },
    { text: 'Ru at.%', align: 'center', sortable: true, value: 'Ru' }
  ]

  mounted() {
    this.updateImgOffcet()
    this.rendar()
  }

  @Watch('imgXpoint')
  onImgXpointChanged() {
    this.rendar()
  }

  @Watch('imgYpoint')
  onImgYpointChanged() {
    this.rendar()
  }

  @Watch('imgSize')
  onImgSizeChanged() {
    this.rendar()
  }

  @Watch('imgOpacity')
  onImgOpacityChanged() {
    this.rendar()
  }

  @Watch('imgSelect')
  onImgSelectChanged() {
    this.updateImgOffcet()
    this.rendar()
  }

  updateImgOffcet() {
    this.imgXpoint = this.imgSelect.x
    this.imgYpoint = this.imgSelect.y
    this.imgSize = this.imgSelect.size
  }

  rendar() {
    Plotly.react(
      this.$refs.ternaly,
      [
        {
          type: 'scatterternary',
          mode: 'markers',
          a: this.rawData.map(function(d) {
            return d.Al
          }),
          b: this.rawData.map(function(d) {
            return d.Ru
          }),
          c: this.rawData.map(function(d) {
            return d.Pd
          }),
          text: this.rawData.map(function(d) {
            return d.label
          }),
          marker: {
            symbol: 100,
            color: '#DB7365',
            size: 2,
            line: { width: 1 }
          }
        }
      ],
      {
        ternary: {
          sum: 100,
          aaxis: this.makeAxis('Al', 0, 50),
          baxis: this.makeAxis('Ru', 45, 0),
          caxis: this.makeAxis('Pd', -45, 0),
          bgcolor: 'rgba(0,0,0,0)'
        },
        annotations: [
          {
            showarrow: false,
            text: 'Partial isothermal section of Al-Pd-Ru at 1000˚C',
            x: 1.0,
            y: 1.3,
            font: { size: 15 }
          }
        ],
        paper_bgcolor: 'rgba(0,0,0,0)',
        images: [
          {
            x: this.imgXpoint,
            y: this.imgYpoint,
            sizex: this.imgSize,
            sizey: this.imgSize,
            source: this.imgSelect.src,
            opacity: this.imgOpacity,
            layer: 'below'
          }
        ]
      }
    )
  }

  makeAxis(title: string, tickangle: number, min: number) {
    return {
      title,
      titlefont: { size: 20 },
      min,
      tickangle,
      tickfont: { size: 15 },
      tickcolor: 'rgba(0,0,0,0)',
      ticklen: 5,
      showline: true,
      showgrid: true
    }
  }
}
</script>
