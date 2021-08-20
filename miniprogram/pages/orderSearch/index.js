// pages/orderSearch/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchOrderLists:{},
    searchRecord:[],
    searchBarHidden:true,
    searchBarText:false
  },

  //搜索列表删除事件
  searchListsDelete(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除订单？',
    }).then(res => {
      if (res.confirm) {
        let deleteIndex = e.currentTarget.dataset.index;
        let deleteId = this.data.searchOrderLists[deleteIndex]._id
        this.deletOrder(deleteId)
      } else if (res.cancel) {

      }
    })
  },

  //搜索框搜索事件
  //搜索框事件
  async InputsearchOnchange() {
    let searchValue = this.data.searchValue;
    if(searchValue === undefined){
      wx.showToast({
        title: '请输入搜索信息',
        icon:'none'
      })
      return
    }
    else if (searchValue != "") {
      wx.showLoading({
        title: '搜索中',
        mask: true,
      });
      await getApp().globalData.cloud.callFunction({
        name: 'admin_order',
        data: {
          api: 'searchOrder',
          searchValue
        }
      }).then(async res => {
        wx.hideLoading();
        console.log(res);
        if (res.result.data.length == 0) {
          wx.showToast({
            title: '无结果',
            icon: 'none',
          });
        }
        else {
          for (let i in res.result.data) {
            await getApp().globalData.cloud.getTempFileURL({
              fileList: [res.result.data[i].curriImage]
            }).then(r => {
              res.result.data[i].curriImage = r.fileList[0].tempFileURL;
            })
          }
          this.setData({
            searchOrderLists: res.result.data,
            searchBarHidden: false
          })
        }
        if(wx.getStorageSync('ordersSearchRecords') === ""){
          wx.setStorage({
            key:"ordersSearchRecords",
            data:[searchValue]
          })
        }else {
          let tempRecords =  wx.getStorageSync('ordersSearchRecords')
          if(tempRecords.length >= 10) {
            tempRecords.splice(9,1)
            tempRecords.unshift(searchValue)
          }else {
            tempRecords.forEach((item, index, value) => {
              if(item === searchValue) {
                value.splice(index,1)
              }
            })
            tempRecords.unshift(searchValue)
          }
          wx.setStorage({
            key:"ordersSearchRecords",
            data:tempRecords
          })
        }
        this.getStorageRecords()
      })
    } 
  },
  
  //点击搜索框显示历史记录
  showRecords() {
    let temp = wx.getStorageSync('ordersSearchRecords')
    if(temp != "") {
      this.setData({
        searchBarText:false,
        searchRecord: temp
      })
    }
    this.setData({
      searchBarHidden:true
    })
  },

  //历史记录搜索
  recordsSearch(e) {
    let searchValue = this.data.searchRecord[e.currentTarget.dataset.index]
    this.setData({
      searchValue
    })
    this.InputsearchOnchange()
  },

  changeFakeSearch() {
    wx.navigateBack({
      delta: 1
    })
  },

  //获取缓存搜索记录
  getStorageRecords() {
    let temp = wx.getStorageSync('ordersSearchRecords')
    console.log(temp);
    if(temp === "") {
      return this.setData({
        searchBarText:true
      })
    }
    this.setData({
      searchRecord: temp
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorageRecords()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})