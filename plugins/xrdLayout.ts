const xrdLayout = {
  title: '',
  // width: 600,
  // height: 400,
  autosize: true,
  xaxis: {
    range: [20, 90],
    ticks: 'inside',
    title: '2-Theta / 2θ',
    mirror: 'ticks',
    showgrid: false,
    showline: true,
    tickfont: {
      size: 18,
      color: 'black',
      family: 'Arial-Black, serif'
    },
    zeroline: true,
    linewidth: 4,
    tickwidth: 4,
    titlefont: {
      size: 22,
      color: 'black',
      family: 'Arial-Black, sans-serif'
    }
  },
  yaxis: {
    ticks: 'inside',
    title: 'Intensity / arb.unit',
    mirror: 'ticks',
    showgrid: false,
    showline: true,
    tickfont: {
      size: 18,
      color: 'black',
      family: 'Arial-Black, serif'
    },
    zeroline: true,
    autorange: true,
    linewidth: 4,
    tickwidth: 4,
    titlefont: {
      size: 22,
      color: 'black',
      family: 'Arial-Black, sans-serif'
    },
    showticklabels: false
  },
  yaxis2: {
    title: 'yaxis2 title',
    titlefont: { color: 'rgb(148, 103, 189)' },
    tickfont: { color: 'rgb(148, 103, 189)' },
    overlaying: 'y',
    side: 'right'
  },
  legend: {
    x: 0.55,
    y: 1,
    font: {
      size: 16
    },
    traceorder: 'reversed'
  },
  margin: {
    b: 60,
    l: 40,
    r: 20,
    t: 30,
    pad: 0
  },
  titlefont: {
    size: 16
  }
}

export default xrdLayout
