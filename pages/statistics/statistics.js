// pages/statistics/statistics.js
const app = getApp()
var wxCharts = require('../../utils/wxcharts.js');
const util = require('../../utils/util.js')
var pieChart = null;
var lineChart = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: {},
    upperlimit: 3,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const account = wx.getStorageSync('account') || {}
    const upperlimit = wx.getStorageSync('upperlimit')
    this.setData({
      account: account,
      upperlimit: upperlimit,
    })
    console.log(account)
  },

  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },
  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    const account = wx.getStorageSync('account') || {}
    const upperlimit = wx.getStorageSync('upperlimit') || 1.5
    this.setData({
      account: account,
      upperlimit: upperlimit,
    })
    //饼图部分
    var piepartname = app.globalData.typearray;
    var seriespie = [];
    const costCategory = wx.getStorageSync('costCategory') || {}

    for (var i in costCategory) {
      var tempdata = costCategory[i];;
      //获取到的购物信息数
      seriespie.push({
        name: piepartname[i],
        data: tempdata,
      })
    }
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: seriespie,
      width: windowWidth,
      height: 250,
      dataLabel: true,
    });

    //折线图部分
    var simulationData = {};
    var categories = [];
    var data = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      var year = d.getFullYear();
      var month = (d.getMonth() + 1 - i);
      if (month <= 0) {
        month = (12 - month).toString();
        year = (year - 1).toString();
      }
      month = month[1] ? month : '0' + month;
      var key = year + '-' + month;
      categories.push(key);
      var tempdata = 0;
      key = year + month;
      //获取数据
      if (account[key]) {
        tempdata = account[key] / 1000;
      }
      data.push(tempdata);
    }
    // data[4] = null;
    simulationData = {
      categories: categories,
      data: data
    }
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '历史消费记录',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '千';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '消费金额 (千元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 250,
      dataLabel: false,
      dataPointShape: true,
    });
  }
})


