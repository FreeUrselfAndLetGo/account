// pages/list/list.js
const app = getApp()

Page({
  data: {
    typearray: app.globalData.typearray,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const list = wx.getStorageSync('cashflow') || []
    this.setData({
      list: list,
    })
  },
})