// pages/addInvolve2/addInvolve2.js
import {formatShowTime, showModal} from "../../../utils/util";

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
        mDataDepartment2: [],
        mDataClasses2: [],
        mDataInvolve: [],
        isManage: false,
        confirmStr: '确定',
        marginLeft: "34rpx",
        onlyDep: false,
        onlyStu: false,
        b0: false,
        mData0: [],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
            this.getList(0, null)
    },

    doSearch(e) {
        let key = e.detail.value
        if (key.length > 0) {
            let url = "/api/v17/teacher/teacher/listByDep"
            let data = {
                token: wx.getStorageSync('token'),
                realname: key,
            }

                //只有老师
                app.httpPost(url, data).then((res) => {
                    let data = res.respResult.data;
                    data.forEach(res => {
                        res.d = res.dep_name
                    })
                    let isEmpty0
                    isEmpty0 = data.length == 0
                    this.setData({
                        isEmpty0,
                        mData0: data,
                        b0: true,
                    })
                })
        }
    },
    doClear() {
        this.setData({
            b0: false,
        })
    },
    doDetail0(e) {
        let bean = e.currentTarget.dataset.bean
        this.getOpenerEventChannel().emit('involvePerson', bean.uid)
        wx.navigateBack({
            delta: 1,
        })
    },
    doCheck(e) {
        var p = e.currentTarget.dataset.position
        var checked = this.data.mDataLabel[p].checked
        this.data.mDataLabel[p].checked = !checked

        this.setData({
            mDataLabel: this.data.mDataLabel
        })
    },
    getList(type, init) {
        let that = this, url = ""
        let urlLeft = "/api/v17/teacher/departments/treeDep"
        let urlRight = "/api/v17/teacher/classs/treeClass"
        let data = {
            token: wx.getStorageSync('token'),
        }
            url = urlLeft

        app.httpPost(url, data).then((res) => {
            let data = [];
            if (type === 0) {
                data = res.respResult;
                let ii = this.data.mDataDepartment2

                data.forEach(res => {

                    res.id = '0_' + res.id
                    res.list = []
                    res.num = "0"
                    if (ii.length > 0) {
                        ii.forEach(it => {
                            if (res.id == it.id) {
                                res.list = it.list
                                res.num = it.list.length.toString()
                            }
                        })
                    }
                })
            } else {
                let ii = this.data.mDataClasses2
                res.respResult.forEach(res => {
                    res.list.forEach(res2 => {
                            data.push({id: res2.id, name: res2.levelclass})
                        }
                    )
                })
                data.forEach(res => {

                    res.id = '1_' + res.id
                    res.list = []
                    res.num = "0"
                    if (ii.length > 0) {
                        ii.forEach(it => {
                            if (res.id == it.id) {
                                res.list = it.list
                                res.num = it.list.length.toString()
                            }
                        })
                    }
                })
            }

            let mDataDepartment, mDataClasses, isEmpty
            isEmpty = data.length == 0
            if (type === 0) {
                mDataDepartment = data
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
                        isEmpty
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
        var this_ = this
        let position = e.currentTarget.dataset.position
        let bean = this.data.mData[position]
        bean.type = this.data.mCurrent
        this.setData({
            currentItemId: bean.id
        })
        wx.navigateTo({
            url: '/packageA/pages/involvePerson2/involvePerson2?bean=' + JSON.stringify(bean),
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                involvePerson: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    this_.getOpenerEventChannel().emit('involvePerson', data)
                    wx.navigateBack({
                        delta: 1,
                    })
                }
            },

        })
    },

    doDelete(e) {
        if (this.data.isManage) {
            var p = e.currentTarget.dataset.position

            this.data.mDataDepartment.forEach(it => {

                if (it.id == this.data.mDataInvolve[p].parentId) {
                    if (it.num > 0) {
                        for (let i = 0; i < it.list.length; i++) {
                            if (it.list[i].uid == this.data.mDataInvolve[p].uid) {
                                it.list.splice(i, 1)
                                break
                            }
                        }
                        it.num = (it.num - 1)
                    }
                }
            })
            this.data.mDataClasses.forEach(it => {
                if (it.id == this.data.mDataInvolve[p].parentId) {
                    if (it.num > 0) {
                        for (let i = 0; i < it.list.length; i++) {
                            if (it.list[i].uid == this.data.mDataInvolve[p].uid) {
                                it.list.splice(i, 1)
                                break
                            }
                        }
                        it.num = (it.num - 1)
                    }
                }
            })

            this.data.mDataInvolve.splice(p, 1)
            this.setData({
                mDataInvolve: this.data.mDataInvolve,
                mDataDepartment: this.data.mDataDepartment,
                mDataClasses: this.data.mDataClasses,
                mData: this.data.mData,
            })
            this.setPersonNum()
        }
    },


    doResult(data) {
        var removeList = []
        var receiveList = data

        for (let i = this.data.mDataInvolve.length - 1; i >= 0; i--) {

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
                if (it.id == this.data.currentItemId) {
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
            mDataInvolve: this.data.mDataInvolve,
            mData: this.data.mData,
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

    doManage() {
        this.setData({
            isManage: !this.data.isManage
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
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})