export interface PlotData {
  Al: number
  Pd: number
  TM: number
  label: string
}

const ternalyData: PlotData[] = [
  { Al: 72.2, TM: 13.9, Pd: 13.9, label: 'P40<->C' },
  // { Al: 71.4, TM: 11.9, Pd: 16.7, label: 'P40 calc.' },
  { Al: 72.0, TM: 11.6, Pd: 16.4, label: 'P40 obs.' },
  // { Al: 71.0, TM: 10, Pd: 19, label: '1/2 obs..' },

  // Al-Pd-Fe S.Balanetskyy
  { Al: 72.8, TM: 12.9, Pd: 14.3, label: 'Al-Pd-Fe C' },
  // { Al: 68.2, TM: 10.4, Pd: 21.4, label: 'Al-Pd-Fe C1' },
  // { Al: 63, TM: 5.7, Pd: 31.3, label: 'Al-Pd-Fe C2' },

  // { Al: 67.2, TM: 8.4, Pd: 24.4, label: 'P20 epma' },
  // { Al: 70.0, TM: 7.7, Pd: 22.3, label: 'P20 ref.' },
  // { Al: 70.0, TM: 9.0, Pd: 21.0, label: 'P20' },

  // Tsai Al-Pd-Fe system
  // { Al: 70, TM: 20, Pd: 10, label: 'tsai I phase' },
  // { Al: 72, TM: 3, Pd: 25, label: 'tsai D phase' },
  // { Al: 70, TM: 20, Pd: 10, label: 'tsai 1/2 phase' },
  // { Al: 75, TM: 5, Pd: 20, label: 'tsai D + FCi' },
  // { Al: 75, TM: 10, Pd: 15, label: 'tsai D phase' },
  // { Al: 75, TM: 15, Pd: 10, label: 'tsai D phase' }

  // 実験データ
  // { Al: 72.36, TM: 11.97, Pd: 15.67, label: 'x = 0' },
  // { Al: 71.26, TM: 12.21, Pd: 16.53, label: 'x = 10' },
  // { Al: 70.44, TM: 12.84, Pd: 16.72, label: 'x= 15' },
  // { Al: 71.95, TM: 12.49, Pd: 15.56, label: 'x= 20' },
  // { Al: 70.4, TM: 14.9, Pd: 14.7, label: 'C1 epma' },
  { Al: 70.8, TM: 12.2, Pd: 17.0, label: 'N13 48h' },
  { Al: 73.2, TM: 3.2, Pd: 23.6, label: 'N13 120h' }
]

export default ternalyData
