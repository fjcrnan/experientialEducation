// components/Select/Select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
     },
    selectData:{
      type:Array,
      value:[]
    },
    index:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectTap(){
      this.triggerEvent("select_tap")
    },
    optionTap(e){
      let Index=e.currentTarget.dataset.index;
      this.triggerEvent("option_tap",{Index})
    }
  }
})
