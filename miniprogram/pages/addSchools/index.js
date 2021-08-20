var app=getApp()
// pages/addSchools/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName:'',
    detailAddress: '',
    allGrades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],//数据模板
    region: ['广东省', '广州市', '从化区'],
    customItem: '全部',
    showStart: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectDataStart: '',//下拉列表的数据
    indexStart: 0,//选择的下拉列表下标
    showEnd: false,
    selectDataEnd: '',//下拉列表的数据
    indexEnd: 1,
    showChoose: false,
    selectDataChoose: '',//下拉列表的数据
    indexChoose: 0,
    message: '',
    messageGather: []
  },

  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //开始年级选择
  // 点击下拉显示框
  firselect_tap() {
    if (this.data.showEnd == true || this.data.showChoose == true) {
      this.setData({
        showEnd: false,
        showChoose: false
      })
    }
    this.setData({
      showStart: !this.data.showStart
    });
  },
  // 点击下拉列表
  firoption_tap(e) {
    if (e.detail.Index > this.data.indexEnd + this.data.indexStart) {
      this.data.indexEnd = 0
    } else {
      if (e.detail.Index > this.data.indexStart) {
        this.data.indexEnd -= e.detail.Index - this.data.indexStart
      } else if (e.detail.Index < this.data.indexStart) {
        this.data.indexEnd += this.data.indexStart - e.detail.Index
      }
    }
    this.setData({
      indexStart: e.detail.Index,
      showStart: !this.data.showStart
    });
    this.data.selectDataEnd=JSON.parse(JSON.stringify(this.data.allGrades));
    // this.data.selectDataEnd = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级']
    this.data.selectDataEnd.splice(0, this.data.indexStart)
    this.setData({
      selectDataEnd: this.data.selectDataEnd,
      indexEnd: this.data.indexEnd
    });
    this.gradeChooseUpload()
    this.checkClassValid();
  },

  //结束年级选择
  // 点击下拉显示框
  endselect_tap() {
    if (this.data.showStart == true || this.data.showChoose == true) {
      this.setData({
        showStart: false,
        showChoose: false
      })
    }
    this.setData({
      showEnd: !this.data.showEnd,
    });
  },
  // 点击下拉列表
  endoption_tap(e) {
    this.setData({
      indexEnd: e.detail.Index,
      showEnd: !this.data.showEnd
    });
    this.gradeChooseUpload();
    this.checkClassValid();
  },

  //检测班级是否在年级范围内
  checkClassValid() {
    let gradeRange = this.data.allGrades.slice(this.data.indexStart, this.data.indexEnd + this.data.indexStart + 1);
    console.log(gradeRange);
    for (let i in this.data.messageGather) {
      let a = 1, b = 2;
      for (let j of gradeRange) {
        if (this.data.messageGather[i][j]) {
          a++
        }
      }
      if (a != b) {
        this.data.messageGather.splice(i, 1);
        i--;
      }
    }
    this.setData({ messageGather: this.data.messageGather })
    //因为年级选择指针无法定位所以重新加载班级填写框
    let classes = this.data.selectDataChoose[this.data.indexChoose]
    if (this.checkClass(classes)) {
      for (let i of this.data.messageGather) {
        if (i[classes]) {
          var classmessage = i[classes]
        }
      }
      this.setData({
        message: classmessage
      })
    } else {
      this.setData({
        message: ''
      })
    }
    console.log(this.data.messageGather);
  },

  //班级年级选择 
  Chooseselect_tap() {
    if (this.data.showStart == true || this.data.showEnd == true) {
      this.setData({
        showStart: false,
        showEnd: false,
      })
    }
    this.setData({
      showChoose: !this.data.showChoose,
    });
  },
  // 点击下拉列表
  Chooseoption_tap(e) {
    this.setData({
      indexChoose: e.detail.Index,
      showChoose: !this.data.showChoose
    });
    //显示输入框班级信息
    let classes = this.data.selectDataChoose[this.data.indexChoose]
    if (this.checkClass(classes)) {
      for (let i of this.data.messageGather) {
        if (i[classes]) {
          var classmessage = i[classes]
        }
      }
      this.setData({
        message: classmessage
      })
    } else {
      this.setData({
        message: ''
      })
    }
  },

  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },

  //年级选择更新
  gradeChooseUpload() {
    let temp=JSON.parse(JSON.stringify(this.data.allGrades));
    this.setData({
      selectDataChoose:temp
    })
    this.data.selectDataChoose.splice(0, this.data.indexStart);
    this.data.selectDataChoose.length = this.data.indexEnd + 9 - this.data.selectDataEnd.length - this.data.indexStart + 1;
    this.setData({
      selectDataChoose: this.data.selectDataChoose
    })
  },

  //班级存储
  classStorage(e) {
    let classes = this.data.selectDataChoose[this.data.indexChoose];
    if (e.detail.value == '') {
      for (let i in this.data.messageGather) {
        if (this.data.messageGather[i][classes]) {
          this.data.messageGather.splice(i, 1);
        }
      }
    } else {
      if (this.checkClass(classes)) {
        for (let i of this.data.messageGather) {
          if (i[classes]) {
            i[classes] = e.detail.value
          }
        }
      } else {
        this.data.messageGather.push({ [classes]: e.detail.value })
      }
    }
    this.setData({
      messageGather: this.data.messageGather
    })
    console.log(this.data.messageGather);
  },

  //检测原有数组是否含有已设定班级
  checkClass(classes) {
    for (let i of this.data.messageGather) {
      if (i[classes]) {
        return true
      }
    }
    return false
  },

  //点击添加事件
  addClick() {
    if (this.data.schoolName == '') {
      wx.showToast({
        title: '请输入学校名称',
        icon: 'none'
      })
      return
    }
    if (this.data.detailAddress == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return
    }
    if (!this.checkGradeClass()) {
      wx.showToast({
        title: '请完整填写班级信息',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确认添加学校',
    }).then(async res => {
      if (res.confirm) {
        wx.showLoading({
          title: '添加中',
        });
        const schoolForm = new Object();
        let gradeRange = this.data.allGrades.slice(this.data.indexStart, this.data.indexEnd + this.data.indexStart + 1);
        schoolForm.name=this.data.schoolName;
        schoolForm.region = this.data.region;
        schoolForm.detailAddress = this.data.detailAddress;
        schoolForm.grade = gradeRange;
        schoolForm.classInfo = this.data.messageGather;
        await getApp().globalData.cloud.callFunction({
          name:'admin_school',
          data:{
            api:'addSchool',
            schoolForm
          }
        }).then(async r=>{
          if(r.result.code==1){
            wx.hideLoading();
          await wx.showToast({
            title:'添加成功',
            icon:''
          })
          setTimeout(this.jumpPage,1000);
          }else{
            wx.hideLoading();
            await wx.showToast({
              title:'添加失败',
              icon:''
            })
          }
        })
      } else if (res.cancel) {
        console.log('取消');
      }
    })
  },

  //检测年级中班级数据是否为空
  checkGradeClass() {
    let gradeRange = this.data.allGrades.slice(parseInt(this.data.indexStart), parseInt(this.data.indexEnd) + parseInt(this.data.indexStart) + 1);
    console.log(gradeRange);
    for (let i in gradeRange) {
      let a = 1, b = 2;
      for (let j of this.data.messageGather) {
        if (j[gradeRange[i]]) {
          a++
        }
      }
      if (a != b) {
        return false
      }
    }
    return true
  },

  jumpPage(){
    wx.reLaunch({
      url: '/pages/schoolManage/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectDataStart: this.data.allGrades,
      selectDataEnd: this.data.allGrades,
      selectDataChoose: this.data.allGrades.slice(0, 2),
    })
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