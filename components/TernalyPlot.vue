<template>
  <v-container grid-list-md>
    <v-row>
      <v-col md="6">
        <v-card class="mb-3" flat outlined>
          <v-card-title primary-title>
            状態図画像の位置調整
          </v-card-title>
          <v-card-text>
            画像の位置がブラウザのウィンドウサイズによって大幅にずれるようです。<br />1440px
            × 820px(macbook
            13インチ)に合わせているので画面サイズをその辺すればたぶん大体合うと思うよ.
            <br /><a
              href="https://saruwakakun.com/html-css/basic/chrome-dev-tool#section7"
              target="_blank"
              >デベロッパーツール開いて画面サイズをいい感じにする方法.</a
            >
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-slider
              v-model="imgXpoint"
              class="py-0 my-0"
              height="10"
              min="0"
              max="1"
              step="0.001"
              :label="`X: ${imgXpoint.toFixed(3)}`"
            ></v-slider>
          </v-card-actions>
          <v-card-actions class="mx-3">
            <v-slider
              v-model="imgYpoint"
              class="py-0 my-0"
              height="10"
              min="0"
              max="3"
              step="0.001"
              :label="`Y: ${imgYpoint.toFixed(3)}`"
            ></v-slider>
          </v-card-actions>
          <v-card-actions class="mx-3">
            <v-slider
              v-model="imgSize"
              class="py-0 my-0"
              height="10"
              min="0"
              max="3"
              step="0.01"
              :label="`SIZE: ${imgSize.toFixed(2)}`"
            ></v-slider>
          </v-card-actions>
          <v-card-actions class="mx-3">
            <v-slider
              v-model="imgOpacity"
              class="py-0 my-0"
              height="10"
              min="0"
              max="1"
              step="0.01"
              :label="`OPACITY: ${imgOpacity}`"
            ></v-slider>
          </v-card-actions>
        </v-card>
        <v-card outlined>
          <v-data-table
            :headers="headers"
            :items="dataSets"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      >Add Points</v-btn
                    >
                    <v-spacer />
                    <v-btn color="primary" dark class="mb-2" @click="reset()"
                      >RESET</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.label"
                              label="label name"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.Al"
                              label="Al at.%"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.Pd"
                              label="Pd at.%"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.TM"
                              label="TM"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            {{
                              Number(editedItem.Al) +
                                Number(editedItem.Pd) +
                                Number(editedItem.TM)
                            }}
                          </v-col>
                          <v-text-field
                            v-model="textData"
                            label="タブ、スペース、カンマ区切りのデータ(ex: 70, 20, 10)"
                          ></v-text-field>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="save"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col outlined md="6" cols="12">
        <v-card outlined>
          <v-card-actions class="mx-3">
            <v-select
              v-model="imgSelect"
              :items="items"
              item-text="title"
              item-value="src"
              label="Select"
              return-object
              single-line
            ></v-select>
          </v-card-actions>

          <div id="ternaly" ref="ternaly"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import * as Plotly from 'plotly.js-dist'
import imageDefinition, { Select } from '@/plugins/imageDefinition'
import ternalyData, { PlotData } from '@/plugins/ternalyData'

interface Axis {
  title: string
  titlefont: { size: number }
  min: number
  tickangle: number
  tickfont: { size: number; color: string }
  tickcolor: string
  ticklen: number
  showline: boolean
  showgrid: boolean
}

@Component
export default class TernalyPlot extends Vue {
  editedItem: PlotData = { Al: 0, TM: 0, Pd: 0, label: '' }

  defaultItem: PlotData = { Al: 0, TM: 0, Pd: 0, label: '' }

  dataSets: PlotData[] = []
  editedIndex: number = -1
  dialog: boolean = false

  imgXpoint: number = 0.379
  imgYpoint: number = 0.79
  imgSize: number = 0.86
  imgOpacity: number = 1
  items: object = imageDefinition
  imgSelect: Select = { ...imageDefinition[0] }
  rawData: PlotData[] = ternalyData
  textData: string = ''

