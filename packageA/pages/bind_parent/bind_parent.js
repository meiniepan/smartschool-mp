// pages/bind_parent/bind_parent.js
import {showToastWithoutIcon} from "../../../utils/util";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.getData()
    },
    getData(){
        let mData = [];
        let isEmpty=false;
        mData = mData.concat(JSON.parse(wx.getStorageSync('parents')))
        if (mData.length == 0) {
            isEmpty = true;
        }
        console.log("parents",mData)

        this.setData({
            isEmpty,
            mData
        })
    },
    act0(e) {
        wx.showModal({
            title: '是否确定解除该家长',
            content: '解除后不可恢复请慎重选择是否解除与该家长的绑定',
            success: res=> {
                if (res.confirm) {
                    let p = e.currentTarget.dataset.phone
                    if (p.length > 0) {
                        let data = {
                            token: wx.getStorageSync('token'),
                            phone: p,
                        };
                        app.httpPost('/api/v17/user/student/pUnbind', data).then((res) => {
                            showToastWithoutIcon("解绑成功")
                            wx.setStorageSync('parents',JSON.stringify(res.respResult.parents))
                            this.getData()
                        });
                    } else {
                        showToastWithoutIcon("请输入完整信息")
                        return
                    }
                }
            }
        })

    },
    confirm() {
        wx.navigateTo({
            url: '/packageA/pages/bind_parent_2/bind_parent_2',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
