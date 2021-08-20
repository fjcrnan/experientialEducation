// pages/modifybaseuser/index.js
var app = getApp();
Page({
  data: {
    suggest: "",
    originSuggest: "",
    suggestShow: false,
    UserInformation:'',
    originStatus:'',
    option2: [
      { text: '未审核', value: 0 },
      { text: '审核通过', value: 1 },
      { text: '审核不通过', value: 2 },
    ],
    value2: 0,
  },

  statusChange(e){
    if(e.detail==0){
      this.data.UserInformation.status=0
      this.data.suggestShow = false
    }else if(e.detail==1){
      this.data.UserInformation.status=1
      this.data.suggestShow = false
    }else if(e.detail==2){
      this.data.UserInformation.status=-1
      this.data.suggestShow = true
    }
    this.setData({
      value2:e.detail,
      UserInformation:this.data.UserInformation,
      suggestShow: this.data.suggestShow
    })
  },

  cancel(){
    wx.navigateBack({
      delta: 1
    })
  },
  
  async saveClick(){
    let oriStatus = parseInt(this.data.originStatus)
    let currStatus = parseInt(this.data.UserInformation.status)
    if (currStatus == 1 && oriStatus == currStatus) {
      wx.showToast({
        title: '未进行修改',
        icon: 'none',
      })
      return
    }else if (currStatus == -1 && oriStatus == currStatus && this.data.originSuggest == this.data.UserInformation.suggest) {
      wx.showToast({
        title: '未进行修改',
        icon: 'none',
      })
      return
    }
    if(currStatus == -1 && this.data.suggest == ''){
      wx.showToast({
        title: '请填写不通过原因',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: '保存中',
    })
    switch (currStatus){
      case 1:
        await getApp().globalData.cloud.callFunction({
          name:'admin_clientUser',
          data:{
            api:'changeStatus',
            update_id:this.data.modifyUser_id,
            status:parseInt(this.data.UserInformation.status)
          }
        }).then(async r=>{
          if(r.result.code=1){
            wx.hideLoading();
            await wx.showToast({
              title:"保存成功",
              icon:'none'
            })
            setTimeout(this.pageJump,1000)
          }
        })
        break;
      case -1:
        await getApp().globalData.cloud.callFunction({
          name:'admin_clientUser',
          data:{
            api:'changeFailStatus',
            update_id:this.data.modifyUser_id,
            status:parseInt(this.data.UserInformation.status),
            suggest:this.data.suggest
          }
        }).then(async r=>{
          if(r.result.code=1){
            wx.hideLoading();
            await wx.showToast({
              title:"保存成功",
              icon:'none'
            })
            setTimeout(this.pageJump,1000)
          }
        })
    }
    
  },

  pageJump(){
    wx.reLaunch({
      url: '/pages/userManage/index'
    })
  },

  //获取用户详细信息
  async getUserDetail(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_clientUser',
      data:{
        api:'getUserDetail',
        User_id:this.data.modifyUser_id
      }
    }).then(async r=>{
      
      await getApp().globalData.cloud.getTempFileURL({
        fileList: [r.result.data.avatar],
      }).then(res => {
        r.result.data.avatar = res.fileList[0].tempFileURL;
      })
      if(r.result.data.status==0){
        this.setData({value2:0});
      }else if(r.result.data.status==-1){
        this.setData({
          value2:2,
          option2: [
            {text: '审核通过', value:1},
            {text: '审核不通过', value: 2}
          ],
          suggestShow: true,
          suggest: r.result.data.suggest
        });
      }else if(r.result.data.status==1){
        this.setData({
          value2:1,
          option2: [
            {text: '审核通过', value:1},
            {text: '审核不通过', value: 2}
          ]
        });
      }
      this.setData({
        UserInformation:r.result.data,
        originStatus: r.result.data.status,
        originSuggest: r.result.data.suggest 
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
   async onLoad(e) {
     wx.showLoading({
       title: '加载中',
       mask: true,
     });
    this.setData({modifyUser_id:e.id})
    await this.getUserDetail();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})