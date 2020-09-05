<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center"></div>
      <v-card>
        <v-card-title class="headline">
          実験データをいい感じにするやつ
        </v-card-title>
        <v-card-text>
          <p>
            <nuxt-link to="xrd">XRD plot</nuxt-link
            >はXRDの実験データ(.TXT)を突っ込むといい感じにしてくれる
          </p>
          <p>
            <nuxt-link to="ternary-plot">Ternary plot</nuxt-link
            >は組成(Al-Pd-TM)を入力し、既存の状態図と比較するためのやつ
          </p>
          <p>
            <nuxt-link to="dta-plot"> DTA plot </nuxt-link
            >はDTAの実験データ(.csv)をいい感じにしてくれるやつ。<br />
            アスキー変換した後のファイルを`.csv`に変換して突っ込めばよろし。
            最小温度と最大温度でデータをカットしてくれる。
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {}
}
</script>
