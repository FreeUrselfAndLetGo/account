// pages/detail/detail.js
const util = require('../../utils/util.js')
var curDate = util.curDate
// 获取应用实例
const app = getApp()
var list = []
var account = {}
var costCategory = {} // 按类别存储开销值
var nowCount = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    act: 'new',
    typearray: app.globalData.typearray,
    typeindex: 0,
    comment: '',
    date: '',
    index: 0, // 如果是修改的话 index对应修改的ID
    initdata: {}, // 如果是修改的话 initdata就是需要修改的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    // 生命周期函数--监听页面加载
    list = wx.getStorageSync('cashflow') || []
    account = wx.getStorageSync('account') || {}
    costCategory = wx.getStorageSync('costCategory') || {}
    nowCount = wx.getStorageSync('nowCount') || 0

    if (params.act === 'new') {
      var curdate = curDate(new Date())
      this.setData({
        act: 'new',
        date: curdate[0],
      })
    } else {
      const nowLog = list[params.index]
      this.setData({
        act: 'edit',
        typeindex: nowLog.typeindex || 0,
        comment: nowLog.comment,
        cost: nowLog.cost,
        date: nowLog.date,
        inidata: nowLog,
        index: params.index,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    list = wx.getStorageSync('cashflow') || []
    account = wx.getStorageSync('account') || {}
    costCategory = wx.getStorageSync('costCategory') || {}
    nowCount = wx.getStorageSync('nowCount') || 0
  },

  bindTypeArrayChange: function (e) {
    this.setData({
      typeindex: e.detail.value
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  formSubmit: function (e) {
    if (this.data.act === 'new') {
      list.push( // 消费记录
        {
          comment: e.detail.value.detail,
          cost: parseFloat(e.detail.value.cost || '0'),
          date: e.detail.value.date,
          typeindex: parseInt(e.detail.value.typeindex),
        }
      )
      const tmp = e.detail.value.date.split('-') // 获取年份+月份作为键值
      const key = tmp[0] + tmp[1]
      const costTmp = parseFloat(e.detail.value.cost || 0)

      if (account.hasOwnProperty(key)) { // 如果已经记录过当月，则加上消费，若无则赋值为当月
        account[key] += costTmp
      } else {
        account[key] = costTmp
      }

      const key1 = e.detail.value.typeindex
      if (costCategory.hasOwnProperty(key1)) { // 如果已经记录过这种类型，则加上消费，若无则赋值为当月
        costCategory[key1] += costTmp
      } else {
        costCategory[key1] = costTmp
      }

      // 判断是否是当月
      nowCount += costTmp // 更新已花费金额      
    } else {
      var tmp = list[this.data.index].date.split('-')
      var key = tmp[0] + tmp[1]
      account[key] -= list[this.data.index].cost // 先在修改前的月份减去修改前的值
      costCategory[list[this.data.index].typeindex] -= list[this.data.index].cost // 先减去当前开销的值

      tmp = e.detail.value.date.split('-')
      key = tmp[0] + tmp[1]

      if (account.hasOwnProperty(key)) { // 再在修改后的月份加上修改后的值
        account[key] += parseFloat(e.detail.value.cost || '0')
      } else {
        account[key] = parseFloat(e.detail.value.cost || '0')
      }

      key = e.detail.value.typeindex
      if (costCategory.hasOwnProperty(key)) { // 如果已经记录过这种类型，则加上消费，若无则赋值为当月
        costCategory[key] += parseFloat(e.detail.value.cost || '0')
      } else {
        costCategory[key] = parseFloat(e.detail.value.cost || '0')
      }

      list[this.data.index] = {
        comment: e.detail.value.detail,
        cost: parseFloat(e.detail.value.cost),
        date: e.detail.value.date,
        typeindex: parseInt(e.detail.value.typeindex),
      }
    }
    list.sort(function (a, b) {
      var d1 = new Date(a.date.replace(/-/g, '/'))
      var d2 = new Date(b.date.replace(/-/g, '/'))
      return d1 - d2
    })
    wx.setStorageSync('cashflow', list)
    wx.setStorageSync('account', account)
    wx.setStorageSync('costCategory', costCategory)
    wx.setStorageSync('nowCount', nowCount)
    wx.navigateBack({
      delta: 1 // 返回上一级页面
    })
  },

  formReset: function (e) {
    if (this.data.act === 'new') {
      var curdate = curDate(new Date())
      this.setData({
        date: curdate[0],
      })
    } else {
      const info = this.data.inidata
      this.setData({
        typeindex: info.typeindex || 0,
        comment: info.comment,
        date: info.date,
        cost: info.cost,
      })
    }
  },
})