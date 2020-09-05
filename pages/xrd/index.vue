<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col md="4">
          <file-drop
            class="mb-2"
            title="XRDデータのアップロード"
            @files-selected="handleInputFile"
          >
            <v-card class="pa-2" outlined tile>
              <v-card-text v-if="inputData.length == 0">
                ファイルをドラック&ドロップで<br />XRDデータを追加
              </v-card-text>
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
                  <v-spacer></v-spacer>
                  <v-btn small icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn small icon @click="deleteXrdData(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </file-drop>
        </v-col>
        <v-col md="8">
          <v-card
            id="plotarea"
            class="pa-2"
            outlined
            tile
            max-width="1000"
            max-height="750"
          >
            <div id="xrd" ref="xrd"></div>
          </v-card>
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

  commonYshift: number = 100
  regXYLine = new RegExp(/.*[0-9.]+[ \t]+([0-9.]+)?/g)
  regTabSpace = new RegExp(/\s/)

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
    yaxis: 'y'
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

  @Watch('commonYshift')
  onCommonYshift() {
    this.handleStdz()
    this.renderReact()
  }

  mounted() {
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
      yaxis: 'y'
    }
  }

  // standardization(array: number[], shift: numebr, offset: numebr): number[] {
  //   return array.map((i) => i)
  // }

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
    // yのオフセット再計算
    this.renderReact()
  }

  renderReact() {
    // @ts-ignore
    Plotly.react(this.$refs.xrd, this.inputData, {
      ...xrdLayout,
      title: this.graphTitle || xrdLayout.title
      // width: 1000,
      // height: 750
    })
  }

  closeSettings() {
    this.dialog = false
  }

  saveSettings() {
    this.dialog = false
  }

  changeSecondaryAxis(index: number) {
    this.inputData[index].yaxis !== 'y'
      ? (this.inputData[index].yaxis = 'y')
      : (this.inputData[index].yaxis = 'y2')
  }
}
</script>
