// packageA/pages/test/test.js
import uCharts from '../../../components/ucharts/ucharts.js';
var _self;
var canvaColumn = null;
var canvaLineA = null;
var canvaCandle = null;
var canvaRadar = null;
Page({
  data: {
    cWidth: '',
    cHeight: '',
  },
  onLoad: function () {
    _self=this;
    this.cWidth = wx.getSystemInfoSync().windowWidth;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.getServerData();
  },
  getServerData: function() {
    wx.request({
      url: 'https://www.ucharts.cn/data.json',
      data: {
      },
      success: function (res) {
        console.log(res.data.data)
        let Column = { categories: [], series: [] };
        Column.categories = res.data.data.ColumnB.categories;
        Column.series = res.data.data.ColumnB.series;
        //自定义标签颜色和字体大小
        Column.series[1].textColor = 'red';
        Column.series[1].textSize = 18;
        let LineA = { categories: [], series: [] };
        //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
        LineA.categories = res.data.data.LineA.categories;
        LineA.series = res.data.data.LineA.series;
        let Candle = {categories: [],series: []};
        //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
        Candle.categories = res.data.data.Candle.categories;
        Candle.series = res.data.data.Candle.series;
        _self.showColumn("canvasColumn", Column);
        _self.showLineA("canvasLineA", LineA);
        _self.showCandle("canvasCandle", Candle);

        let data3 = {
          "categories": [
            "维度1",
            "维度2",
            "维度3",
            "维度4",
            "维度5",
            "维度6"
          ],
          "series": [
            {
              "name": "成交量1",
              "data": [
                90,
                110,
                165,
                195,
                187,
                172
              ]
            },
            {
              "name": "成交量2",
              "data": [
                190,
                210,
                105,
                35,
                27,
                102
              ]
            }
          ]
        }
        _self.showRadar("canvasRadar", data3);
      },
      fail: () => {
        console.log("请点击右上角【详情】，启用不校验合法域名");
      },
    });
  },
  showColumn(canvasId, chartData) {
    let ctx = wx.createCanvasContext(canvasId, this);
    canvaColumn = new uCharts({
      type: 'column',
      context: ctx,
      legend: true,
      fontSize: 11,
      background: '#FFFFFF',
      pixelRatio: 1,
      animation: true,
      categories: chartData.categories,
      series: chartData.series,
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        //disabled:true
      },
      dataLabel: true,
      width: _self.cWidth ,
      height: _self.cHeight ,
      extra: {
        column: {
          type: 'group',
          width: _self.cWidth * 0.45 / chartData.categories.length
        }
      }
    });

  },
  showRadar(canvasId, chartData) {
    let ctx = wx.createCanvasContext(canvasId, this);
    canvaRadar = new uCharts({
      type: 'radar',
      context: ctx,
      color: [
        "#1890FF",
        "#91CB74",
        "#FAC858",
        "#EE6666",
        "#73C0DE",
        "#3CA272",
        "#FC8452",
        "#9A60B4",
        "#ea7ccc"
      ],
      padding: [
        5,
        5,
        5,
        5
      ],
      legend: {
        "show": true,
        "position": "right",
        "float": "center",
        "padding": 5,
        "margin": 5,
        "backgroundColor": "rgba(0,0,0,0)",
        "borderColor": "rgba(0,0,0,0)",
        "borderWidth": 0,
        "fontSize": 13,
        "fontColor": "#666666",
        "lineHeight": 25,
        "hiddenColor": "#CECECE",
        "itemGap": 10
      },
      fontSize: 11,
      background: '#FFFFFF',
      pixelRatio: 1,
      animation: true,
      categories: chartData.categories,
      series: chartData.series,
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        //disabled:true
      },
      dataLabel: true,
      width: _self.cWidth ,
      height: _self.cHeight ,
      extra: {

        "radar": {
          "gridType": "radar",
          "gridColor": "#CCCCCC",
          "gridCount": 3,
          "labelColor": "#666666",
          "opacity": 0.2,
          "border": false,
          "borderWidth": 2,
          "max": 200
        },
        "tooltip": {
          "showBox": true,
          "showArrow": true,
          "showCategory": false,
          "borderWidth": 0,
          "borderRadius": 0,
          "borderColor": "#000000",
          "borderOpacity": 0.7,
          "bgColor": "#000000",
          "bgOpacity": 0.7,
          "gridType": "solid",
          "dashLength": 4,
          "gridColor": "#CCCCCC",
          "fontColor": "#FFFFFF",
          "splitLine": true,
          "horizentalLine": false,
          "xAxisLabel": false,
          "yAxisLabel": false,
          "labelBgColor": "#FFFFFF",
          "labelBgOpacity": 0.7,
          "labelFontColor": "#666666"
        }
      }
    });

  },
  touchColumn(e) {
    canvaColumn.showToolTip(e, {
      formatter: function (item, category) {
        if (typeof item.data === 'object') {
          return category + ' ' + item.name + ':' + item.data.value
        } else {
          return category + ' ' + item.name + ':' + item.data
        }
      }
    });
  },
  showLineA(canvasId, chartData) {
    let ctx = wx.createCanvasContext(canvasId, this);
    canvaLineA = new uCharts({
      type: 'line',
      context: ctx,
      fontSize: 11,
      legend: true,
      dataLabel: true,
      dataPointShape: true,
      background: '#FFFFFF',
      pixelRatio: 1,
      categories: chartData.categories,
      series: chartData.series,
      animation: true,
      enableScroll: true,//开启图表拖拽功能
      xAxis: {
        disableGrid: false,
        type: 'grid',
        gridType: 'dash',
        itemCount: 4,
        scrollShow: true,
        scrollAlign: 'left',
        //scrollBackgroundColor:'#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
        //scrollColor:'#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
      },
      yAxis: {
        //disabled:true
        gridType: 'dash',
        splitNumber: 8,
        min: 10,
        max: 180,
        formatter: (val) => { return val.toFixed(0) + '元' }//如不写此方法，Y轴刻度默认保留两位小数
      },
      width: _self.cWidth,
      height: _self.cHeight,
      extra: {
        line: {
          type: 'straight'
        }
      },
    });

  },
  touchLineA(e) {
    canvaLineA.scrollStart(e);
  },
  moveLineA(e) {
    canvaLineA.scroll(e);
  },
  touchEndLineA(e) {
    canvaLineA.scrollEnd(e);
    //下面是toolTip事件，如果滚动后不需要显示，可不填写
    canvaLineA.showToolTip(e, {
      formatter: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  showCandle(canvasId, chartData) {
    let ctx = wx.createCanvasContext(canvasId, this);
    canvaCandle = new uCharts({
      type: 'candle',
      context: ctx,
      fontSize: 11,
      legend: true,
      background: '#FFFFFF',
      pixelRatio: 1,
      categories: chartData.categories,
      series: chartData.series,
      animation: true,
      enableScroll: true,
      xAxis: {
        disableGrid: true,
        itemCount: 20,
        scrollShow: true,
        scrollAlign: 'right',
        labelCount:4,
      },
      yAxis: {
        //disabled:true
        gridType: 'dash',
        splitNumber: 5,
        formatter: (val) => {
          return val.toFixed(0)
        }
      },
      width: _self.cWidth,
      height: _self.cHeight,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        candle: {
          color: {
            upLine: '#f04864',
            upFill: '#f04864',
            downLine: '#2fc25b',
            downFill: '#2fc25b'
          },
          average: {
            show: true,
            name: ['MA5', 'MA10', 'MA30'],
            day: [5, 10, 30],
            color: ['#1890ff', '#2fc25b', '#facc14']
          }
        },
        tooltip: {
          bgColor: '#000000',
          bgOpacity: 0.7,
          gridType: 'dash',
          dashLength: 5,
          gridColor: '#1890ff',
          fontColor: '#FFFFFF',
          horizentalLine: true,
          xAxisLabel: true,
          yAxisLabel: true,
          labelBgColor: '#DFE8FF',
          labelBgOpacity: 0.95,
          labelAlign: 'left',
          labelFontColor: '#666666'
        }
      },
    });

  },
  touchCandle(e) {
    canvaCandle.scrollStart(e);
  },
  moveCandle(e) {
    canvaCandle.scroll(e);
  },
  touchEndCandle(e) {
    canvaCandle.scrollEnd(e);
    //下面是toolTip事件，如果滚动后不需要显示，可不填写
    canvaCandle.showToolTip(e, {
      formatter: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
})
