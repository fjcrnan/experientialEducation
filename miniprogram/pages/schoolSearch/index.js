// pages/schoolSearch/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchSchoolLists: '',
    searchValue: ''
  },

  //搜索取消按钮
  changeFakeSearch() {
    wx.navigateBack({
      delta: 1
    })
  },

  //搜索框搜索事件
  InputsearchOnchange() {
    if (this.data.searchValue == "") {
      wx.showToast({
        title: '请输入搜索内容',
        icon: "none"
      })
      return
    } else {
      this.searchOnline()
    }
  },

  //请求数据库搜索
  async searchOnline() {
    wx.showLoading({
      title: '搜索中',
      mask: true,
    })
    await getApp().globalData.cloud.callFunction({
      name: 'admin_school',
      data: {
        api: 'searchSchool',
        searchValue: this.data.searchValue
      }
    }).then(res => {
      console.log(res);
      for(let i of res.result.data){
        i.gradeLength=i.grade.length-1
      }
      if (res.result.data.length == 0) {
        wx.showToast({
          title: '无结果',
          icon: 'none'
        })
      } else {
        this.setData({ searchSchoolLists: res.result.data })
      }
      wx.hideLoading()
    })
  },
  
  modify(e){
    let modifySchoolID=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/modifySchool/index?id='+modifySchoolID,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    app.checkUserInfo()
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