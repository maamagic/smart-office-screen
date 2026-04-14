export const echartsTheme = {
  color: ['#00d4ff', '#00ff88', '#a855f7', '#ffa502', '#ff6b81', '#36d399', '#4a90d9', '#ffdd57'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#8899aa',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
  },
  title: {
    textStyle: {
      color: '#e0e8f0',
      fontSize: 14,
    },
    subtextStyle: {
      color: '#8899aa',
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: 'circle',
    smooth: true,
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      borderRadius: [2, 2, 0, 0],
    },
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11,
    },
    splitLine: {
      show: false,
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.05)',
      },
    },
  },
  tooltip: {
    backgroundColor: 'rgba(10, 22, 40, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderWidth: 1,
    textStyle: {
      color: '#e0e8f0',
      fontSize: 12,
    },
    extraCssText: 'border-radius: 4px; backdrop-filter: blur(10px);',
  },
  legend: {
    textStyle: {
      color: '#8899aa',
      fontSize: 11,
    },
  },
}
