// packageA/pages/archives/archives.js
const {isEmpty} = require("../../../utils/util");
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img: "/assets/images/ic_avatar_default.png",
        title: "教师成长档案",
        curTab: 0,
        mDataTab:[],
        bac: "",
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bac = wx.getStorageSync("archives_bac2")
        if (bac.length > 0) {
            this.setData({
                bac,
            })
        } else {
            this.getBac();
        }
        this.getData(options.uid)

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
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    doSearch(){
        let this_ = this
        wx.navigateTo({
            url: "../addInvolve2/addInvolve2",
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                involvePerson: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    console.log("uid===",data)
                    this_.getData(data);
                }
            },
        });
    },
    getBac: function () {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        wx.cloud.downloadFile({
            fileID: 'cloud://env-4gwafyi0129f4b02.656e-env-4gwafyi0129f4b02-1308234288/bac_archives.png',
            success: res => {
                // get temp file path
                wx.setStorageSync("archives_bac2", res.tempFilePath)
                this.setData({
                    bac: res.tempFilePath,
                })

            },
            fail: err => {
                // handle error

            }
        })
    },

    binderror(e) {
        this.data.mData.portrait = "/assets/images/ic_avatar_default.png"
        this.setData({
            mData:this.data.mData,
        })
    },
    getData(uid) {
        let url = "/api/v17/develop/teachers/info"
        let data = {
            token: wx.getStorageSync('token'),
            uid: uid,
        }

        app.httpPost(url, data).then((res) => {
            console.log("data", res)
            let mData = res.respResult
            if (!isEmpty(mData.portrait)){
                mData.portrait = wx.getStorageSync("domain") + mData.portrait;
            }else {
                mData.portrait= "/assets/images/ic_avatar_default.png"
            }
            let sex = mData.sex == "1" ? "男" : mData.sex == "2" ? "女" : "未知";
            if (mData.work_year.length > 0) {
                mData.work_year = mData.work_year + "年"
            }
            if (mData.teach_year.length > 0) {
                mData.teach_year = mData.teach_year + "年"
            }
            mData.sex = sex
            this.setData({
                mData,
            })
        })
    },
    check0(e) {
        this.setData({
            curTab: 0,
        })
    },
    check1(e) {
        this.setData({
            curTab: 1,
        })
    },
    check2(e) {
        this.setData({
            curTab: 2,
        })
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
