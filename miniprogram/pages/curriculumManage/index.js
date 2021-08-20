// pages/curriculumManage/index.js
var app= getApp();
  Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部分类', value: 0 },
      { text: '红色文化类', value: 1 },
      { text: '现代农业类', value: 2 },
      { text: '安全应急类', value: 3 },
      { text: '传统文化类', value: 4 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '按推荐排序', value: 'b' },
      { text: '按热度排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
    modalHiddenPuton:true,
    modalHiddenUnder:true,
    changeIndex:"",
    onshelfStatus:"上架",
    curriculumContent:[
      // {
      //   id:1,
      //   tag:"已上架",
      //   price:"160.00",
      //   title:'课程标题',
      //   thumb:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg',
      //   numdes:'红色文化类',
      //   numdesId:1,
      //   currId:'课程ID',
      //   currTime:'课程时间',
      //   tagsMechanism:'机构',
      //   tagsBase:'基地',
      //   buttonChange:'下架',
      //   show:false,
      // },
      // {
      //   id:2,
      //   tag:"已上架",
      //   price:"160.00",
      //   title:'课程标题',
      //   thumb:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg',
      //   numdes:'现代农业类',
      //   numdesId:'2',
      //   currId:'课程ID',
      //   currTime:'课程时间',
      //   tagsMechanism:'机构',
      //   tagsBase:'基地',
      //   buttonChange:'下架',
      //   show:false,
      // },
      // {
      //   id:3,
      //   tag:"已上架",
      //   price:"160.00",
      //   title:'课程标题',
      //   thumb:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg',
      //   numdes:'安全应急类',
      //   numdesId:3,
      //   currId:'课程ID',
      //   currTime:'课程时间',
      //   tagsMechanism:'机构',
      //   tagsBase:'基地',
      //   buttonChange:'下架',
      //   show:false,
      // },
      // {
      //   id:4,
      //   tag:"已上架",
      //   price:"160.00",
      //   title:'课程标题',
      //   thumb:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg',
      //   numdes:'传统文化类',
      //   numdesId:4,
      //   currId:'课程ID',
      //   currTime:'课程时间',
      //   tagsMechanism:'机构',
      //   tagsBase:'基地',
      //   buttonChange:'下架',
      //   show:false,
      // }

    ],
  },
  ModifyJumpPage:function(e){
    wx.navigateTo({
      url: '/pages/modifycourse/index?id='+e.currentTarget.dataset.id,
    });
      
  },

  AddJumpPage:function(){
    wx.navigateTo({
      url: '/pages/addcourse/index',
    });
      
  },

  //弹出事件
  bindViewTapPuton: function(e) {
    if(this.data.curriculumContent[e.currentTarget.dataset.index].online==0){
      this.data.onshelfStatus="上架"
    }else if(this.data.curriculumContent[e.currentTarget.dataset.index].online==1){
      this.data.onshelfStatus="下架"
    }
    this.setData({
      changeIndex:e.currentTarget.dataset.index,
      onshelfStatus:this.data.onshelfStatus
    })
    this.setData({
      modalHiddenPuton:!this.data.modalHiddenPuton
    })
  },
  //确定按钮点击事件
  modalBindaconfirmPuton:function(){
    if(this.data.curriculumContent[this.data.changeIndex].online==0){
      this.data.curriculumContent[this.data.changeIndex].online=1
    }else if(this.data.curriculumContent[this.data.changeIndex].online==1){
      this.data.curriculumContent[this.data.changeIndex].online=0
    }
    this.setData({
      modalHiddenPuton:!this.data.modalHiddenPuton,
      curriculumContent:this.data.curriculumContent,
    })
    this.updateCourseOnline();
  },
  //取消按钮点击事件
  modalBindcancelPuton:function(){
    this.setData({
      modalHiddenPuton:!this.data.modalHiddenPuton,
    })
  },
  //更新课程上下架
  async updateCourseOnline(e){
    let onlineNum=this.data.curriculumContent[this.data.changeIndex].online
    let update_id=this.data.curriculumContent[this.data.changeIndex]._id
    await  getApp().globalData.cloud.callFunction({
      name:'admin_course',
      data:{
        api:'updateOnline',
        onlineNum,
        update_id
      }
    }).then(res=>{
      console.log(res);
    })
    
      
  },

  //分类框事件
  userchange(e){
    this.setData({
      value1:e.detail
    })
    if(this.data.value1==0){
      this.data.curriculumContent.forEach(function(val,index){
        val.show=false
      });
    }else if(this.data.value1==1){
      this.data.curriculumContent.forEach(function(val,index){
        val.show=true
        if(val.course_category==0){
          val.show=false
        }
      });
    }else if(this.data.value1==2){
      this.data.curriculumContent.forEach(function(val,index){
        val.show=true
        if(val.course_category==1){
          val.show=false
        }
      });
    }else if(this.data.value1==3){
      this.data.curriculumContent.forEach(function(val,index){
        val.show=true
        if(val.course_category==2){
          val.show=false
        }
      });
    }else if(this.data.value1==4){
      this.data.curriculumContent.forEach(function(val,index){
        val.show=true
        if(val.course_category==3){
          val.show=false
        }
      });
    }
    this.setData({
      curriculumContent:this.data.curriculumContent,
    })
    
  },


  async getCourse(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    let lastPages=0;
    const curriDataLength=this.data.curriculumContent.length
    if(curriDataLength!=0&&curriDataLength%10==0){
      lastPages=curriDataLength/10
    }
    else if(curriDataLength!=0&&curriDataLength%10!=0){
      wx.showToast({
        title: '没有更多课程了!',
        icon: 'none',
      });
      return
    }
    const resu=await getApp().globalData.cloud.callFunction({
      name: 'admin_course',
      data: {
        api: 'getAll',
        lastPages
      }
    }).then(async res=>{
      console.log(res);
      for(let i in res.result.data){
        res.result.data[i].show=false;
        for(let v in res.result.data[i].courseImg){
          await getApp().globalData.cloud.getTempFileURL({
            fileList:[res.result.data[i].courseImg[v]],
          }).then(r=>{
            res.result.data[i].courseImg[v]=r.fileList[0].tempFileURL;
          })
      }
    }
      console.log(res.result.data);
      let temp=JSON.parse(JSON.stringify(res.result.data))
      this.data.curriculumContent.push(...temp)
      this.setData({
        curriculumContent:this.data.curriculumContent
      })
      console.log(this.data.curriculumContent);
      wx.hideLoading();
      // if(res.result.code === 1){
      //   console.log(res.result.data);
      // }
        // app.globalData.AddcourseInformation=res.result.data
        // console.log(AddcourseInformation);
    });
    // let pageData=this.data
    // app.globalData.AddcourseInformation.forEach(function(val1,ind1){
    //   pageData.curriculumContent.push(val1)
    //   console.log(pageData.curriculumContent)
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.getCourse()
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
    this.getCourse()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})