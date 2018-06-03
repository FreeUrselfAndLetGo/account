//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
var list = []
var account = {}

Page({
  data: {
    SideBarHidden: true,
    sum: 0,
    upperlimit: '',
    showSettingModal: false,
    dataArray: app.globalData.datearray,
    dateindex: 0,
  },
  onLoad: function () {
    console.log('onLoad')
    list = wx.getStorageSync('cashflow') || []
    account = wx.getStorageSync('account') || {}
    this.setData({
      upperlimit: wx.getStorageSync('upperlimit') || '', // 读取上限值
      showSettingModal: this.upperlimit === ''
    })
  },

  // 监听页面显示
  onShow: function () {
    this.setData({
      SideBarHidden: true,
    })
    list = wx.getStorageSync('cashflow') || []
    account = wx.getStorageSync('account') || {}
    this.refreshSum()
  },

  refreshSum: function () {
    //更新当前月份开销和
    var d = new Date()
    var year = d.getFullYear().toString()
    var month = (d.getMonth() + 1).toString()
    month = month[1] ? month : '0' + month
    const key = year + month
    // 获取当前
    this.setData({
      sum: account[key],
    })
  },

  showSideBar: function (e) {
    this.setData({
      SideBarHidden: !this.data.SideBarHidden, // 出现侧边栏
    })
  },

  contactUs: function (e) {
    wx.showModal({
      title: '联系我们',
      content: 'FreeUrselfAndLetGo',

    })
  },

  setting: function (e) {
    this.setData({
      showSettingModal: true,
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.setStorageSync('upperlimit', e.detail.value.upperlimit)
    wx.setStorageSync('start', e.detail.value.start)
    this.setData({
      upperlimit: e.detail.value.upperlimit, // 修改上限值
      showSettingModal: false,
    })
  },

  preventTouchMove: function (e) {},

  hideSetting: function (e) {
    this.setData({
      showSettingModal: false,
    })
  },

  bindDateChange: function (e) {
    
  }
})
