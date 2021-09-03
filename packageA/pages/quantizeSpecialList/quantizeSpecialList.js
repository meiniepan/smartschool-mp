// pages/quantizeSpecialList/quantizeSpecialList.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bean: {},
        mData: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)
        this.setData({
            bean,
        })
        this.getData()
    },
    getData() {
        let url = '', data = {};
        if (this.data.bean.typename == '特殊情况报备') {
            url = "/api/v17/moral/moralRuleSpecial/slists"
            data = {
                token: wx.getStorageSync('token'),
            }
            app.httpPost(url, data).then((res) => {
                let data = res.respResult.data;

                this.setData({
                    mData: data,
                    isEmpty: data.length == 0,

                })
            });
        } else {
            url = "/api/v17/moral/moralScore/slists"
            data = {
                token: wx.getStorageSync('token'),
                typeid: this.data.bean.id,
            }
            app.httpPost(url, data).then((res) => {
                let data = res.respResult.data;
                console.log('mm', data)

                data.forEach(data => {
                    if (data.templatedata != null) {
                        data.templatedata = JSON.parse(data.templatedata)
                        data.templatedata.forEach(it => {
                            if (it.name == 'ChoseStudents') {
                                if (it.value != null) {
                                    try {
                                        it.value = JSON.parse(it.value)
                                        it.value = this.doResult(it.value)
                                    } catch (e) {

                                    }
                                }
                            }
                        })
                    } else {
                        data.templatedata = []
                    }
                })

                this.setData({
                    mData: data,
                    isEmpty: data.length == 0,

                })
            });
        }


    },
    doResult(data) {
        let str = ''


        data.forEach(it => {
            str = str + it.realname + "、"
        })
        str = str.substring(0, str.length - 1)
        return str
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
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})