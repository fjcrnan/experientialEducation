//app.js
App({
  globalData:{
    cloud:null,
  },
  async onLaunch() {
    var c1 = new wx.cloud.Cloud({
      // 资源方 AppID
      resourceAppid: 'wxff30426f8850b0d7',
      // 资源方环境 ID
      resourceEnv: 'ch-study-7gf93bwcc89537ba',
    })
    await c1.init()
    this.globalData.cloud = c1
  },

  //检查管理员在数据库中是否还存在且处在启用状态
  async checkUserInfo(){
    // console.log(this.globalData.cloud);
    if(this.globalData.cloud === null) return setTimeout(this.checkUserInfo, 200)
    let value = wx.getStorageSync('userInfo')
    let checkId=value._id
    await getApp().globalData.cloud.callFunction({
      name:'admin_user',
      data:{
        api:'checkUser',
        id:checkId
      }
    }).then(async res=>{
      // console.log(res);
      if(res.result.msg == "该账号已被停用"){

      }else if(res.result.msg == "该账号已被删除"){
        await wx.showToast({
          title: '该账号已被删除',
          icon:'none',
          duration: 2000,
        }).then(() => {
          wx.removeStorage({
            key: 'userInfo',
          }).then(()=>{
            wx.redirectTo({
              url: '/pages/index/index',
            });
          })
        })
      }
    })
  },
})
//appid:wx68074c4b0bb0bcf4
//环境ID：ch-study-5g5r02vxfffa4cb1
