// components/SearchInput/SearchInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    keyWords:{
      type:String,
      value:""
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
    onChange(e) {
      let val=e.detail;
      this.triggerEvent("searchOnchange",{val});
    },
    onClear(){
      this.triggerEvent("searchOnclear")
    },
  }
})
