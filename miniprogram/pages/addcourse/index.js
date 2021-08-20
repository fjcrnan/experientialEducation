var app= getApp();
// pages/addcourse/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stardate:"2020-09-01",
    enddate:"",
    startDateLimit1:"",
    endDateLimit1:"",
    startDateLimit2:"",
    endDateLimit2:"",
    course_id_error:'',
    course_title_error:'',
    course_price_error:'',
    addDisabled:false,
    fileList: [

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
    option3:[
      { text: '请选择基地', value: 0 }
    ],
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
    date: '2020-09-01',
    course_id: "",
    course_title: "",
    course_price: "",
    course_introduce: "",
    basesChoose:[
      // {
      //   id:1,
      //   image:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1029593666,3850812271&fm=26&gp=0.jpg",
      //   name:"广州文峰基地",
      //   choose:false
      // },
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

  //基地标签删除
  onClose(e){
    let index=e.currentTarget.dataset.index;
    this.data.basesChoose[index].choose=!this.data.basesChoose[index].choose
    this.setData({
      basesChoose:this.data.basesChoose
    })
    this.tutorFromChoosen()
  },

  baseChooseTap(e){
    let index=e.currentTarget.dataset.index
    this.data.basesChoose[index].choose=!this.data.basesChoose[index].choose
    this.setData({
      basesChoose:this.data.basesChoose
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


  async uploadImg(fileArr) {
    var arr = []
    for (let i in fileArr) {
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

  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // console.log(file)
    let temp = this.data.fileList
    temp.push(file)
    this.setData({ fileList: temp })
  },
  
  stardatebindDateChange(e){
    let tempDate = e.detail.value
    let a = tempDate.substr(tempDate.length-1,1)
    let b = parseInt(a);
    b = b + 3
    let tempString = tempDate.slice(0,tempDate.length - 1)
    tempString = tempString + b
    console.log(tempString);
    this.setData({
      stardate: e.detail.value,
      startDateLimit2: tempString
    })
  },

  enddatebindDateChange(e){
    this.setData({
      enddate: e.detail.value
    })
  },

  async bindSubmit(e) {
    let form=e.detail.value  
    if (form.course_id === '') {
      wx.showToast({
        title: '请输入课程ID',
        icon: 'none'
      })
      return
    }
    if (form.course_title === '') {
      wx.showToast({
        title: '请输入课程标题',
        icon: 'none'
      })
      return
    }
    if (form.course_category === '') {
      wx.showToast({
        title: '请输入课程类别',
        icon: 'none'
      })
      return
    }
    if (form.course_price === '') {
      wx.showToast({
        title: '请输入课程价格',
        icon: 'none'
      })
      return
    }
    if (form.course_introduce === '') {
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
    form.tutor = tutor
    form.state = this.data.value1
    form.online = this.data.value2
    form.organ = this.data.mechanismInfo[this.data.value4]
    form.course_category=this.data.value5
    form.course_stardate=this.data.stardate
    form.course_enddate=this.data.enddate
    var baseChoosen=new Array()
    this.data.basesChoose.forEach(v => {
      if(v.choose==true){
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
    form.base=baseChoosen
    let temp = this.data.fileList.map(item=>{
      return item.url
    })
    console.log(temp);
    const courseImg = await this.uploadImg(temp)
    form.courseImg = courseImg
    if(form.courseImg.length == 0){
      wx.showToast({
        title: '请提交课程图片',
        icon: 'none'
      })
      return
    }
    console.log(form)
    getApp().globalData.cloud.callFunction({
      name: 'admin_course',
      data: {
        api: 'post',
        form
      }
    }).then(res => {
      if (res.result.code === -1) {
        wx.showToast({
          title: res.result.msg,
          icon: 'none'
        })
      }
    })
    wx.redirectTo({
      url: '/pages/curriculumManage/index'
    })
  },

  //获取基地信息
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

  async getTutorUser(){
    await getApp().globalData.cloud.callFunction({
      name:'admin_clientUser',
      data:{
        api:'getTutorUser',
      }
    }).then(res=>{
      console.log(res);
    })
  },
  
  checkContent(e){
    let type=e.currentTarget.dataset.name;
    if(type=='course_id'){
      let check=/^\d{7,11}$/;
      if(!check.test(this.data.course_id)){
        this.setData({course_id_error:"课程ID格式不符"})
      }else{
        this.setData({course_id_error:""})
      }
    }else if(type=='course_title'){

    }else if(type=='course_price'){
      
    }
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

  //时间戳转日期
  formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let timestamp = new Date().getTime();
    let startTime = timestamp - 15552000000
    let startEndTime = timestamp + 15552000000 -604800000
    let endTime = timestamp + 15552000000
    let nowDate = this.formatDate(timestamp);
    let endDate = this.formatDate(timestamp + 604800000)
    let startEndDate = this.formatDate(startEndTime)
    let startDateLimit = this.formatDate(startTime);
    let endDateLimit = this.formatDate(endTime);
    this.setData({
      stardate: nowDate,
      enddate: endDate,
      startDateLimit1: startDateLimit,
      endDateLimit1: startEndDate,
      startDateLimit2: endDate,
      endDateLimit2: endDateLimit
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    await this.getBaseUser()
    await this.getMechanismUser()
    await this.getTutorUser()
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

