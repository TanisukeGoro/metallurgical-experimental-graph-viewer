<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col md="4" class="databar">
          <v-card class="pa-2" outlined tile>
            <!-- =============== ダイアログ=================== -->
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >設定</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">設定</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="graphTitle"
                          dense
                          label="グラフのタイトル(HTML対応可)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="commonYshift"
                          dense
                          label="Y軸共通シフト"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedGraphWidth"
                          :rules="widthRule"
                          dense
                          label="グラフ横幅"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedGraphHeight"
                          :rules="heightRule"
                          dense
                          label="グラフ縦幅"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeSettings"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="saveSettings"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- =============== ダイアログ=================== -->
          </v-card>
          <v-card
            v-for="(xrd, index) in inputData"
            :key="index"
            class="pa-2 "
            outlined
            tile
          >
            <v-card class="mb-2" outlined tile>
              <v-card-text class="pb-0">
                <v-text-field
                  v-model="xrd.name"
                  dense
                  label="試料名"
                ></v-text-field>

                <v-row>
                  <v-col md="6" class="py-0">
                    <v-text-field
                      v-model="xrd.shiftX"
                      disabled
                      dense
                      label="x-shift [2θ]"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" class="py-0"
                    ><v-text-field
                      v-model="xrd.shiftY"
                      disabled
                      dense
                      label="y-shift"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-switch
                  :input-value="xrd.yaxis !== 'y'"
                  :label="`第2軸: ${xrd.yaxis !== 'y' ? 'ON' : 'OFF'}`"
                  @change="changeSecondaryAxis(index)"
                ></v-switch>
                <v-switch
                  :disabled="xrd.rawX.length > 300"
                  :input-value="xrd.mode !== 'lines'"
                  :label="
                    `回折位置のみファイル用: ${
                      xrd.isScatter !== 'y' ? 'ON' : 'OFF'
                    }`
                  "
                  @change="changeScatter(index)"
                ></v-switch>
                <v-spacer></v-spacer>
                <v-btn small icon @click="deleteXrdData(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-col>
        <v-col md="8">
          <file-drop class="mb-2" @files-selected="handleInputFile">
            <v-card id="plotarea" class="pa-2" outlined tile max-height="800">
              <v-card-text v-if="inputData.length == 0">
                ここにファイルをドラック&ドロップでXRDデータを追加
              </v-card-text>
              <div id="xrd" ref="xrd"></div>
            </v-card>
          </file-drop>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import * as Plotly from 'plotly.js-dist'
import xrdLayout from '@/plugins/xrdLayout'
import FileDrop from '@/components/FileDrop.vue'

interface XRD {
  rawX: number[]
  rawY: number[]
  x: number[]
  y: number[]
  shiftX: number
  shiftY: number
  name: string
  mode: string
  type: string
  yaxis: string
  marker: any
}

@Component({
  components: {
    FileDrop
  }
})
export default class XrdPlot extends Vue {
  dialog = false
  graphTitle: string =
    'Al<sub>72.0</sub>Pd<sub>16.4</sub>(Ru<sub>(100-x)%</sub>, Fe<sub>x%</sub>)<sub>11.4</sub>'

  editedGraphWidth: number = 0
  graphWidth = 0
  widthRule: any[] = [(v: any) => v <= 1000 || '最大1000pxまでです。']
  heightRule: any[] = [(v: any) => v <= 750 || '最大750pxまでです。']

  editedGraphHeight: number = 0
  graphHeight = 0

  editedCommonYshift: number = 100
  commonYshift: number = 100
  regXYLine = new RegExp(/.*[0-9.]+[ \t]+([0-9.]+)?/g)
  regTabSpace = new RegExp(/\s/)

  config: { showLink: boolean; plotlyServerURL: string; editable: boolean } = {
    showLink: true,
    plotlyServerURL: 'https://chart-studio.plotly.com',
    editable: true
  }

  temp: XRD = {
    rawX: [],
    rawY: [],
    x: [1, 2, 3, 4],
    y: [...Array(4).keys()].map(() => Math.random() * 10 + 10),
    shiftX: 0,
    shiftY: 0,
    name: 'sample1',
    mode: 'markers',
    type: 'scatter',
    yaxis: 'y',
    marker: {
      symbol: 'line-ns-open',
      size: 10,
      line: {
        width: 3
      }
    }
  }

