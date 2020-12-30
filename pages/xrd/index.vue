<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col md="4" class="databar">
          <v-card class="pa-2" outlined tile>
            <v-card-actions>
              <v-row>
                <v-col md="4"
                  ><v-text-field
                    v-model="minThetaRange"
                    dense
                    label="低角側 [2θ]"
                  ></v-text-field
                ></v-col>
                <v-col md="4"
                  ><v-text-field
                    v-model="maxThetaRange"
                    dense
                    label="高角側 [2θ]"
                  ></v-text-field
                ></v-col>
                <v-col md="4">
                  <v-btn tile outlined color="success" @click="updateGraph()">
                    <v-icon left>mdi-cached</v-icon>更新
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-actions>
              <!-- =============== ダイアログ=================== -->
              <v-dialog v-model="dialog" max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mr-1"
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

              <v-btn
                color="primary"
                outlined
                class="mr-1"
                @click="
                  inputData = []
                  renderReact()
                "
                >クリア</v-btn
              >
              <v-switch v-model="isLegend" label="凡例のON/OFF" />
            </v-card-actions>
            <v-card-actions>
              <!-- FIXME: 旧レイアウトの削除 -->
              <v-btn
                color="primary"
                outlined
                class="mr-1"
                @click="saveGraphData()"
                >グラフデータ保存</v-btn
              >
              <v-switch v-model="layoutflag" label="旧レイアウト" />
            </v-card-actions>
            <v-card-text>
              テスト版ですが、平滑化用のアルゴリズムを実装しました。<v-icon>mdi-chart-bell-curve-cumulative</v-icon>アイコンで一応できるはず。境界条件やエラー処理書いてないのでバグりやすいので注意
            </v-card-text>

            <!-- =============== ダイアログ=================== -->
          </v-card>
          <draggable
            :disabled="false"
            :list="inputData"
            ghost-class="ghost"
            handle=".handle"
            @start="dragging = true"
            @end="
              dragging = false
              handleStdz({ x: false, y: true })
              renderReact()
            "
          >
            <v-card
              v-for="(xrd, index) in inputData"
              :key="index"
              class="pa-2"
              outlined
              tile
            >
              <v-card class="mb-2" outlined tile>
                <v-card-text class="pb-0">
                  <v-text-field
                    v-model="xrd.name"
                    dense
                    label="試料名"
                    @change="updatePlots"
                  >
                    <template v-slot:prepend>
                      <v-icon color="gray darken-2" class="handle">
                        mdi-view-headline
                      </v-icon>
                    </template></v-text-field
                  >

                  <v-row>
                    <v-col md="6" class="py-0">
                      <v-text-field
                        v-model="xrd.shiftX"
                        dense
                        label="x-shift [2θ]"
                        @change="updatePlots"
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
                  <v-btn small icon @click="smoozing(index)">
                    <v-icon>mdi-chart-bell-curve-cumulative</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </draggable>
        </v-col>
        <v-col md="8">
          <file-drop class="mb-2" @files-selected="handleInputFile">
            <v-card id="plotarea" class="pa-2" outlined tile max-height="800">
              <v-card-text v-if="inputData.length == 0">
                ここにファイルをドラック&ドロップでXRDデータを追加<br />
                グラフの保存、呼び出しも可能になりました。<br />
                jsonファイルをここにドラックして表示できます。
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
import draggable from 'vuedraggable'
import * as Plotly from 'plotly.js-dist'
import arialblockLayout from '@/plugins/newxrdLayout'
import timesLayout from '@/plugins/xrdLayout'
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

// x, yの規格化を行うか否かを指定
interface FixedStd {
  x: boolean
  y: boolean
}

@Component({
  components: {
    FileDrop,
    draggable
  }
})
export default class XrdPlot extends Vue {
  dragging: boolean = false
  xrdLayout = arialblockLayout
  layoutflag: boolean = false
  dialog = false
  graphTitle: string =
    'Al<sub>72.0</sub>Pd<sub>16.4</sub>(Ru<sub>(100-x)%</sub>, Fe<sub>x%</sub>)<sub>11.4</sub>'

  minThetaRange: number = 0
  maxThetaRange: number = 0

  editedGraphWidth: number = 0
  graphWidth = 0
  widthRule: any[] = [(v: any) => v <= 1000 || '最大1000pxまでです。']
  heightRule: any[] = [(v: any) => v <= 800 || '最大800pxまでです。']

  editedGraphHeight: number = 0
  graphHeight = 0

  editedCommonYshift: number = 100
  commonYshift: number = 100
  regXYLine = new RegExp(/.*[0-9.]+[ \t]+([0-9.]+)?/g)
  regTabSpace = new RegExp(/\s/)

  config: {
    showLink: boolean
    plotlyServerURL: string
    editable: boolean
    displaylogo: boolean
  } = {
    showLink: true,
    plotlyServerURL: 'https://chart-studio.plotly.com',
    editable: true,
    displaylogo: false
  }

  isLegend: boolean = true

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

  @Watch('graphTitle')
  onGraphTitle() {
    this.renderReact()
  }

  @Watch('isLegend')
  onIsLegend() {
    this.renderReact()
  }

  @Watch('layoutflag')
  onLayoutflag() {
    // @ts-ignore
    this.xrdLayout = this.layoutflag ? timesLayout : arialblockLayout
    this.renderReact()
  }

