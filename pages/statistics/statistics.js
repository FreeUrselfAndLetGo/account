// pages/statistics/statistics.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: {},
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const account = wx.getStorageSync('account') || {}
    this.setData({
      account: account,
    })
    console.log(account)
  },
})