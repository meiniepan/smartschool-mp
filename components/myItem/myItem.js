// components/myItem/myItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: ""
    },
    text: {
      type: String,
      value: ""
    },
    click: {
      type: String,
      value: ""
    },
    hidden: {
      type: Boolean,
      value: false
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
    doClick() {
      wx.navigateTo({
        url: this.properties.click,
      })
    }
  }
})
