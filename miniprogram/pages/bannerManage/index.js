var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    actions: [
      { name: '着色选项', color: '#ee0a24' },
    ],
    banner: [
      // {
      //   "url": "https://api-hmugo-web.itheima.net/pyg/banner1.png"
      // },
      // {
      //   "url": "https://api-hmugo-web.itheima.net/pyg/banner2.png"
      // },
      // {
      //   "url": "https://api-hmugo-web.itheima.net/pyg/banner3.png"
      // },
    ]
  },
  async deletetap(e) {
    let index = e.target.dataset.index;
    let deleteBannerID=this.data.cloudBanner[index]._id;
    wx.showModal({
      title:'提示',
      content:'确认删除？'
    }).then(async r=>{
      if(r.confirm){
        wx.showLoading({
          title: '删除中',
          mask: true,
        });
        await getApp().globalData.cloud.callFunction({
          name:'admin_banner',
          data:{
            api:'deleteBanner',
            deleteBannerID
          }
        }).then(async res=>{
          console.log(res);
          if(res.result.code==1){
            wx.hideLoading();
            await wx.showToast({
              title: '删除成功',
              icon: 'none',
            });
            setTimeout(this.onLoad,1000)
          }else{
            wx.hideLoading();
            await wx.showToast({
              title: '删除失败',
              icon: 'none',
            });
            setTimeout(this.onLoad,1000)
          }
        })
      }else if(r.cancel){

      }
    })
    // var { images } = this.data;
    // let index = e.target.dataset.index
    // images.splice(index, 1);
    // this.setData({
    //   images: images
    // })
  },

  async moveUp(e) {
    let index = e.target.dataset.index;
    if (index == 0) {
      wx.showToast({
        title: '到顶了！',
        icon: 'none',
      })
      return
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确认前移图片?'
      }).then(async r => {
        if (r.confirm) {
          wx.showLoading({
            title: '上移中',
            mask: true,
          });
          let currentImg = this.data.cloudBanner[index].image;
          let previousImg = this.data.cloudBanner[index - 1].image;
          console.log(currentImg);
          console.log(previousImg);
          await getApp().globalData.cloud.callFunction({
            name: 'admin_banner',
            data: {
              api: 'forwardBanner',
              currentImg,
              previousImg
            }
          }).then(async(res) => {
            console.log(res);
            if (res.result.code == 1) {
              wx.hideLoading();
              await wx.showToast({
                title: '上移成功',
                icon: 'none',
              });
              setTimeout(this.onLoad,1000)
            }else{
              wx.hideLoading();
              await wx.showToast({
                title: '上移失败',
                icon: 'none',
              });
              setTimeout(this.onLoad,1000)
            }
          })
        } else if (r.cancel) {

        }
      })
    }
    // let index = e.target.dataset.index;
    // if (index == 0) { } else {
    //   let temp = this.data.images.splice(index, 1, this.data.images[index - 1])
    //   this.data.images.splice(index - 1, 1, temp[0]);
    //   this.setData({
    //     images: this.data.images,
    //   })
    // }
  },

  async moveDown(e) {
    let index = e.target.dataset.index;
    if (index == this.data.cloudBanner.length-1) {
      wx.showToast({
        title: '到底了！',
        icon: 'none',
      })
      return
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确认后移图片?'
      }).then(async r => {
        if (r.confirm) {
          wx.showLoading({
            title: '下移中',
            mask: true,
          });
          let currentImg = this.data.cloudBanner[index].image;
          let lastImg = this.data.cloudBanner[index + 1].image;
          console.log(currentImg);
          console.log(lastImg);
          await getApp().globalData.cloud.callFunction({
            name: 'admin_banner',
            data: {
              api: 'backwardBanner',
              currentImg,
              lastImg
            }
          }).then(async(res) => {
            if (res.result.code == 1) {
              wx.hideLoading();
              await wx.showToast({
                title: '下移成功',
                icon: 'none',
              });
              setTimeout(this.onLoad,1000)
            }else{
              wx.hideLoading();
              await wx.showToast({
                title: '下移失败',
                icon: 'none',
              });
              setTimeout(this.onLoad,1000)
            }
          })
        } else if (r.cancel) {

        }
      })
    }
    // let imgLength = this.data.images.length;
    // let index = e.target.dataset.index;
    // if (index >= imgLength - 1) { } else {
    //   let temp = this.data.images.splice(index, 1, this.data.images[index + 1])
    //   this.data.images.splice(index + 1, 1, temp[0]);
    //   this.setData({
    //     images: this.data.images,
    //   })
    // }
  },

  //添加图片
  async afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    console.log(file)
    const res = await getApp().globalData.cloud.uploadFile({
      cloudPath: 'bannerImage/' + Math.floor(Math.random() * 1000000) + '.jpg',
      filePath: file.url,
    })
    let banner = res.fileID;
    wx.showLoading({
      title: '上传中',
    });
    await getApp().globalData.cloud.callFunction({
      name: 'admin_banner',
      data: {
        api: 'addBanner',
        banner
      }
    }).then(async res => {
      if (res.result.code == 1) {
        console.log(res);
        wx.hideLoading();
        await wx.showToast({
          title: '添加成功',
          icon: 'none',
        });
        setTimeout(this.onLoad,1000)
      } else {
        wx.showToast({
          title: '添加失败',
          icon: 'none',
        });
      }
    })
    // let temp = this.data.images
    // temp.push(file)
    // this.setData({ images: temp })
  },

  //获取图片
  async getAllBanner() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    await getApp().globalData.cloud.callFunction({
      name: 'admin_banner',
      data: {
        api: 'getAllBanner'
      }
    }).then(async res => {
      console.log(res.result.data);
      let tempResult = JSON.parse(JSON.stringify(res.result.data));
      // const tempResult=[...res.result.data]
      this.setData({ cloudBanner: tempResult });
      console.log(this.data.cloudBanner);
      for (let v in res.result.data) {
        await getApp().globalData.cloud.getTempFileURL({
          fileList: [res.result.data[v].image],
        }).then(r => {
          res.result.data[v].image = r.fileList[0].tempFileURL
          console.log(r.fileList[0].tempFileURL);
        })
      }
      this.setData({ banner: res.result.data })
    })
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllBanner();
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