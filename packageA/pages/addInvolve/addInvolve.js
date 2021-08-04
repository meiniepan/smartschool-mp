// pages/addInvolve/addInvolve.js
import {formatShowTime} from "../../../utils/util";

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
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let init = options.init

        let data = JSON.parse(options.data)
        let data2 = JSON.parse(options.data2)
        if (data.length > 0) {
            this.setData({
                mDataDepartment2: data
            })
        }
        if (data2.length > 0) {
            this.setData({
                mDataClasses2: data2
            })

        }
        this.doInit()

        if (options.type == '1') {
            this.setData({
                onlyStu: true,
                marginLeft: "0",
                mCurrent: 1, // 当前tab
            })
            this.getList(1, null)
        } else if (options.type == '0') {
            this.setData({
                onlyDep: true,
                marginLeft: "0",
                mCurrent: 0, // 当前tab
            })
            this.getList(0, null)
        } else {
            this.getList(0, null)
            this.getList(1, null, true)
        }


    },
    getList(type, folderid, init) {
        let that = this, url = ""
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
                let ii = this.data.mDataDepartment2

                data.forEach(res => {

                    res.id = '0_' + res.id
                    res.list = []
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
            url: '/packageA/pages/involvePerson/involvePerson?bean=' + JSON.stringify(bean),
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                involvePerson: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    that.doResult(data);
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
                console.log('curid',it.id)
                console.log('currentItemId',this.data.currentItemId)
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
                    console.log("class", it)
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
    doInit() {
        let involves = []
        this.data.mDataDepartment2.forEach(it => {
            if (it.num > 0) {
                it.list.forEach(it => {
                    involves.push(it)
                })
            }
        })
        this.data.mDataClasses2.forEach(it => {
            if (it.num > 0) {
                it.list.forEach(it => {
                    involves.push(it)
                })
            }
        })
        involves.forEach(it => {
            it.label = it.realname[it.realname.length - 1]
        })
        this.setData({
            mDataInvolve: involves,
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
        let data = {}
        data.mDataDepartment = this.data.mDataDepartment
        data.mDataClasses = this.data.mDataClasses
        console.log('data', data)
        this.getOpenerEventChannel().emit('quantizeSpecial', data)
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
            path: 'pages/splash/splash'
        }
    }
})