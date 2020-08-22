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
