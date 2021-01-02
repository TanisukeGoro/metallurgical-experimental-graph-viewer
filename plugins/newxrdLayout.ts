const xrdLayout = {
  title: {
    text: '',
    font: {
      size: 24,
      color: 'black',
      family: 'Times New Roman, serif'
    },
    x: 0.5,
    xanchor: 'center'
  },
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
    automargin: true,
    tickfont: {
      size: 24,
      color: 'black',
      family: 'Times New Roman, serif'
    },
    y: 0.5,
    zeroline: true,
    linewidth: 2,
    tickwidth: 2,
    titlefont: {
      size: 30,
      color: 'black',
      family: 'Times New Roman, sans-serif'
    }
  },
  yaxis: {
    ticks: 'inside',
    title: 'Intensity / arb.unit',
    mirror: 'ticks',
    showgrid: false,
    showline: true,
    automargin: true,
    tickfont: {
      size: 24,
      color: 'black',
      family: 'Times New Roman, serif'
    },
    zeroline: false,
    autorange: true,
    linewidth: 2,
    tickwidth: 2,
    titlefont: {
      size: 30,
      color: 'black',
      family: 'Times New Roman, sans-serif'
    },
    showticklabels: false
  },
  yaxis2: {
    title: '',
    overlaying: 'y',
    side: 'right',
    showticklabels: false,
    zeroline: false,
    showgrid: false
  },
  showlegend: true,
  legend: {
    x: 0.55,
    y: 1,
    font: {
      size: 16,
      family: 'Times New Roman, sans-serif'
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
