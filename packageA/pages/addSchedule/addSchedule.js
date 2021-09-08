// pages/addSchedule/addSchedule.js
import {showToastWithoutIcon, zero} from "../../../utils/util";

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: {
            token: '',
            scheduletime: '请选择开始时间',
            scheduleover: '请选择结束时间',
            stuStr: '',
            title: '',
            involve: '',
            sendlabel: '',
            remark: '',
        },
        chosenDay: '',
        showChooseStudent: false,
        isModify: false,
        bean: {},
        departData: [],
        classData: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        let b = {}, isModify = false
        if (options.isModify == '1') {
            isModify = true
            b = JSON.parse(options.bean)
            b.token = wx.getStorageSync('token')
            this.setData({
                requestBody: b,
                isModify,
            })
            if (b.involve.length > 0) {
                this.doInvolve(JSON.parse(b.involve))
            }
        } else {
            let chosenDay = ''
            let temp = new Date()
            let h = temp.getHours()
            let m = temp.getMinutes()
            chosenDay = options.chosenDay + " " + zero(h) + ":" + zero(m)
            b = this.data.requestBody
            b.scheduletime = chosenDay
            b.scheduleover = chosenDay
            this.setData({
                requestBody: b,
                isModify,
            })
        }
        let showChooseStudent = false
        if (wx.getStorageSync("usertype") == "1") {

        } else {
            if (this.data.isModify && this.data.requestBody.cuser_id != wx.getStorageSync("uid")) {

            } else {
                showChooseStudent = true
            }
        }
        this.setData({
            showChooseStudent,
        })
    },

    doConfirm() {
        let bean = this.data.requestBody
        bean.token = wx.getStorageSync('token')
        let isModify = this.data.isModify
        let url = ''
        if (bean.scheduletime == "请选择开始时间" ||
            bean.scheduleover == "请选择结束时间" ||
            bean.title == null || bean.title == '') {
            showToastWithoutIcon('请完善信息')
            return
        }
        if (wx.getStorageSync("usertype") == "1") {
            if (isModify) {
                url = '/api/v17/student/schedules/modify'
            } else {
                url = '/api/v17/student/schedules/add'
            }
        } else {
            if (isModify) {
                url = '/api/v17/teacher/schedules/modify'
            } else {
                url = '/api/v17/teacher/schedules/add'
            }
        }

        let data = bean
        console.log('bean', data)
        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            wx.navigateBack({
                delta: 1
            })
        });
    },
    doChooseStudent() {
        let that = this
        let depart = that.data.departData
        let classes = that.data.classData

        console.log('depart', depart)
        wx.navigateTo({
            url: "../addInvolve/addInvolve?data=" + JSON.stringify(depart)
                + '&data2=' + JSON.stringify(classes),
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                quantizeSpecial: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    that.doResult(data);
                }
            },
        });
    },
    doInvolve(involve) {
        let departData = [];
        let classData = [];
        if (involve.length > 0) {
            let mMap1 = new Map(), mMap2 = new Map();
            involve.forEach(it => {
                if (it.topdepartid == "grade0") {
                    it.secdepartid = '1_' + it.secdepartid
                    it.parentId = it.secdepartid
                    if (mMap2.get(it.secdepartid) == null) {
                        var mList = []
                        mList.push(it)
                        if (it.secdepartid != null) {
                            mMap2.set(it.secdepartid, mList)
                        }

                    } else {
                        mList = mMap2.get(it.secdepartid)
                        mList.push(it)
                        if (it.secdepartid != null) {
                            mMap2.set(it.secdepartid, mList)
                        }
                    }
                } else {
                    it.topdepartid = '0_' + it.topdepartid
                    it.parentId = it.topdepartid
                    if (mMap1.get(it.topdepartid) == null) {
                        var mList = []
                        mList.push(it)
                        if (it.topdepartid != null) {
                            mMap1.set(it.topdepartid, mList)
                        }

                    } else {
                        mList = mMap1.get(it.topdepartid)
                        mList.push(it)
                        if (it.topdepartid != null) {
                            mMap1.set(it.topdepartid, mList)
                        }
                    }
                }
            })
            mMap1.forEach((value, key, map) => {
                departData.push({id: key, list: value, num: value.length})
            })
            console.log('mMap1', mMap1)
            mMap2.forEach((value, key, map) => {
                classData.push({id: key, list: value, num: value.length})
            })
        }
        let data = {mDataDepartment: departData, mDataClasses: classData}
        console.log('data', data)
        this.setData({
            departData,
            classData,
        })
        this.doResult(data)
    },
    doResult(data) {
        let str = '', involves = []

        data.mDataDepartment.forEach(it => {
            if (it.num > 0) {
                it.list.forEach(it => {
                    str = str + it.realname + "、"
                    involves.push(it)
                })
            }
        })
        data.mDataClasses.forEach(it => {
            if (it.num > 0) {
                it.list.forEach(it => {
                    str = str + it.realname + "、"
                    involves.push(it)
                })
            }
        })
        str = str.substring(0, str.length - 1)
        if (data.label&&data.label.length > 0) {
            this.data.requestBody.sendlabel = data.label
            this.data.requestBody.stuStr = data.labelStr
        } else {
            this.data.requestBody.involve = JSON.stringify(involves)
            this.data.requestBody.stuStr = str
        }

        this.setData({
                requestBody: this.data.requestBody,
                departData: data.mDataDepartment,
                classData: data.mDataClasses,
            }
        )
    },
    bindTimeS(e) {
        let v = this.data.requestBody
        v.scheduletime = e.detail.dateString
        this.setData({
            requestBody: v,
        })
    },
    bindTimeE(e) {
        let v = this.data.requestBody
        v.scheduleover = e.detail.dateString
        this.setData({
            requestBody: v,
        })
    },

    doInput: function (e) {
        let type = e.currentTarget.dataset.type;
        const v = this.data.requestBody;
        if (type == 'title') {
            v.title = e.detail.value
        } else {
            v.remark = e.detail.value
        }
        this.setData({
            requestBody: v
        });
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