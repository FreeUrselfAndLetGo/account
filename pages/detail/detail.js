// pages/detail/detail.js
const util = require('../../utils/util.js')
var curDate = util.curDate
//获取应用实例
const app = getApp()
var list = []
var account = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    act: 'new',
    typearray: app.globalData.typearray,
    typeindex: 0,
    comment: '',
    data: '2016-09-01',
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
    if (params.act === 'new') {
      var curdate = curDate(new Date())
      this.setData({
        act: 'new',
        date: curdate[0],
      })
    } else {
      console.log(params, list.length)
      // const nowLog = list[parseInt(params.index)]
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
  },

  bindTypeArrayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
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
      if (account.hasOwnProperty(key)) { // 如果已经记录过当月，则加上消费，若无则赋值为当月
        account[key] += parseFloat(e.detail.value.cost || '0')
      } else {
        account[key] = parseFloat(e.detail.value.cost || '0')
      }
    } else {
      var tmp = list[this.data.index].date.split('-')
      var key = tmp[0] + tmp[1]
      account[key] -= list[this.data.index].cost // 先在修改前的月份减去修改前的值
      tmp = e.detail.value.date.split('-')
      key = tmp[0] + tmp[1]
      if (account.hasOwnProperty(key)) { // 再在修改后的月份加上修改后的值
        account[key] += parseFloat(e.detail.value.cost || '0')
      } else {
        account[key] = parseFloat(e.detail.value.cost || '0')
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
    wx.navigateBack({
      delta: 1 // 返回上一级页面
    })
    console.log(list)
    console.log(account)
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
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