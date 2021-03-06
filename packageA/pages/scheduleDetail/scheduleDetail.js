// pages/scheduleDetail/scheduleDetail.js
import {showModal, showToastWithoutIcon} from "../../../utils/util";

let app = getApp()
const globalData = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bean: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(decodeURIComponent(options.bean))
        bean.token = wx.getStorageSync("token")
        this.setData({
            bean: bean
        })
    },
    doEdit(e) {
        let bean = this.data.bean
        let url = '/packageA/pages/addSchedule/addSchedule?bean=' + JSON.stringify(bean) + '&isModify=1'
        wx.navigateTo({
            url: url,
        })
    },
    doReceive(e) {
        let ss = e.currentTarget.dataset.bean
        let str = ""
        try {
            ss = JSON.parse(ss)
            if (ss.length > 0) {
                ss.forEach(it => {
                        str = str + it.realname + "、"
                    }
                )
                str = str.substring(0, str.length - 1)
            }
        } catch (e) {

        }
        let url = '/packageA/pages/persons/persons?str=' + str
        wx.navigateTo({
            url: url,
        })
    },
    doDelete() {
        showModal(
            globalData.deleteSure,
            '温馨提示',
            (res) => {
                if (res.confirm) {
                    let bean = this.data.bean
                    let url = ''

                    if (wx.getStorageSync("usertype") == "1") {
                        url = '/api/v17/student/schedules/del'
                    } else {
                        url = '/api/v17/teacher/schedules/del'
                    }
                    let data = bean
                    app.httpPost(url, data).then((res) => {
                        showToastWithoutIcon('处理完成')
                        wx.navigateBack({
                            delta: 1
                        })
                    });
                } else if (res.cancel) {

                }
            }
        )


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
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})