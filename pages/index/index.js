//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
var list = []
var account = {}
var nowCount = 0
var pre = []

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
    map: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 这个数组是地图的状态 如果要调整数量就在这里调整
  },

  // 监听页面显示
  onShow: function () {
    this.setData({
      SideBarHidden: true,
      upperlimit: wx.getStorageSync('upperlimit') || '', // 读取上限值      
    })
    list = wx.getStorageSync('cashflow') || []
    account = wx.getStorageSync('account') || {}
    nowCount = wx.getStorageSync('nowCount') || 0
    pre = wx.getStorageSync('pre') || []
    const tmp = wx.getStorageSync('map') // 尝试获取地图信息 若有则赋值给地图
    if (tmp) { // 如果有缓存说明不是第一次进入app了
      this.setData({
        map: tmp,
      })
      this.refreshSum()
      this.refreshMap(nowCount)
    } else { // 如果没有缓存就写入缓存并表示是第一次进入app
      wx.setStorageSync('map', this.data.map)
    }
  },

  refreshMap: function (nowCount) {
    // 先检测还在不在当月，不在当月就直接刷新地图，在当月就检测要不要刷新地图
    const now = new Date()
    const next_month = new Date(pre[0], pre[1] + 1, pre[2])
    if (now > next_month) { // 已经到了下个月
      pre = [next_month.getFullYear(), next_month.getMonth() + 1, next_month.getDate()] // 更新日期为下一个月

      var tmp_map = [] // 对地图更新
      for (var i = 0; i < this.data.map.length; i++) {
        tmp_map[i] = this.data.map == 2 ? this.data.map : this.data.map + 1 // 地图恢复
      }
      this.setData({
        map: tmp_map,
      })
      wx.setStorageSync('map', this.data.map) // 写入缓存

      nowCount = 0 // 对当前月份开销更新
      wx.setStorageSync('nowCount', 0) // 写入缓存
    } else { // 如果还是当月 
      const tmp = this.data.upperlimit / this.data.map.length // 计算每一格代表的钱
      if (nowCount > tmp) { // 超限
        nowCount -= tmp
        wx.setStorageSync('nowCount', 0) // 写入缓存
        this.changeMap()//更新地图元素
      }
    }
  },

  changeMap: function () {
    var house_index = []
    var green_index = []
    var house_count = 0
    var green_count = 0
    for (var i = 0; i < this.data.map.length; i++) {
      if (this.data.map[i] == 2) {
        house_index[house_count] = i
        house_count += 1
      } else if (this.data.map[i] == 1) {
        green_index[green_count] = i
        green_count += 1
      }
    }
    if (house_count > 0) { // 如果有房子
      const key = Math.floor(Math.random() * house_count); // 选取房子
      const map_index = house_index[key]
      var tmp_map = []
      for (var i = 0; i < this.data.map.length; i++) {
        tmp_map[i] = i == map_index ? this.data.map[i] - 1 : this.data.map[i]
      }
      this.setData({
        map: tmp_map,
      })
      wx.setStorageSync('map', this.data.map) // 写入缓存
    } else if (green_count > 0) { // 如果有草地
      const key = Math.floor(Math.random() * green_count); // 选取草地
      const map_index = green_index[key]
      var tmp_map = []
      for (var i = 0; i < this.data.map.length; i++) {
        tmp_map[i] = i == map_index ? this.data.map[i] - 1 : this.data.map[i]
      }
      this.setData({
        map: tmp_map,
      })
      wx.setStorageSync('map', this.data.map) // 写入缓存
    }
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
      sum: account[key] || 0,
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
    wx.setStorageSync('upperlimit', parseInt(e.detail.value.upperlimit))
    const inputDate = parseInt(e.detail.value.start) // 获取输入的每个月开始的日期
    const now = new Date() // 获取当前日期
    if (inputDate > now.getDate()) { // 如果这个月截止
      const tmp_pre = [now.getFullYear(), now.getMonth(), now.getDate()]
      wx.setStorageSync('pre', tmp_pre)
    } else { // 如果下个月截止
      const tmp_pre = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      wx.setStorageSync('pre', tmp_pre)
    }
    pre = tmp_pre // 修改上月时间
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
