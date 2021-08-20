// pages/home/index.js
var app = getApp();
var userNumbers = {bases: 0,mechanmism: 0,students: 0,teacher: 0};
var Chart = null;

import * as echarts from '../../ec-canvas/echarts';
const getPixelRatio = () => {
  let pixelRatio = 0
  wx.getSystemInfo({
    success: function (res) {
      pixelRatio = res.pixelRatio
    },
    fail: function () {
      pixelRatio = 0
    }
  })
  return pixelRatio
}
var dpr = getPixelRatio()


Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-09-01',
    ec: {
        // onInit:initChart,
        lazyLoad: true,
    },
    echartsData: {

    },
    administratorId: "",
    privilegeLevel: "",
    valueId:'',
    userValue:'',
    paperData: {
      day: {
        upperLists: [
          {
            use_describe: "学生用户量",
            number: 0,
            annotation: "较上个月提升0"
          },
          {
            use_describe: "教师用户量",
            number: 0,
            annotation: "较上一日提升0"
          }
        ],
        lowerLists: [
          {
            use_describe: "访问量",
            number: 12,
            annotation: "较上一日提升10"
          },
          {
            use_describe: "订单量",
            number: 3,
            annotation: "较上一日提升50"
          },
          {
            use_describe: "订单额",
            number: 405,
            annotation: "较上一日提升37"
          }
        ]
      },
      week: {
        upperLists: [
          {
            use_describe: "学生用户量",
            number: 0,
            annotation: "较上一周提升0"
          },
          {
            use_describe: "教师用户量",
            number: 0,
            annotation: "较上一周提升0"
          }
        ],
        lowerLists: [
          {
            use_describe: "访问量",
            number: 105,
            annotation: "较上一周提升10"
          },
          {
            use_describe: "订单量",
            number: 64,
            annotation: "较上一周提升14"
          },
          {
            use_describe: "订单额",
            number: 804,
            annotation: "较上一周提升27"
          }
        ]
      },
      month: {
        upperLists: [
          {
            use_describe: "学生用户量",
            number: 0,
            annotation: "较上个月提升0"
          },
          {
            use_describe: "教师用户量",
            number: 0,
            annotation: "较上个月提升0"
          }
        ],
        lowerLists: [
          {
            use_describe: "访问量",
            number: 343,
            annotation: "较上个月提升34"
          },
          {
            use_describe: "订单量",
            number: 74,
            annotation: "较上个月提升54"
          },
          {
            use_describe: "订单额",
            number: 1104,
            annotation: "较上个月提升67"
          }
        ]
      }
    },
    

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //获取用户数量方法
  async getUseNumbers() {
    if(getApp().globalData.cloud === null) return setTimeout(this.getUseNumbers, 200)
    await getApp().globalData.cloud.callFunction({
      name: 'admin_homeData',
      data: {
        api: 'getUserNumbers',
      }
    }).then(res => {
      console.log(res);
      userNumbers.students = res.result.userNumbers.students.total;
      userNumbers.teacher = res.result.userNumbers.teacher.total;
      userNumbers.bases = res.result.userNumbers.bases.total;
      userNumbers.mechanmism = res.result.userNumbers.mechanmism.total;
      this.init_echarts()
    })
    wx.hideLoading()
  },

  //echart初始化
  init_echarts() {
    this.echartsComponnet.init((canvas,width,height) => {
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      Chart.setOption(this.getOption());
      return Chart;
    });
  },
  getOption() {
    var option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '0%',
        left: 'center'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: userNumbers.students, name: '学生用户', itemStyle: { color: '#F8A488' } },
            { value: userNumbers.teacher, name: '教师用户', itemStyle: { color: '#EAD3CB' } },
            { value: userNumbers.mechanmism, name: '机构用户', itemStyle: { color: '#B0EFEB' } },
            { value: userNumbers.bases, name: '基地用户', itemStyle: { color: '#D8E3E7' } }
          ]
        }
      ]
    }
    return option
  },

  //日报，周报，月报
  async getPaperData() {
    if(getApp().globalData.cloud === null) return setTimeout(this.getPaperData,200)
    await getApp().globalData.cloud.callFunction({
      name:'admin_homeData',
      data: {
        api: 'gerPaperData',
      }
    }).then(res => {
      console.log(res);
      let paperInfo = res.result.userPaperCount
      let stuDayPromote = paperInfo.day.studentCount.total/(paperInfo.preDay.studentCount.total==0?1:paperInfo.preDay.studentCount.total) * 100;
      // let teacherDayPromote = paperInfo.day.teacherCount.total/(paperInfo.preDay.teacherCount.total==0?1:paperInfo.preDay.teacherCount.total) * 100;
      let stuWeekPromote = paperInfo.week.studentCount.total/(paperInfo.preWeek.studentCount.total==0?1:paperInfo.preWeek.studentCount.total) * 100;
      let teacherWeekPromote = paperInfo.week.teacherCount.total/(paperInfo.preWeek.teacherCount.total==0?1:paperInfo.preWeek.teacherCount.total) * 100;
      let stuMonthPromote = paperInfo.month.studentCount.total/(paperInfo.preMonth.studentCount.total==0?1:paperInfo.preMonth.studentCount.total) * 100;
      let teacherMonthPromote = paperInfo.month.teacherCount.total/(paperInfo.preMonth.teacherCount.total==0?1:paperInfo.preMonth.teacherCount.total) * 100;
      
      this.data.paperData.day.upperLists[0].number = paperInfo.day.studentCount.total
      this.data.paperData.day.upperLists[0].annotation = "较上一天提升"+stuDayPromote.toFixed(1)+""
      this.data.paperData.day.upperLists[1].number = paperInfo.day.teacherCount.total
      // this.data.paperData.day.upperLists[1].annotation = "较上一天提升"+teacherDayPromote.toFixed(1)+""

      this.data.paperData.week.upperLists[0].number = paperInfo.week.studentCount.total
      this.data.paperData.week.upperLists[0].annotation = "较上一周提升"+stuWeekPromote.toFixed(1)+""
      this.data.paperData.week.upperLists[1].number = paperInfo.week.teacherCount.total
      this.data.paperData.week.upperLists[1].annotation = "较上一周提升"+teacherWeekPromote.toFixed(1)+""

      this.data.paperData.month.upperLists[0].number = paperInfo.month.studentCount.total
      this.data.paperData.month.upperLists[0].annotation = "较上一月提升"+stuMonthPromote.toFixed(1)+""
      this.data.paperData.month.upperLists[1].number = paperInfo.month.teacherCount.total
      this.data.paperData.month.upperLists[1].annotation = "较上一月提升"+teacherMonthPromote.toFixed(1)+""

      this.setData({
        paperData:this.data.paperData
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    let that = this;
    let value = wx.getStorageSync('userInfo')
    if (value) {
      console.log(value);
      that.setData({
        administratorId: value.name,
        privilegeLevel: value.level,
        userValue:value
      })
      // await this.checkUserInfo()
    }else{
      wx.redirectTo({
        url: '/pages/index/index',
      });
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.getUseNumbers()
    this.getPaperData()
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
    let value = wx.getStorageSync('userInfo')
    if(value){
      app.checkUserInfo()
    }
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