// pages/modifycourse/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modifyCourseId:'',
    modifyCourseInformation: '',
    contrastFlie:'',
    fileList: [
      // {
      //   url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg',
      //   name: '图片1',
      // },
    ],
    option1: [
      { text: '未开始', value: 0 },
      { text: '正在进行', value: 1 },
      { text: '已结束', value: 2 },
    ],
    value1: 0,
    option2: [
      { text: '未上架', value: 0 },
      { text: '已上架', value: 1 }
    ],
    value2: 0,
    option3:[{ text: '请选择基地', value: 0 }],
    value3:0,
    option4: [
      { text: '机构一', value: 0 },
      { text: '机构二', value: 1 },
      { text: '机构三', value: 2 },
      { text: '机构四', value: 3 }
    ],
    value4: 0,
    option5: [
      { text: '红色文化类', value: 0 },
      { text: '现代农业类', value: 1 },
      { text: '安全应急类', value: 2 },
      { text: '传统文化类', value: 3 }
    ],
    value5: 0,
    popshow: false,
    basesChoose: [
      // {
      //   id: 1,
      //   image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name: "广州文峰基地",
      //   choose: false
      // },
      // {
      //   id: 2,
      //   image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name: "上海文峰基地",
      //   choose: false
      // },
      // {
      //   id: 3,
      //   image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name: "北京文峰基地",
      //   choose: false
      // },
      // {
      //   id: 4,
      //   image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name: "广州从化基地",
      //   choose: false
      // },
      // {
      //   id: 5,
      //   image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name: "广州天河基地",
      //   choose: false
      // }, {
      //   id: 6,
      //   image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name: "深圳福田基地",
      //   choose: false
      // }
    ]
  },

  //下拉选择传值
  tutorUserchange(e){
    this.setData({
      value3: e.detail
    })
  },

  CourseStartUserchange(e){
    this.setData({
        value1:e.detail
      })
  },
  
  OnlineUserchange(e){
    this.setData({
        value2:e.detail
      })
  },
  
  OrganUserchange(e){
    this.setData({
        value4:e.detail
      })
  },
  
  CategoryUserchange(e){
    this.setData({
        value5:e.detail
      })
  },

  tutorUserchange(e){
    this.setData({
      value3:e.detail
    })
  },

  //时间选择
  stardatebindDateChange: function (e) {
    this.data.modifyCourseInformation.course_stardate = e.detail.value
    this.setData({
      modifyCourseInformation: this.data.modifyCourseInformation
    })
  },
  enddatebindDateChange(e) {
    this.data.modifyCourseInformation.course_enddate = e.detail.value
    this.setData({
      modifyCourseInformation: this.data.modifyCourseInformation
    })
  },

  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },

  //基地标签删除
  onClose(e) {
    let index = e.currentTarget.dataset.index;
    this.data.basesChoose[index].choose = !this.data.basesChoose[index].choose
    this.setData({
      basesChoose: this.data.basesChoose
    })
    this.tutorFromChoosen()
  },

  baseChooseTap(e) {
    let index = e.currentTarget.dataset.index
    this.data.basesChoose[index].choose = !this.data.basesChoose[index].choose
    this.setData({
      basesChoose: this.data.basesChoose
    })
    this.tutorFromChoosen()
  },

  //渲染导师
  tutorFromChoosen(){
    this.data.option3 = []
    let index = 0;
    for(let i in this.data.basesChoose){
      if(this.data.basesChoose[i].choose == true){
        for(let j of this.data.basesChoose[i].tutor){
          this.data.option3.push({ text: j.name, value: index})
          index++
        }
      }
    }
    this.setData({option3: this.data.option3})
    if(this.data.option3.length == 0){
      this.setData({
        option3: [{ text: '请选择基地', value: 0 }],
        value3: 0
      })
    }
    this.setData({value3 :0})
  },

  showPopup() {
    this.setData({ popshow: true });
  },

  PoponClose() {
    this.setData({ popshow: false });
  },


  //获取课程信息
  async getModifycourse(modifyCourseId) {
    var imgFlieArray=[];
    await getApp().globalData.cloud.callFunction({
      name: 'admin_course',
      data: {
        api: 'modifyCourseGet', 
        modifyCourseId
      }
    }).then(async res => {
      for (let v in res.result.data.courseImg) {
        await getApp().globalData.cloud.getTempFileURL({
          fileList: [res.result.data.courseImg[v]],
        }).then(r => {
          imgFlieArray[v] = r.fileList[0].tempFileURL;
        })
      }
      imgFlieArray.forEach((v,i)=>{
        this.data.fileList[i]={
          url:v,
          name:'图片'+i
        }
      })
      console.log(this.data.fileList);
      this.setData({
        modifyCourseInformation: res.result.data,
        fileList:this.data.fileList,
        contrastFlie:this.data.fileList[0].url
      })
      console.log(this.data.contrastFlie);
    })

  },

  //上传图片
  async uploadImg(fileArr) {
    var arr = []
    for (let i in fileArr) {
      console.log(fileArr[i]);
      wx.showLoading({
        title: '加载中',
      })
      const res = await getApp().globalData.cloud.uploadFile({
        cloudPath: 'image/' + Math.floor(Math.random() * 1000000)+'.jpg',
        filePath: fileArr[i],
      })
      wx.hideLoading()
      arr.push(res.fileID)
    }
    return arr
  },

  //读取图片
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // console.log(file)
    let temp = this.data.fileList
    temp.push(file)
    this.setData({ fileList: temp })
  },

  //删除图片
  fileDelete(e){
    let deleteFlie=e.detail.index;
    this.data.fileList.splice(deleteFlie,1)
    this.setData({
      fileList:this.data.fileList
    })
  },

  //提交
  async bindSubmit(e) {
    var modifyform = e.detail.value;
    if (modifyform.course_title === '') {
      wx.showToast({
        title: '请输入课程标题',
        icon: 'none'
      })
      return
    }
    if (modifyform.course_introduce === '') {
      wx.showToast({
        title: '请输入课程简介',
        icon: 'none'
      })
      return
    }
    if (modifyform.course_price === '') {
      wx.showToast({
        title: '请输入课程价格',
        icon: 'none'
      })
      return
    }
    if (modifyform.course_introduce === '') {
      wx.showToast({
        title: '请输入课程简介',
        icon: 'none'
      })
      return
    }
    //取到导师
    let tutor = {};
    for(let i in this.data.basesChoose){
      if(this.data.basesChoose[i].choose == true){
        for(let j of this.data.basesChoose[i].tutor){
          if(j.name == this.data.option3[this.data.value3].text){
            tutor = j
          }
        }
      }
    }
    modifyform.tutor = tutor
    modifyform.state = this.data.value1
    modifyform.online = this.data.value2
    modifyform.organ = this.data.mechanismInfo[this.data.value4]
    modifyform.course_category = this.data.value5
    modifyform.course_stardate = this.data.modifyCourseInformation.course_stardate
    modifyform.course_enddate = this.data.modifyCourseInformation.course_enddate
    var baseChoosen = new Array()
    this.data.basesChoose.forEach(v => {
      if (v.choose == true) {
        baseChoosen.push(v);
      }
    });
    if(baseChoosen.length==0){
      wx.showToast({
        title: '请输选择基地',
        icon: 'none'
      })
      return
    }
    modifyform.base = baseChoosen
    let temp = this.data.fileList.map(item => {
      return item.url
    })
    console.log(temp);
    if(this.data.fileList[0].url!=this.data.contrastFlie){
      const courseImg = await this.uploadImg(temp)
      modifyform.courseImg=courseImg
    } else if(this.data.fileList[0].url==this.data.contrastFlie){
      modifyform.courseImg = this.data.modifyCourseInformation.courseImg
    }
    if(modifyform.courseImg.length == 0){
      wx.showToast({
        title: '请提交课程图片',
        icon: 'none'
      })
      return
    }
    console.log(modifyform)
    wx.showLoading({
      title: '保存中',
    })
    getApp().globalData.cloud.callFunction({
      name: 'admin_course',
      data: {
        api: 'updateCourse',
        update_id:this.data.modifyCourseId,
        modifyform
      }
    }).then(async result => {
      wx.hideLoading();
      if (result.result.code === -1) {
        wx.showToast({
          title: res.result.msg,
          icon: 'none'
        })
      }else if(result.result.code===1){
        await wx.showToast({
          title:"保存成功",
          icon:'none'
        })
        setTimeout(this.pageJump,1000)
      }
      console.log(result);
    })
  },

  pageJump(){
    wx.reLaunch({
      url: '/pages/curriculumManage/index'
    })
  },

  //加载基地信息
  async getBaseUser(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_clientUser',
      data:{
        api:'getBaseUser'
      }
    }).then(async res=>{
      console.log(res.result.data);
      for(let i of res.result.data){
        await getApp().globalData.cloud.getTempFileURL({
          fileList:[i.avatar],
        }).then(r=>{
          i.avatar=r.fileList[0].tempFileURL;
        })
        i.choose=false
      }
      this.setData({basesChoose:res.result.data})
    })
    console.log(this.data.basesChoose);
  },

  //获取机构信息
  async getMechanismUser(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_clientUser',
      data:{
        api:'getMechanismUser'
      }
    }).then(res=>{
      console.log(res.result.data);
      let tempOption=[]
      for(let i in res.result.data){
        let temp={text:res.result.data[i].unitName,value:parseInt(i)}
        tempOption.push(temp);
      }
      this.setData({
        option4:tempOption,
        mechanismInfo:JSON.parse(JSON.stringify(res.result.data))
      })
    })
  },

  //获取导师信息
  async getTutorUser(){
    await getApp().globalData.cloud.callFunction({
      name:'user',
      data:{
        api:'getTutorUser'
      }
    }) .then(res=>{
      console.log(res);
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
      this.selectComponent('#courseStatus').toggle(false)
      this.selectComponent('#courseOnline').toggle(false)
      this.selectComponent('#organChoose').toggle(false)
      this.selectComponent('#courseCategory').toggle(false)
      this.selectComponent('#tutorChoose').toggle(false)
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    const ModifyCourseId = e.id;
    this.setData({modifyCourseId: e.id})
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    await this.getModifycourse(ModifyCourseId);
    await this.getBaseUser();
    await this.getMechanismUser();
    //基地
    this.data.modifyCourseInformation.base.forEach(element => {
      this.data.basesChoose.forEach(v => {
        if (v.unitName == element.unitName) {
          v.choose = true;
        }
      })
    });
    //机构
    for(let i in this.data.mechanismInfo){
      if(this.data.modifyCourseInformation.organ.unitName==this.data.mechanismInfo[i].unitName){
        this.data.value4=parseInt(i);
      }
    }
    this.setData({
      value1: this.data.modifyCourseInformation.state,
      value2: this.data.modifyCourseInformation.online,
      value4: this.data.value4,
      value5: this.data.modifyCourseInformation.course_category,
      basesChoose: this.data.basesChoose,
    })
    //导师
    this.tutorFromChoosen();
    for(let i in this.data.option3){
      if(this.data.option3[i].text == this.data.modifyCourseInformation.tutor.name){
        this.setData({value3: parseInt(i)})
      }
    }
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