  headers: {
    text: string
    align: string
    sortable: boolean
    value: string
  }[] = [
    { text: 'label', align: 'start', sortable: true, value: 'label' },
    { text: 'Al at.%', align: 'center', sortable: true, value: 'Al' },
    { text: 'Pd at.%', align: 'center', sortable: true, value: 'Pd' },
    { text: 'TM at.%', align: 'center', sortable: true, value: 'TM' },
    { text: 'Actions', align: 'center', sortable: true, value: 'actions' }
  ]

  config: { showLink: boolean; plotlyServerURL: string } = {
    showLink: true,
    plotlyServerURL: 'https://chart-studio.plotly.com'
  }

  mounted() {
    this.dataSets = this.rawData
    this.updateImgOffcet()
    this.renderReact()
  }

  @Watch('imgXpoint')
  onImgXpointChanged() {
    this.renderReact()
  }

  @Watch('imgYpoint')
  onImgYpointChanged() {
    this.renderReact()
  }

  @Watch('imgSize')
  onImgSizeChanged() {
    this.renderReact()
  }

  @Watch('imgOpacity')
  onImgOpacityChanged() {
    this.renderReact()
  }

  @Watch('imgSelect')
  onImgSelectChanged() {
    this.updateImgOffcet()
    this.renderReact()
  }

  @Watch('dataSets', { deep: true })
  onDataSets() {
    this.renderReact()
  }

  @Watch('textData', { deep: true })
  onTextData() {
    const list = this.textData.split(/[,\t]/).map((i) => Number(i))
    if (list.length < 3) {
      this.textData = ''
      return 0
    }
    ;[this.editedItem.Al, this.editedItem.Pd, this.editedItem.TM] = list
  }

  updateImgOffcet() {
    this.imgXpoint = this.imgSelect.x
    this.imgYpoint = this.imgSelect.y
    this.imgSize = this.imgSelect.size
  }

  get formTitle(): string {
    return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
  }

  // @ts-ignore
  renderReact() {
    Plotly.react(
      // @ts-ignore
      this.$refs.ternaly,
      [
        {
          type: 'scatterternary',
          mode: 'markers',
          a: this.dataSets.map(function(d) {
            return d.Al
          }),
          b: this.dataSets.map(function(d) {
            return d.TM
          }),
          c: this.dataSets.map(function(d) {
            return d.Pd
          }),
          text: this.dataSets.map(function(d) {
            return d.label
          }),
          hovertemplate:
            '%{text}<br>Al: %{a:.2f}<br>Pd: %{c:.2f}<br>TM: %{b:.2f}',
          marker: {
            symbol: 100,
            color: '#DB7365',
            size: 3,
            line: { width: 1, color: '#DB7365' }
          }
        }
      ],
      {
        ternary: {
          sum: 100,
          aaxis: this.makeAxis('Al', 60, 50),
          baxis: this.makeAxis('TM', -60, 0),
          caxis: this.makeAxis('Pd', 0, 0),
          bgcolor: 'rgba(0,0,0,0)'
        },
        annotations: [
          {
            showarrow: false,
            text: this.imgSelect.title,
            x: 0.5,
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
      },
      this.config
    )
  }
  /* eslint-enable */

  makeAxis(title: string, tickangle: number, min: number): Axis {
    return {
      title,
      titlefont: { size: 20 },
      min,
      tickangle,
      tickfont: { size: 15, color: 'rgba(0,0,0,0)' },
      tickcolor: 'rgba(0,0,0,0)',
      ticklen: 5,
      showline: true,
      showgrid: true
    }
  }

  editItem(item: any) {
    this.editedIndex = this.dataSets.indexOf(item)
    this.editedItem = Object.assign({}, item)
    this.dialog = true
  }

  deleteItem(item: any) {
    const index = this.dataSets.indexOf(item)
    confirm('Are you sure you want to delete this item?') &&
      this.dataSets.splice(index, 1)
  }

  close() {
    this.dialog = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
    this.textData = ''
  }

  save() {
    if (this.editedIndex > -1) {
      Object.assign(this.dataSets[this.editedIndex], this.editedItem)
    } else {
      this.dataSets.push(this.editedItem)
    }
    this.textData = ''
    this.close()
  }

  reset() {
    this.dataSets = [this.defaultItem]
    this.renderReact()
  }
}
</script>
