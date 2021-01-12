/**
 * @argument title 状態図タイトル
 * @argument x 状態図リソース
 * @argument x 3元系状態図にぴったり重ねるためのoffcet
 * @argument y 3元系状態図にぴったり重ねるためのoffcet
 * @argument size 3元系状態図にぴったり重ねるためのoffcet
 */
export interface Select {
  title: string
  src: string
  x: number
  y: number
  size: number
}

const images: Select[] = [
  {
    title: '3元系状態図の選択',
    src: '',

    x: 0,
    y: 0,
    size: 0
  },
  {
    title: 'Al-Pd-Fe Liquidus Surface',
    src: '/diagrams/al_pd_fe_liquidus_surface.jpg',
    x: 0.038,
    y: 1.054,
    size: 1.21
  },
  {
    title: 'Al-Pd-Fe Solidus Surface',
    src: '/diagrams/al_pd_fe_solidus_surface.jpg',
    x: 0.047,
    y: 1.062,
    size: 1.22
  },
  {
    title: 'Al-Pd-Fe 900-1020C Partial Isothermal Section',
    src: '/diagrams/al_pd_fe_900-1020.png',
    x: 0.061,
    y: 0.633,
    size: 0.92
  },
  {
    title: 'Al-Pd-Fe 1020C Partial Isothermal Section',
    src: '/diagrams/al_pd_fe_1020.jpg',
    x: 0.033,
    y: 0.637,
    size: 0.94
  },
  {
    title: 'Al-Pd-Fe 995C Partial Isothermal Section',
    src: '/diagrams/al_pd_fe_995.jpg',
    x: 0.052,
    y: 0.63,
    size: 0.93
  },
  {
    title: 'Al-Pd-Fe 975C Partial Isothermal Section',
    src: '/diagrams/al_pd_fe_975.jpg',
    x: 0.059,
    y: 0.637,
    size: 0.93
  },
  {
    title: 'Al-Pd-Fe 900C Partial Isothermal Section',
    src: '/diagrams/al_pd_fe_900.jpg',
    x: 0.033,
    y: 0.651,
    size: 1.02
  },
  {
    title: 'Al-Pd-Ru 1100C Partial Isothermal Section',
    src: '/diagrams/al_pd_ru_1100.jpg',
    x: 0.066,
    y: 0.769,
    size: 0.87
  },
  {
    title: 'Al-Pd-Ru 1050C Partial Isothermal Section',
    src: '/diagrams/al_pd_ru_1050.jpg',
    x: 0.063,
    y: 0.755,
    size: 0.86
  },
  {
    title: 'Al-Pd-Ru 1000C Partial Isothermal Section',
    src: '/diagrams/al_pd_ru_1000.jpg',
    x: 0.063,
    y: 0.755,
    size: 0.86
  },
  {
    title: 'Al-Pd-Ru 900C Partial Isothermal Section',
    src: '/diagrams/al_pd_ru_900.jpg',
    x: 0.066,
    y: 0.761,
    size: 0.89
  },
  {
    title: 'Al-Pd-Ru 790C Partial Isothermal Section',
    src: '/diagrams/al_pd_ru_790.jpg',
    x: 0.068,
    y: 0.766,
    size: 0.88
  }
]

export default images
