// pages/orderManage/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderLists: [],
    searchOrderLists: [],
    searchValue: ''
  },

  async deletOrder(deleteOrderId) {
    console.log(deleteOrderId);
    await getApp().globalData.cloud.callFunction({
      name: 'admin_order',
      data: {
        api: 'removeOrder',
        deleteOrderId
      }
    }).then(res => {
      console.log(res);
    })
  },

  //常规列表删除事件
  orderListsDelete: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认删除订单？',
    }).then(res => {
      if (res.confirm) {
        let deleteIndex = e.currentTarget.dataset.index;
        let deleteId = this.data.orderLists[deleteIndex]._id
        this.deletOrder(deleteId)
      } else if (res.cancel) {

      }
    })
  },

  //假搜索框点击事件
  changeRealSearch() {
    wx.navigateTo({
      url: '/pages/orderSearch/index',
    });
    // this.setData({
    //   orderListsShow:true,
    //   searchOrderListsShow:false
    // })
  },

  //真搜索框取消事件
  changeFakeSearch() {
    this.setData({
      orderListsShow: false,
      searchOrderListsShow: true,
      searchOrderLists: [],
      searchValue: ''
    })
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

  //搜索框事件
  async InputsearchOnchange() {
    let searchValue = this.data.searchValue;
    if (searchValue == "") {
      wx.showToast({
        title: '请输入搜索信息',
        icon: 'none'
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
            searchOrderLists: res.result.data
          })
        }
      })
    }
  },

  async getOrder() {
    let lastPages = 0
    let orderListLength = this.data.orderLists.length;
    if (orderListLength != 0 && orderListLength % 10 == 0) {
      lastPages = orderListLength / 10
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    const resu = await getApp().globalData.cloud.callFunction({
      name: 'admin_order',
      data: {
        api: 'getAll',
        lastPages
      }
    }).then(async res => {
      console.log(res.result.data);
      for (let i in res.result.data) {
        await getApp().globalData.cloud.getTempFileURL({
          fileList: [res.result.data[i].curriImage]
        }).then(r => {
          res.result.data[i].curriImage = r.fileList[0].tempFileURL;
        })
      }
      let tempOrder = JSON.parse(JSON.stringify(res.result.data));
      this.data.orderLists.push(...tempOrder);
      this.setData({
        orderLists: this.data.orderLists
      })
      wx.hideLoading();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchOrderListsShow: true,
      orderListsShow: false,
      orderLists: [],
      searchOrderLists: [],
    })
    this.getOrder();
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
    app.checkUserInfo
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
    if (this.data.searchValue == '') {
      let lastPages = 0
      let orderListLength = this.data.orderLists.length
      if (orderListLength != 0 && orderListLength % 10 != 0) {
        wx.showToast({
          title: '没有更多订单数据了!',
          icon: 'none',
        });
        return
      }
      this.getOrder(lastPages);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})