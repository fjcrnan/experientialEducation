// pages/schoolManage/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeLength:'',
    schoolLists:[
      // {
      //   id:1,
      //   tumb:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1077365967,1556637322&fm=26&gp=0.jpg',
      //   schName:'广州从化中学',
      // },
      // {
      //   id:2,
      //   tumb:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1077365967,1556637322&fm=26&gp=0.jpg',
      //   schName:'广州从化中学',
      // },
      // {
      //   id:3,
      //   tumb:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1077365967,1556637322&fm=26&gp=0.jpg',
      //   schName:'广州从化中学',
      // },
      // {
      //   id:4,
      //   tumb:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1077365967,1556637322&fm=26&gp=0.jpg',
      //   schName:'广州从化中学',
      // }
    ]
  },

  jumpSearchPage(){
    wx.navigateTo({
      url: '/pages/schoolSearch/index',
    });
  },

  showPopupadd() {
    wx.navigateTo({
      url: '/pages/addSchools/index',
    });
  },

  onCloseadd() {
    this.setData({ show1:false });
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },


  popupChange(){
    if(this.data.show===false){
      this.setData({
        show: true
      })
    }else{
      this.setData({
        show: false
      })
    }
  },

  modify(e){
    let modifySchoolID=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/modifySchool/index?id='+modifySchoolID,
    });
  },

  async getAllSchool(){
    let lastPages = 0;
    let schoolListsLength = this.data.schoolLists.length;
    if(schoolListsLength!=0 && schoolListsLength % 10 == 0){
      lastPages = orderListLength / 10
    }else if(schoolListsLength!=0 && schoolListsLength % 10 != 0){
      wx.showToast({
        title: '没有更多学校数据了!',
        icon: 'none',
      });
      return
    }
    await getApp().globalData.cloud.callFunction({
      name:'admin_school',
      data:{
        api:'getAllSchool',
        lastPages
      }
    }).then(res=>{
      for(let i of res.result.data){
        i.gradeLength=i.grade.length-1
      }
      console.log(res.result.data);
      this.data.schoolLists.push(...res.result.data)
      this.setData({schoolLists:this.data.schoolLists})
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    await this.getAllSchool();
    wx.hideLoading();
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
    this.getAllSchool();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})