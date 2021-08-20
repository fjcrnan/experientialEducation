var app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    authorize: false
  },

  async authorizeLogin() {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于绑定管理员授权登录',
      success: async (r) => {
        wx.showLoading({
          title: '授权中',
          mask: true,
        })
        wx.setStorage({
          key: "userAuthorizeInfo",
          data: r.userInfo
        }).then(() => {
          this.setData({ authorize: true })
        })
        await getApp().globalData.cloud.callFunction({
          name: 'admin_user',
          data: {
            api: 'getOpenId'
          }
        }).then(res => {
          console.log(res);
          wx.setStorage({
            key: "_openid",
            data: res.result
          })
        })
        await getApp().globalData.cloud.callFunction({
          name: 'admin_user',
          data: {
            api: 'authorize'
          }
        }).then(res => {
          console.log(res);
          if (res.result.data.length == 0) {

          } else {
            wx.hideLoading();
            wx.setStorage({
              key: "userInfo",
              data: res.result.data[0]
            })
            wx.redirectTo({
              url: '/pages/home/index',
            });
            return
          }
          wx.hideLoading();
        })
      },
      fail: res => {

      }
    })
    // .then(async(r) => {
    //   wx.showLoading({
    //     title: '授权中',
    //     mask: true,
    //   })
    //   console.log(e);
    //   wx.setStorage({
    //     key:"userAuthorizeInfo",
    //     data:r.userInfo
    //   }).then(()=>{
    //     this.setData({authorize:true})
    //   })
    //   await getApp().globalData.cloud.callFunction({
    //     name:'admin_user',
    //     data:{
    //       api:'getOpenId'
    //     }
    //   }).then(res=>{
    //     console.log(res);
    //     wx.setStorage({
    //       key:"_openid",
    //       data:res.result
    //     })
    //   })
    //   await getApp().globalData.cloud.callFunction({
    //     name:'admin_user',
    //     data:{
    //       api:'authorize'
    //     }
    //   }).then(res=>{
    //     console.log(res);
    //     if(res.result.data.length==0){

    //     }else{
    //       wx.hideLoading();
    //       wx.setStorage({
    //         key:"userInfo",
    //         data:res.result.data[0]
    //       })
    //       wx.redirectTo({
    //         url: '/pages/home/index',
    //       });
    //       return
    //     }
    //     wx.hideLoading();
    //   })
    // })

  },

  bindSubmit(e) {
    var form = e.detail.value
    if (form.userId === '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }
    if (form.password === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '登录中',
      mask: true,
    })
    getApp().globalData.cloud.callFunction({
      name: 'admin_user',
      data: {
        api: 'login',
        userId: form.userId,
        password: form.password,
      }
    }).then(async res => {
      console.log(res);
      if (res.result.code === -1) {
        wx.showToast({
          title: res.result.msg,
          icon: 'none'
        })
      } else if (res.result.data.status == 0) {
        wx.showToast({
          title: '管理员用户处于停用状态',
          icon: 'none'
        })
      } else {
        let id = res.result.data._id
        let value = wx.getStorageSync('_openid')
        await this.addWXuser(value, id)
        wx.setStorage({
          key: "userInfo",
          data: res.result.data
        })
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/home/index',
        });
      }
    })
  },

  //往登录的账号添加用户信息
  async addWXuser(openId, _id) {
    await getApp().globalData.cloud.callFunction({
      name: 'admin_user',
      data: {
        api: 'addOpenId',
        openId: openId,
        _id: _id
      }
    }).then(res => {
      console.log(res);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let value = wx.getStorageSync('userAuthorizeInfo')
    if (value) {
      this.setData({ authorize: true })
      await getApp().globalData.cloud.callFunction({
        name: 'admin_user',
        data: {
          api: 'authorize'
        }
      }).then(res => {
        console.log(res);
        if (res.result.data.length == 0) {
          return
        } else {
          wx.setStorage({
            key: "userInfo",
            data: res.result.data[0]
          })
          wx.redirectTo({
            url: '/pages/home/index',
          });
          return
        }
      })
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