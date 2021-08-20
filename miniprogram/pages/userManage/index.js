// pages/userManage/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部用户', value: 0 },
      { text: '个人用户', value: 1 },
      { text: '机构用户', value: 2 },
    ],
    option2: [
      { text: '全部', value: 0 },
      { text: '未审核', value: 1 },
      { text: '已审核', value: 2 },
    ],
    value1: 0,
    value2: 0,
    userInfor: [
      // {
      //   _id:1,
      //   name:'姓名',
      //   idCard:'用户ID',
      //   avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3500492910,245029864&fm=26&gp=0.jpg' ,
      //   idType:'学生',
      //   status:1,
      //   date:'2021-02-20',
      //   show:true
      // },
      // {
      //   id:2,
      //   desc:'姓名',
      //   title:'用户ID',
      //   thumb: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3500492910,245029864&fm=26&gp=0.jpg' ,
      //   identify:'教师',
      //   status:'已审核',
      //   date:'2021-02-20'
      // }
    ],
    // baseuserInfor:[
    //   {
    //     id:3,
    //     desc:'组织名',
    //     title:'组织ID',
    //     thumb: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=127805123,1554149309&fm=26&gp=0.jpg' ,
    //     identify:'机构',
    //     status:'已审核',
    //     date:'2021-02-20'
    //   }
    // ]
  },
  userChange(e) {
    console.log(this.data.userInfor);
    this.setData({
      value1: e.detail
    })
    if (this.data.value1 == 1) {
      for (let i of this.data.userInfor) {
        if (i.idType === '学生' || i.idType === '教师' || i.idType === '导师') {
          i.userShow = true
        } else if (i.idType === '基地' || i.idType === '机构') {
          i.userShow = false
        }
      }
      this.setData({
        userInfor: this.data.userInfor
      })
    } else if (this.data.value1 == 2) {
      for (let i of this.data.userInfor) {
        if (i.idType === '学生' || i.idType === '教师' || i.idType === '导师') {
          i.userShow = false
        } else if (i.idType === '基地' || i.idType === '机构') {
          i.userShow = true
        }
      }
      this.setData({
        userInfor: this.data.userInfor
      })
    } else if (this.data.value1 == 0) {
      for (let i of this.data.userInfor) {
        i.userShow = true
      }
    }
    this.setData({
      userInfor: this.data.userInfor
    })
  },

  statusChange(e) {
    console.log(this.data.userInfor);
    this.setData({
      value2: e.detail
    })
    if (this.data.value2 == 1) {
      for (let i of this.data.userInfor) {
        if (i.status == 0) {
          i.statusShow = true
        } else if (i.status == 1 || i.status == -1) {
          i.statusShow = false
        }
      }
      this.setData({
        userInfor: this.data.userInfor
      })
    } else if (this.data.value2 == 2) {
      for (let i of this.data.userInfor) {
        if (i.status == 1 || i.status == -1) {
          i.statusShow = true
        } else if (i.status == 0) {
          i.statusShow = false
        }
      }
      this.setData({
        userInfor: this.data.userInfor
      })
    } else if (this.data.value2 == 0) {
      for (let i of this.data.userInfor) {
        i.statusShow = true
      }
    }
    this.setData({
      userInfor: this.data.userInfor
    })
  },

  //跳转到搜索界面
  jumpToSearch(){
    wx.navigateTo({
      url: '/pages/userSearch/index',
    });
  },

  async getUserInfor() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    let lastPages=0;
    const userInforLength=this.data.userInfor.length
    if(userInforLength!=0&&userInforLength%10==0){
      // lastId=this.data.userInfor[userInforLength-1]._id
      lastPages=userInforLength/10;
      console.log(lastPages);
    }else if(userInforLength!=0&&userInforLength%10!=0){
      wx.showToast({
        title: '没有更多用户数据了!',
        icon: 'none',
      });
      return
    }
    await getApp().globalData.cloud.callFunction({
      name: 'admin_clientUser',
      data: {
        api: 'adminGetAll',
        lastPages
      }
    }).then(async res => {
      if(res.result.data.length==0){
        wx.hideLoading();
        wx.showToast({
          title: '没有更多用户数据了！',
          icon: 'none',
        });
        return
      }
      for (let i of res.result.data) {
        await getApp().globalData.cloud.getTempFileURL({
          fileList: [i.avatar],
        }).then(r => {
          i.avatar = r.fileList[0].tempFileURL;
        })
        let specificTime = new Date(i.date)
        i.date = specificTime.getFullYear() + '-' + specificTime.getMonth() + '-' + specificTime.getDay()
        // console.log(i);
        // if(i.idType==='学生'||i.idType==='教师'||i.idType==='导师'){
        //   i.show=true
        // }else if(i.idType==='基地'||i.idType==='机构'){
        //   i.show=false
        // }
        if (this.data.value1 == 0 && this.data.value2 == 0) {
          i.userShow = true;
          i.statusShow = true;
        }
        if (this.data.value1 == 1) {
          if (i.idType === '学生' || i.idType === '教师' || i.idType === '导师') {
            i.userShow = true
          } else if (i.idType === '基地' || i.idType === '机构') {
            i.userShow = false
          }
        } else if (this.data.value1 == 2) {
          if (i.idType === '学生' || i.idType === '教师' || i.idType === '导师') {
            i.userShow = false
          } else if (i.idType === '基地' || i.idType === '机构') {
            i.userShow = true
          }
        }
        if(this.data.value2==1){
          if(i.status==0){
            i.statusShow=true
          }else if(i.status==1||i.status==-1){
            i.statusShow=false
          }
        }else if(this.data.value2==2){
          if(i.status==0){
            i.statusShow=false
          }else if(i.status==1||i.status==-1){
            i.statusShow=true
          }
        }
        this.data.userInfor.push(i)
      }
      this.setData({
        userInfor: this.data.userInfor
      })
      wx.hideLoading();
    })
    console.log(this.data.userInfor);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfor();
  },

  Jumptap(e) {
    let i = e.currentTarget.dataset.index
    if (this.data.userInfor[i].idType === '学生' || this.data.userInfor[i].idType === '教师' || this.data.userInfor[i].idType === '导师') {
      wx.navigateTo({
        url: '/pages/modifypersonaluser/index?id='+e.currentTarget.dataset._id,
      });
    } else if (this.data.userInfor[i].idType === '基地' || this.data.userInfor[i].idType === '机构') {
      wx.navigateTo({
        url: '/pages/modifybaseuser/index?id='+e.currentTarget.dataset._id,
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
    this.getUserInfor();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})