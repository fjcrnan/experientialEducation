var app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    name:'',
    password:'',
    customItem: '全部',
    //管理员级别选择
    showChoose: false,
    selectDataChoose: ['一级管理员', '二级管理员', '三级管理员'],//下拉列表的数据
    indexChoose: 0,
    //启用停用状态选择
    stateShow:false,
    stateDataChoose:['停用','启用'],
    stateChoose:0,
    userIdCheck:'',
    addUserButton:false
  },

  //管理员级别选择
  Chooseselect_tap() {
    if(this.data.stateShow==true){
      this.setData({stateShow:false})
    }
    this.setData({
      showChoose: !this.data.showChoose,
    });
  },
  Chooseoption_tap(e) {
    this.setData({
      indexChoose: e.detail.Index,
      showChoose: !this.data.showChoose
    });
  },

  //启用停用状态选择
  stateSelect_tap(){
    if(this.data.showChoose==true){
      this.setData({showChoose:false})
    }
    this.setData({
      stateShow: !this.data.stateShow,
    });
  },
  stateOption_tap(e){
    this.setData({
      stateChoose: e.detail.Index,
      stateShow: !this.data.stateShow
    });
    console.log(this.data.stateChoose);
  },

  cancel(){
    wx.navigateBack({
      delta: 1
    })
  },

  //添加管理员
  async addManager(){
    if(this.data.userId==''){
      wx.showToast({
        title:'请输入管理员ID',
        icon:'none'
      })
      return
    }
    if(this.data.name==''){
      wx.showToast({
        title:'请输入管理员名称',
        icon:'none'
      })
      return
    }
    if(this.data.password==''){
      wx.showToast({
        title:'请输入管理员密码',
        icon:'none'
      })
      return
    }
    await this.postAddmanager();
  },

  //  提交表单添加管理员
  async postAddmanager(){
    wx.showModal({
      title:'提示',
      content:'确认添加管理员',
    }).then(async res=>{
      if(res.confirm){
        wx.showLoading({
          title: '提交中',
        })  
        const managerForm=new Object();
        managerForm.userId=this.data.userId;
        managerForm.name=this.data.name;
        managerForm.password=this.data.password;
        managerForm.level=this.data.indexChoose+1;
        managerForm.status=this.data.stateChoose,
        console.log(managerForm);
        await getApp().globalData.cloud.callFunction({
          name:'admin_user',
          data:{
            api:'addManager',
            managerForm
          }
        }).then(res=>{
          console.log(res);
          wx.hideLoading();
          wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(this.JumpPage,1000)
        })
      }else if(res.cancel){
        console.log('取消');
      }
    })
    
  },

  //页面跳转
  JumpPage(){
    wx.reLaunch({
      url: '/pages/administrator/index'
    })
  },

  async checkUserID(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_user',
      data:{
        api:'checkUserID',
        inputUserID:this.data.userId
      }
    }).then(res=>{
      console.log(res.result.data);
      if(res.result.data.length!=0){
        this.setData({
        userIdCheck:'管理员ID已被注册',
        addUserButton:true
      })
        
      }else if(res.result.data.length==0){
        this.setData({
        userIdCheck:'',
        addUserButton:false
      })
      }
    })
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