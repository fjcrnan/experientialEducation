var app= getApp();
// pages/administrator/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInformation: [
      // {
      //   option1: [
      //     { text: '一级管理员', value: 0 },
      //     { text: '二级管理员', value: 1 },
      //     { text: '三级管理员', value: 2 },
      //   ],
      //   option2: [
      //     { text: '停用', value: 0 },
      //     { text: '启用', value: 1 },
      //   ],
      //   //浏览显示
      //   browse: false,
      //   //编辑显示
      //   edit: true,
      //   state: "编辑",
      //   value1: 0,
      //   value2: 0,
      //   adminName: "张三",
      //   adminId:7755441
      // },
    ],
    modalHiddenPuton:true,
    HiddenPuton: true,
    editId:'',
    deletIndex:0,
  },

  managerAdd() {
    wx.navigateTo({
      url: '/pages/addManager/index',
    });
  },

  //管理级别变更
  levelchange(e) {
    let index = e.currentTarget.dataset.index;
    this.data.userInformation[index].value1 = e.detail
    this.setData({
      userInformation: this.data.userInformation
    })
  },
  //状态变更事件
  statuschange(e) {
    let index = e.currentTarget.dataset.index;
    this.data.userInformation[index].value2 = e.detail
    this.setData({
      userInformation: this.data.userInformation
    })
  },

  //编辑及保存按钮事件
  editChange(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.userInformation[index].state == "编辑") {
      for(let i of this.data.userInformation){
        if(i.state=='保存'){
          wx.showToast({
            title:"仅可有一项数据进入编辑状态",
            icon:'none'
          })
          return
        }
      }
      this.data.userInformation[index].browse = true;
      this.data.userInformation[index].edit = false;
      this.data.userInformation[index].state = "保存"
      this.setData({
        userInformation: this.data.userInformation,
      })
    } else if (this.data.userInformation[index].state == "保存") {
      this.data.editId=index;
      this.data.HiddenPuton = false;
      this.setData({
        editId:this.data.editId,
        HiddenPuton: this.data.HiddenPuton
      })
    }
  },

  //确定按钮点击事件
  async modalBindaconfirmPuton(e) {
    let index = this.data.editId;
    if (this.data.userInformation[index].state == "保存") {
      this.data.userInformation[index].browse = false;
      this.data.userInformation[index].edit = true;
      this.data.userInformation[index].state = "编辑";
      this.data.HiddenPuton = true;
      this.setData({
        HiddenPuton: this.data.HiddenPuton,
        userInformation:this.data.userInformation
      })
    }
    await this.modifyAdminUser();
  },
  //取消按钮点击事件
  modalBindcancelPuton: function (e) {
    this.data.HiddenPuton = true;
    this.setData({
      HiddenPuton: this.data.HiddenPuton
    })
  },

  //弹出确认框
  bindViewTapPuton(e){
    this.setData({
      modalHiddenPuton:!this.data.modalHiddenPuton,
      deletIndex:e.currentTarget.dataset.index,
    })
  },

   //确认事件
   deleteBindaconfirmPuton:function(){
    this.deleteManager()
    this.setData({
      modalHiddenPuton:!this.data.modalHiddenPuton,
    })
  },
  //取消事件
  deleteBindcancelPuton:function(){
    this.setData({
      modalHiddenPuton:!this.data.modalHiddenPuton,
    })
  },

  async deleteManager(){
    const deleteUserId=this.data.userInformation[this.data.deletIndex]._id
    wx.showLoading({
      title: '删除中',
    });
    await getApp().globalData.cloud.callFunction({
      name:'admin_user',
      data:{
        api:'deleteUser',
        deleteUserId
      }
    }).then(res=>{
      console.log(res.result.code);
      if(res.result.code==1){
        wx.hideLoading();
        this.onLoad();
        wx.showToast({
          title:'删除成功',
          icon:''
        })
      }
    })
  },

  //保存修改
  async modifyAdminUser(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_user',
      data:{
        api:'admin_userUpdate',
        update_id:this.data.userInformation[this.data.editId]._id,
        update_level:this.data.userInformation[this.data.editId].value1+1,
        update_status:this.data.userInformation[this.data.editId].value2
      }
    }).then(res=>{
      console.log(res.result.code);
      if(res.result.code==1){
        wx.showToast({
          title:'保存成功',
          icon:''
        })
      }else{
        wx.showToast({
          title:'保存失败',
          icon:''
        })
      }
    })
  },

  //获取用户
  async getAdminUser(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_user',
      data:{
        api:'getUser',
        page:0
      }
    }).then(res=>{
      for(let i of res.result){
        i.option1=[
          { text: '一级管理员', value: 0 },
          { text: '二级管理员', value: 1 },
          { text: '三级管理员', value: 2 },
        ];
        i.option2= [
          { text: '停用', value: 0 },
          { text: '启用', value: 1 },
        ];
        i.browse=false;
        i.edit=true;
        i.state='编辑';
        i.value1=i.level-1;
        i.value2=parseInt(i.status);
        i.show=true;
      }
      console.log(res.result);
      this.setData({userInformation:res.result})
    })
  },

  touchStart(e) {
    var that = this;
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY
    })
  },
  touchMove(e) {
    var that = this;
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let turn = "";
    if(y - that.data.touchy > 10 && Math.abs(x - that.data.touchx) < 10){ //下滑
      turn = "down";
    }else if(y - that.data.touchy < -10 && Math.abs(x - that.data.touchx) < 10){ //上滑
      turn="up";
    }
    //根据方向进行操作
    if(turn == 'down'||turn=="up"){
      //上下滑触发操作
      // console.log(this.selectComponent('#statusChoose').toggle);
      for(let index in this.data.userInformation){
        this.selectComponent('#adminLevel'+index).toggle(false)
        this.selectComponent('#adminStatus'+index).toggle(false)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    await this.getAdminUser();
    wx.hideLoading();
  },

  searchUser(e){
    let searchValue=e.detail;
    if(e.detail==""){
      for(let i of this.data.userInformation){
        i.show=true;
      }
      this.setData({userInformation:this.data.userInformation})
    }else{
      this.data.userInformation.forEach((v,i) => {
        if(v.userId.indexOf(searchValue)>=0||v.name.indexOf(searchValue)>=0){
          v.show=true;
        }else{
          v.show=false;
        }
        this.setData({userInformation:this.data.userInformation})
      });
    }
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