// pages/addInvolve/addInvolve.js
import {formatShowTime} from "../../utils/util";

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        navigationHeight: app.globalData.navigationHeight,
        mCurrent: 0, // 当前tab
        mData: [],
        mDataLeft: [],
        mDataRight: [],
    },
    getList(type, folderid, init) {
        let url = ""
        let urlLeft = "/api/v17/teacher/departments/treeDep"
        let urlRight = "/api/v17/teacher/classs/treeClass"
        if (type === 0) {
            url = urlLeft
        } else {
            url = urlRight
        }
        let data = {
            token: wx.getStorageSync('token'),
        }
        app.httpPost(url, data).then((res) => {
            let data = [];
            if (type === 0) {
                console.log("depart",res)
                data = res.respResult;
                data.forEach(res=>{
                    res.id = '0_'+res.id
                })
            } else {
                console.log("class",res)
                res.respResult.forEach(res => {
                    res.list.forEach(res2 => {
                            data.push({id: res2.id, name: res2.levelclass})
                        }
                    )
                })
                data.forEach(res=>{
                    res.id = '1_'+res.id
                })
            }

            let mDataLeft, mDataRight, isEmpty
            if (type === 0) {
                mDataLeft = data
                isEmpty = data.length == 0
            } else {
                mDataRight = data
            }
            if (init === true) {
                this.setData({
                    mDataRight,
                });
            } else {
                if (type === 0) {
                    this.setData({
                        mData: data,
                        mDataLeft,
                        isEmpty
                    });
                } else {
                    this.setData({
                        mData: data,
                        mDataRight,
                    });
                }
            }
        });
    },
    checkPri() {
        if (this.data.mCurrent === 1) {
            this.setData({
                mCurrent: 0,
                mData: this.data.mDataLeft,
                isEmpty: this.data.mDataLeft.length == 0
            })
        }
    },
    checkPub() {
        if (this.data.mCurrent === 0) {
            this.setData({
                mCurrent: 1,
                mData: this.data.mDataRight,
                isEmpty: this.data.mDataRight.length == 0
            })
        }
    },

    doDetail(e) {
        console.log("ee", e.currentTarget)
        let position = e.currentTarget.dataset.position
        let bean = this.data.mData[position]
        bean.type = this.data.mCurrent
        this.setData({
            currentItemId:bean.id
        })
        wx.navigateTo({
            url: '/pages/involvePerson/involvePerson?bean=' + JSON.stringify(bean),
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                involvePerson: function(data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    console.log('aishang', data);
                }
            },

        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('life','load')
        this.getList(0, null)
        this.getList(1, null, true)

    },
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    doConfirm() {
        const involve= []
        this.data.mDataInvolve.forEach(it=>{
            it.data.forEach(it2=>{
                if (it2.checked){
                    involve.push(it2)
                }
            })
        })
        this.getOpenerEventChannel().emit('involvePerson', involve)
        wx.navigateBack({
            delta: 1,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log('life','read')
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