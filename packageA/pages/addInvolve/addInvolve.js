// pages/addInvolve/addInvolve.js
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
        mDataLabel: [{label: "all", name: "所有人", checked: false},
            {label: "teacher", name: "所有老师", checked: false},
            {label: "classmaster", name: "所有班主任", checked: false},
            {label: "students", name: "所有学生", checked: false},],
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

        this.setData({
            fromType: options.all,
            type: options.type,
        })
        if (options.type == '1') {
            this.setData({
                onlyStu: true,
                hideLabel: true,
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
    doSearch(e) {
        let key = e.detail.value
        console.log("key", key)
        if (key.length > 0) {
            let url = "/api/v17/teacher/teacher/listByDep"
            let data = {
                token: wx.getStorageSync('token'),
                realname: key,
            }

            if (this.data.type == "0") {
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
            } else if (this.data.type == "1") {
                //只有学生
                let url2 = "/api/v17/teacher/student/listByClass"
                let data2 = {
                    token: wx.getStorageSync('token'),
                    realname: key,
                }

                if (this.data.fromType == "0") {

                } else {
                    data2 = {
                        token: wx.getStorageSync('token'),
                        realname: key,
                        isall: "all",
                    }
                }

                app.httpPost(url2, data2).then((res) => {
                    let data2 = res.respResult.data;
                    data2.forEach(res => {
                        res.d = res.levelclass
                    })
                    let isEmpty0
                    isEmpty0 = data2.length == 0

                    this.setData({
                        isEmpty0,
                        mData0: data2,
                        b0: true,
                    })

                })
            } else {
                app.httpPost(url, data).then((res) => {
                    let data = res.respResult.data;
                    console.log("res", data)

                    data.forEach(res => {
                        res.d = res.dep_name
                    })


                    let url2 = "/api/v17/teacher/student/listByClass"
                    let data2 = {
                        token: wx.getStorageSync('token'),
                        realname: key,
                    }

                    if (this.data.fromType == "0") {

                    } else {
                        data2 = {
                            token: wx.getStorageSync('token'),
                            realname: key,
                            isall: "all",
                        }
                    }

                    app.httpPost(url2, data2).then((res) => {
                        let data2 = res.respResult.data;
                        console.log("data2", data2)
                        data2.forEach(res => {
                            res.d = res.levelclass
                        })
                        data = data.concat(data2)
                        let isEmpty0
                        isEmpty0 = data.length == 0
                        this.setData({
                            isEmpty0,
                            mData0: data,
                            b0: true,
                        })
                    })
                })
            }
        }
    },
    doClear() {
        this.setData({
            b0: false,
        })
    },
    doDetail0(e) {
        let bean = e.currentTarget.dataset.bean
        var pId = ""
        var tab1 = "0"
        var tab2 = "1"
        let top, sec = null
        if (bean.deps != null && bean.deps.length > 0) {
            top = bean.deps[0].topdepartid
            sec = bean.deps[0].secdepartid
        }
        var studentBean = {
            uid: bean.uid,
            realname: bean.realname,
            label: bean.realname[bean.realname.length - 1],
            usertype: bean.usertype,
            topdepartid: top,
            secdepartid: sec,
            choice: "1",
            parentId: pId
        }
        var msg = bean.realname + ""
        showModal(
            msg,
            '请确认身份',
            (res) => {
                if (res.confirm) {
                    console.log("mm", this.data.mDataDepartment)
                    if (studentBean.topdepartid == null || !studentBean.topdepartid.length > 0) {
                        //学生
                        studentBean.parentId = tab2 + "_" + bean.classid
                        console.log("par", studentBean.parentId)
                        this.data.mDataClasses.forEach(it => {
                            if (studentBean.parentId == it.id) {
                                var bb = false
                                it.list.forEach(it => {
                                    if (it.uid == studentBean.uid) {
                                        bb = true
                                    }
                                })
                                if (!bb) {
                                    if (it.num == "0") {
                                        it.list = []
                                        it.list.push(studentBean)
                                    } else {
                                        it.list.push(studentBean)
                                    }
                                    it.num = (parseInt(it.num) + 1).toString()
                                }
                            }
                        })
                    } else {
                        studentBean.parentId = tab1 + "_" + studentBean.topdepartid
                        console.log("par", studentBean.parentId)
                        this.data.mDataDepartment.forEach(it => {
                            if (studentBean.parentId == it.id) {
                                var bb = false
                                it.list.forEach
                                {
                                    if (it.uid == studentBean.uid) {
                                        bb = true
                                    }
                                }
                                if (!bb) {
                                    if (it.num == "0") {
                                        it.list = []
                                        it.list.push(studentBean)
                                    } else {
                                        it.list.push(studentBean)
                                    }
                                    it.num = (
                                        parseInt(it.num) + 1
                                    ).toString()
                                }
                            }
                        })
                    }
                    var bb = false
                    this.data.mDataInvolve.forEach(it => {
                        if (it.uid == studentBean.uid && it.parentId == studentBean.parentId) {
                            bb = true
                        }
                    })
                    if (!bb) {

                        this.data.mDataInvolve.push(
                            studentBean
                        )
                        this.setData({
                            mDataDepartment: this.data.mDataDepartment,
                            mDataClasses: this.data.mDataClasses,
                            mData: this.data.mData,
                            mDataInvolve: this.data.mDataInvolve
                        })
                        this.setPersonNum()
                    }

                    this.setData({
                        b0: false
                    })
                }
            }
        )
    },
    doCheck(e) {
        var p = e.currentTarget.dataset.position
        var checked = this.data.mDataLabel[p].checked
        this.data.mDataLabel[p].checked = !checked

        this.setData({
            mDataLabel: this.data.mDataLabel
        })
    },
    getList(type, folderid, init) {
        let that = this, url = ""
        let urlLeft = "/api/v17/teacher/departments/treeDep"
        let urlRight = "/api/v17/teacher/classs/treeClass"
        let data = {
            token: wx.getStorageSync('token'),
        }
        if (type === 0) {
            url = urlLeft
        } else {
            if (this.data.fromType == "0") {

            } else {
                data = {
                    token: wx.getStorageSync('token'),
                    isall: "all",
                }
            }
            url = urlRight
        }

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
                console.log('curid', it.id)
                console.log('currentItemId', this.data.currentItemId)
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
        let label = ""
        let labelStr = ""
        this.data.mDataLabel.forEach(item => {
            if (item.checked) {
                label = label + item.label + ","
                labelStr = labelStr + item.name + ","
            }
        })
        if (label.length > 0) {
            label = label.substring(0, label.length - 1)
            labelStr = labelStr.substring(0, labelStr.length - 1)
        }
        console.log(label)
        let data = {}
        data.mDataDepartment = this.data.mDataDepartment
        data.mDataClasses = this.data.mDataClasses
        data.label = label
        data.labelStr = labelStr
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