  mounted() {
    this.graphWidth = Number(localStorage.getItem('graphWidth'))
    this.graphHeight = Number(localStorage.getItem('graphHeight'))
    this.maxThetaRange = Number(localStorage.getItem('maxThetaRange'))
    this.minThetaRange = Number(localStorage.getItem('minThetaRange'))
    this.renderReact()
  }

  // 入力されたファイルを変換する
  handleInputFile(fileList: FileList) {
    // @ts-ignore
    for (const item of fileList) {
      // eslint-disable-next-line
      console.log(item)
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
        // 保存データの呼び出し
        if (item.name.split('.').pop() === 'json') {
          const jsonData = JSON.parse(e.target.result)
          this.inputData = jsonData.data as XRD[]
          this.inputData.map((i) => {
            return { ...i, yaxis: 'y' }
          })
          this.xrdLayout = { ...jsonData.layout, ...timesLayout }
          this.renderReact()
          return 0
        }
        const xrd = this.handleInputFileData(item.name, e.target.result)
        if (xrd.name === 'sample1') return false
        this.inputData.push(xrd)
        this.handleStdz({ x: false, y: true })
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
    const rawY = xyData.map((i) => i[1])

    return {
      rawX,
      rawY,
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
    this.inputData = this.inputData.map((xrd: XRD) => {
      return { ...xrd, x: xrd.rawX, y: xrd.rawY }
    })
    this.renderReact()
  }

  updatePlots() {
    this.handleStdz({ x: true, y: true })
    this.reactAsCurrentLayout()
  }

  reactAsCurrentLayout() {
    Plotly.react(
      this.$refs.xrd as Plotly.PlotlyHTMLElement,
      // @ts-ignore
      this.inputData,
      {
        // @ts-ignore
        ...this.$refs.xrd.layout
      },
      this.config
    )
  }

  smoozing(index: number) {
    const y = this.inputData[index].y
    console.log(y)
    this.inputData[index].y = y.map((_y, index): number => {
      let sum = 0
      if (index > 3) sum += -2 * y[index - 3]
      if (index > 2) sum += 3 * y[index - 2]
      if (index > 1) sum += 6 * y[index - 1]
      sum += -2 * _y
      if (index + 1 < y.length) sum += 6 * y[index + 1]
      if (index + 2 < y.length) sum += 3 * y[index + 2]
      if (index + 3 < y.length) sum += -2 * y[index + 3]
      return sum / 21
    })
    this.renderReact()
  }

  handleStdz(fixedstd: FixedStd) {
    if (this.inputData.length === 1) return this.resetOffcet()

    this.inputData = this.inputData.map((xrd, index) => {
      // int最大値
      const minIntoffset = Math.abs(this.minIntData(xrd.rawY))
      const maxInt = this.maxIntData(xrd.rawY) + minIntoffset

      return {
        ...xrd,
        x: fixedstd.x
          ? xrd.rawX.map((theta) => theta + Number(xrd.shiftX))
          : xrd.x, // xを更新しないならそのまま
        y: fixedstd.y
          ? xrd.rawY.map(
              (int) =>
                ((int + minIntoffset) / maxInt) * 100 +
                index * this.commonYshift
            )
          : xrd.y // Yを更新しないならそのまま
      }
    })
  }

  maxIntData(dta: number[]): number {
    return dta.reduce((prev, current) => (prev > current ? prev : current))
  }

  minIntData(dta: number[]): number {
    return dta.reduce((prev, current) => (prev < current ? prev : current))
  }

  deleteXrdData(index: number) {
    this.inputData.splice(index, 1)
    this.handleStdz({ x: false, y: true })
    this.renderReact()
  }

  renderReact() {
    Plotly.react(
      this.$refs.xrd as Plotly.PlotlyHTMLElement,
      // @ts-ignore
      this.inputData,
      {
        ...this.xrdLayout,
        title: {
          ...this.xrdLayout.title,
          text: this.graphTitle || this.xrdLayout.title
        },
        width: this.graphWidth || null,
        height: this.graphHeight || null,
        xaxis: {
          ...this.xrdLayout.xaxis,
          range:
            this.minThetaRange && this.maxThetaRange
              ? [this.minThetaRange, this.maxThetaRange]
              : this.xrdLayout.xaxis.range
        },
        showlegend: this.isLegend
      },
      this.config
    )
  }

  closeSettings() {
    this.dialog = false
  }

  saveSettings() {
    if (this.commonYshift !== this.editedCommonYshift)
      this.handleStdz({ x: false, y: true })

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
    this.renderReact()
  }

  changeScatter(index: number) {
    this.inputData[index].mode !== 'lines'
      ? (this.inputData[index].mode = 'lines')
      : (this.inputData[index].mode = 'markers')
    this.renderReact()
  }

  updateGraph() {
    localStorage.setItem('minThetaRange', String(this.minThetaRange))
    localStorage.setItem('maxThetaRange', String(this.maxThetaRange))
    this.renderReact()
  }

  saveGraphData() {
    const plotRef = document.getElementById('xrd')
    const downloadElement: HTMLAnchorElement = document.createElement('a')

    downloadElement.href = URL.createObjectURL(
      new Blob(
        // @ts-ignore
        [JSON.stringify({ data: plotRef?.data, layout: plotRef?.layout })],
        {
          type: 'text/plan'
        }
      )
    )
    downloadElement.download = 'plots-data.json'
    downloadElement.style.display = 'none'
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
  }
}
</script>

<style scoped>
.databar {
  height: 80vh;
  overflow: auto;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb !important;
}
.handle {
  cursor: move;
}
</style>