  inputData: XRD[] = []

  @Watch('inputData', { deep: true })
  onInputData() {
    this.renderReact()
  }

  @Watch('graphTitle')
  onGraphTitle() {
    this.renderReact()
  }

  // @Watch('commonYshift')
  // onCommonYshift() {
  //   this.handleStdz()
  //   this.renderReact()
  // }

  mounted() {
    this.graphWidth = Number(localStorage.getItem('graphWidth'))
    this.graphHeight = Number(localStorage.getItem('graphHeight'))
    this.renderReact()
  }

  // 入力されたファイルを変換する
  handleInputFile(fileList: FileList) {
    // @ts-ignore
    for (const item of fileList) {
      // eslint-disable-next-line
      console.log(item.name)
      const reader = new FileReader()
      reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100
          // eslint-disable-next-line
          console.log(`Progress: ${Math.round(percent)}`)
        }
      })
      reader.readAsText(item)
      reader.onload = (e: any) => {
        const xrd = this.handleInputFileData(item.name, e.target.result)
        if (xrd.name === 'sample1') return false
        this.inputData.push(xrd)
        this.handleStdz()
        this.renderReact()
      }
    }
  }

  handleInputFileData(fileName: string, fileText: string): XRD {
    const sampleName = /.*sample(.*)\n?/i.test(fileText) ? RegExp.$1 : fileName
    // @ts-ignore
    const countList: [] = fileText.match(this.regXYLine)
    // FIXME: ちゃんとエラーの処理をする
    if (countList.length < 3) return this.temp
    const xyData = countList.map((count: string) =>
      count.split(this.regTabSpace).map(Number)
    )
    const rawX = xyData.map((i) => i[0])
    const rawInt = xyData.map((i) => i[1])

    return {
      rawX,
      rawY: rawInt,
      x: rawX,
      y: [],
      shiftX: 0,
      shiftY: this.commonYshift,
      name: sampleName.trim(),
      mode: 'lines',
      type: 'scatter',
      yaxis: 'y',
      marker: {
        symbol: 'line-ns-open',
        size: 10,
        line: {
          width: 3
        }
      }
    }
  }

  resetOffcet() {
    return this.inputData.map((xrd: XRD) => {
      return { ...xrd, x: xrd.rawX, y: xrd.rawY }
    })
  }

  handleStdz() {
    if (this.inputData.length === 1)
      return (this.inputData = this.resetOffcet())

    this.inputData = this.inputData.map((xrd, index) => {
      // int最大値
      const maxInt = this.maxIntData(xrd.rawY)

      return {
        ...xrd,
        x: xrd.rawX.map((theta) => theta + xrd.shiftX),
        y: xrd.rawY.map(
          (int) => (int / maxInt) * 100 + index * this.commonYshift
        )
      }
    })
  }

  maxIntData(dta: number[]): number {
    return dta.reduce((prev, current) => (prev > current ? prev : current))
  }

  deleteXrdData(index: number) {
    this.inputData.splice(index, 1)
    this.handleStdz()
    this.renderReact()
  }

  renderReact() {
    Plotly.react(
      // @ts-ignore
      this.$refs.xrd,
      this.inputData,
      {
        ...xrdLayout,
        title: this.graphTitle || xrdLayout.title,
        width: this.graphWidth || null,
        height: this.graphHeight || null
      },
      this.config
    )
  }

  closeSettings() {
    this.dialog = false
  }

  saveSettings() {
    if (this.commonYshift !== this.editedCommonYshift) this.handleStdz()
    this.graphWidth = this.editedGraphWidth
    localStorage.setItem('graphWidth', String(this.editedGraphWidth))
    this.graphHeight = this.editedGraphHeight
    localStorage.setItem('graphHeight', String(this.editedGraphHeight))
    this.renderReact()
    this.dialog = false
  }

  changeSecondaryAxis(index: number) {
    this.inputData[index].yaxis !== 'y'
      ? (this.inputData[index].yaxis = 'y')
      : (this.inputData[index].yaxis = 'y2')
  }

  changeScatter(index: number) {
    this.inputData[index].mode !== 'lines'
      ? (this.inputData[index].mode = 'lines')
      : (this.inputData[index].mode = 'markers')
  }
}
</script>

<style scoped>
.databar {
  height: 80vh;
  overflow: auto;
}
</style>
