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
        mDataDepartment: [],
        mDataClasses: [],
        mDataInvolve: [],
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
                data = res.respResult;
                data.forEach(res => {
                    res.id = '0_' + res.id
                })
            } else {
                res.respResult.forEach(res => {
                    res.list.forEach(res2 => {
                            data.push({id: res2.id, name: res2.levelclass})
                        }
                    )
                })
                data.forEach(res => {
                    res.id = '1_' + res.id
                })
            }

            let mDataDepartment, mDataClasses, isEmpty
            if (type === 0) {
                mDataDepartment = data
                isEmpty = data.length == 0
            } else {
                mDataClasses = data
            }
            if (init === true) {
                this.setData({
                    mDataClasses,
                });
            } else {
                if (type === 0) {
                    this.setData({
                        mData: data,
                        mDataDepartment,
                        isEmpty
                    });
                } else {
                    this.setData({
                        mData: data,
                        mDataClasses,
                    });
                }
            }
        });
    },
    checkPri() {
        if (this.data.mCurrent === 1) {
            this.setData({
                mCurrent: 0,
                mData: this.data.mDataDepartment,
                isEmpty: this.data.mDataDepartment.length == 0
            })
        }
    },
    checkPub() {
        if (this.data.mCurrent === 0) {
            this.setData({
                mCurrent: 1,
                mData: this.data.mDataClasses,
                isEmpty: this.data.mDataClasses.length == 0
            })
        }
    },

    doDetail(e) {
        var that = this
        let position = e.currentTarget.dataset.position
        let bean = this.data.mData[position]
        bean.type = this.data.mCurrent
        this.setData({
            currentItemId: bean.id
        })
        wx.navigateTo({
            url: '/pages/involvePerson/involvePerson?bean=' + JSON.stringify(bean),
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                involvePerson: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    that.doResult(data);
                }
            },

        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.receive != null) {
            this.setData({
                mDataReceive: JSON.parse(options.receive)
            })
        }
        this.getList(0, null)
        this.getList(1, null, true)

    },
    doResult(data) {
        var removeList = []
        var receiveList = data
        this.data.mDataInvolve.forEach((it, index, array) => {

        })
        for (let i = this.data.mDataInvolve.length-1; i >=0 ; i--) {
            if (this.data.mDataInvolve[i].parentId == this.data.currentItemId) {
                this.data.mDataInvolve.splice(i, 1)
            }
        }
        if (this.data.mCurrent == '0') {
            this.data.mDataDepartment.forEach(it => {
                if (it.id == this.data.currentItemId) {
                    it.list = receiveList
                    it.num = receiveList.length
                }
            })
            this.setData({
                mDataDepartment: this.data.mDataDepartment
            })
        } else {
            this.data.mDataClasses.forEach(it => {
                if (it.id == currentItemId) {
                    it.list = receiveList
                    it.num = receiveList.length
                }
            })
            this.setData({
                mDataClasses: this.data.mDataClasses
            })
        }

        this.data.mDataInvolve = this.data.mDataInvolve.concat(receiveList)
        this.setData({
            mDataInvolve: this.data.mDataInvolve
        })
        this.setPersonNum()
    },
    setPersonNum() {
        let num = this.data.mDataInvolve.length
        if (num > 0) {
            this.setData({
                confirmStr: '确定(' + num + ')',
                manage: true
            })
        } else {
            this.setData({
                confirmStr: '确定',
                manage: false
            })
        }
    },
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    doConfirm() {
        const involve = []
        this.data.mDataInvolve.forEach(it => {
            it.data.forEach(it2 => {
                if (it2.checked) {
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