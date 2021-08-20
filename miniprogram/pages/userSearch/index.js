var app=getApp();
// pages/userSearch/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchUerInfor:'',
    searchValue:''
  },

  //搜索取消按钮
  changeFakeSearch(){
    wx.navigateBack({
      delta: 1
    })
  },

  //搜索框搜索事件
  InputsearchOnchange(){
    if(this.data.searchValue==""){
      wx.showToast({
        title: '请输入搜索内容',
        icon:"none"
      })
      return
    }else{ 
      this.searchOnline()
    }
  },

  //请求数据库搜索
  async searchOnline(){
    wx.showLoading({
      title: '搜索中',
      mask: true,
    })
    await getApp().globalData.cloud.callFunction({
      name:'admin_clientUser',
      data:{
        api:'searchUser',
        searchValue:this.data.searchValue
      }
    }).then(async res=>{
      console.log(res);
      if(res.result.data.length==0){
        wx.showToast({
          title: '无结果',
          icon:'none'
        })
      }else{
        for(let i of res.result.data){
          await getApp().globalData.cloud.getTempFileURL({
            fileList: [i.avatar],
          }).then(r => {
            i.avatar = r.fileList[0].tempFileURL;
          })
        }
        this.setData({searchUerInfor:res.result.data})
      }
    })
    wx.hideLoading()
  },

  //修改跳转
  Jumptap(e) {
    let i = e.currentTarget.dataset.index
    if (this.data.searchUerInfor[i].idType === '学生' || this.data.searchUerInfor[i].idType === '教师' || this.data.searchUerInfor[i].idType === '导师') {
      wx.navigateTo({
        url: '/pages/modifypersonaluser/index?id='+e.currentTarget.dataset._id,
      });
    } else if (this.data.searchUerInfor[i].idType === '基地' || this.data.searchUerInfor[i].idType === '机构') {
      wx.navigateTo({
        url: '/pages/modifybaseuser/index?id='+e.currentTarget.dataset._id,
      });
    }
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