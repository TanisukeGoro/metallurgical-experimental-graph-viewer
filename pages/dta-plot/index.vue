<template>
  <v-app>
    <file-drop class="mb-2" @files-selected="logFiles"></file-drop>
    <v-card flat outlined>
      <v-card-title primary-title>{{ fileName }}</v-card-title>
      <v-card-text> 最高温度: {{ dtaMaxTmp }} </v-card-text>
      <v-card-actions>
        <v-btn :loading="isLoading" @click="copyExperimentalData()"
          >実験概要のコピー</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-container grid-list-md>
      <v-text-field v-model="minTemp" label="最小温度"></v-text-field>
      <v-text-field v-model="maxTemp" label="最大温度"></v-text-field>
      <v-row>
        <v-col md="6"
          ><v-data-table :headers="headers" :items="risingFlow">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>昇温側</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn :loading="isLoading" @click="copyAsCSV(risingFlow)"
                  >toCSVコピー</v-btn
                >
              </v-toolbar>
            </template>
          </v-data-table></v-col
        >
        <v-col md="6"
          ><v-data-table :headers="headers" :items="downFlow">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>降温側</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn :loading="isLoading" @click="copyAsCSV(downFlow)"
                  >toCSVコピー</v-btn
                >
              </v-toolbar>
            </template></v-data-table
          ></v-col
        >
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
// components
import FileDrop from '@/components/FileDrop.vue'
Component.registerHooks(['beforeRouteEnter'])

interface DTA {
  tag: string
  time: number
  temp: number
  tg: number
  dta: number
  ddta: number
}

const defaultDTA = [{ tag: '', time: 0, temp: 0, tg: 0, dta: 0, ddta: 0 }]

@Component({
  components: {
    FileDrop
  }
})
export default class App extends Vue {
  fileName: string = 'ファイル未入力'
  minTemp: number = 900
  maxTemp: number = 1200
  isLoading: boolean = false

  textContent: string = ''
  dtaData: DTA[] = defaultDTA
  risingFlow: DTA[] = defaultDTA
  downFlow: DTA[] = defaultDTA

  headers: {
    text: string
    align: string
    sortable: boolean
    value: string
  }[] = [
    { text: 'Time(min)', align: 'end', sortable: true, value: 'time' },
    { text: 'Temp.(˚C)', align: 'end', sortable: true, value: 'temp' },
    { text: 'DTA(μV)', align: 'end', sortable: true, value: 'dta' },
    { text: 'TG(mg)', align: 'end', sortable: true, value: 'tg' }
  ]

  @Watch('textContent', { deep: true })
  onTextContent() {
    this.dtaData = this.parseCSV(this.textContent)
    const [_risingFlow, _downFlow] = this.splitByMaximum(this.dtaData)
    this.risingFlow = this.sectionByMin2Max(
      _risingFlow,
      this.minTemp,
      this.maxTemp
    )
    this.downFlow = this.sectionByMin2Max(_downFlow, this.minTemp, this.maxTemp)
  }

  get dtaMaxTmp() {
    return this.tempMaxData(this.dtaData).temp
  }

  copyExperimentalData() {}

  async copyAsCSV(dta: DTA[]) {
    this.isLoading = true
    await this.copyToClipboard(this.json2CSV(dta))
    return (this.isLoading = false)
  }

  copyToClipboard(text: string) {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }

  json2CSV(dta: DTA[]) {
    const header: string[] = Object.keys(dta[0])
    const body: string = dta
      .map((data: any) => header.map((key): string => data[key]).join(','))
      .join('\n')
    return header.join(',') + '\n' + body
  }

  sectionByMin2Max(dta: DTA[], min: number, max: number): DTA[] {
    return this.dropLessThanByTemp(this.dropMoreThanByTemp(dta, max), min)
  }

  dropLessThanByTemp(dta: DTA[], min: number): DTA[] {
    return dta.filter((data) => data.temp >= min)
  }

  dropMoreThanByTemp(dta: DTA[], max: number): DTA[] {
    return dta.filter((data) => data.temp <= max)
  }

  splitByMaximum(dta: DTA[]) {
    const max: DTA = this.tempMaxData(dta)
    const maximumIndex: number = dta.map((i) => i.temp).indexOf(max.temp)
    return [dta.slice(0, maximumIndex), dta.slice(maximumIndex)]
  }

  tempMaxData(dta: DTA[]) {
    return dta.reduce((prev, current) =>
      prev.temp > current.temp ? prev : current
    )
  }

  parseCSV(csvContent: string): DTA[] {
    // 改行コードの統一 正規表現がうまくいかないので一旦このまま
    // csvContent = csvContent.replace(/\r\n?/g, '\n')
    // csvContent = csvContent.replace(/^(?!.*#GD).*\n?/g, '')
    const csvLine: any[] = csvContent
      .split('\n')
      .filter((line) => line.split(',')[0] === '#GD')
    return csvLine.map((line) => {
      const csv: any[] = line.split(',')
      return {
        tag: String(csv[0]),
        time: Number(csv[1]),
        temp: Number(csv[2]),
        tg: Number(csv[3]),
        dta: Number(csv[4]),
        ddta: Number(csv[5])
      }
    })
    // #GD以外は排除する
  }

  /**
   * called from upload event
   */
  logFiles(fileList: FileList) {
    // @ts-ignore
    for (const item of fileList) {
      // eslint-disable-next-line
      console.log(item)
      this.fileName = item.name
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
        this.textContent = e.target.result
      }
    }
  }
}
</script>
