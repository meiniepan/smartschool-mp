// pages/quantizeSpecial/quantizeSpecial.js
import {showToastWithoutIcon} from "../../../utils/util";

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: {
            token: '',
            stime: '请选择开始时间',
            etime: '请选择结束时间',
            stuStr: '请选择学生',
            involve: [],
            actname: '请选择情况类型',
            rulename: '请选择影响项目',
            types: null,
            remark: null,
        },
        actArrays: ['病假', '事假','住宿生外出','课外活动', '外出考试',
            '个人培训','不参加课后服务', '其他'],
        ruleArrays: [],
        departData: [],
        classData: [],
        canCheck: false,
        show: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('choseInvolve', res => {
            console.log(res.data) // my from index page
        })

        this.getMoralTypeList()

        let date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        let mill1 = new Date(year, month, day).getTime()
        if (hour > 7 || (hour == 7 && minute > 30)) {

        } else {
            this.setData({
                canCheck: true,
            })
        }
    },
    doConfirm() {
        let bean = this.data.requestBody
        bean.token = wx.getStorageSync('token')
        if (bean.involve.length == 0 || bean.stime == "请选择开始时间" ||
            bean.etime == "请选择结束时间" || bean.actname == "请选择情况类型" ||
            bean.rulename == "请选择影响项目" || bean.remark == null || bean.remark == '') {
            showToastWithoutIcon('请完善信息')
            return
        }

        let url = "/api/v17/moral/moralRuleSpecial/add"
        let data = bean
        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            wx.navigateBack({
                delta: 1
            })
        });
    },

    getMoralTypeList() {
        let url = "/api/v17/moral/moralType/lists"
        let data = {
            token: wx.getStorageSync('token'),
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            data.forEach(item => {
                item.checked = false
            })
            this.setData({
                ruleArrays: data
            })
        });
    },
    check2() {
        let temp = new Date()
        let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let date = temp.getDate()
        if (month > 8) {

        } else {
            year = year - 1
        }
        this.data.requestBody.stime = year + "-09-01"
        this.data.requestBody.etime = year + 1 + "-08-31"
        this.setData({
            checked1: false,
            checked2: true,
            requestBody: this.data.requestBody,
        })
    },
    check1() {
        var stime = wx.getStorageSync('stime')
        var etime = wx.getStorageSync('etime')
        if (stime.length >= 8) {
            stime = stime.substring(0, 4) + "-" + stime.substring(
                4,
                6
            ) + "-" + stime.substring(6, 8)
        }
        if (etime.length >= 8) {
            etime = etime.substring(0, 4) + "-" + etime.substring(
                4,
                6
            ) + "-" + etime.substring(6, 8)
        }
        this.data.requestBody.stime = stime
        this.data.requestBody.etime = etime
        this.setData({
            checked1: true,
            checked2: false,
            requestBody: this.data.requestBody,
        })
    },
    doChooseStudent() {
        let that = this
        let depart = that.data.departData
        let classes = that.data.classData

        console.log('depart', depart)
        wx.navigateTo({
            url: "../addInvolve/addInvolve?data=" + JSON.stringify(depart)
                + '&data2=' + JSON.stringify(classes)
                + '&type=1'
                + '&all=0',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                quantizeSpecial: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    that.doResult(data);
                }
            },
        });
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
        this.data.requestBody.involve = JSON.stringify(involves)
        this.data.requestBody.stuStr = str
        this.setData({
                requestBody: this.data.requestBody,
                departData: data.mDataDepartment,
                classData: data.mDataClasses,
            }
        )
    },
    bindTimeS(e) {
        let v = this.data.requestBody
        v.stime = e.detail.value
        this.setData({
            requestBody: v,
        })
    },
    bindTimeE(e) {
        let v = this.data.requestBody
        v.etime = e.detail.value
        this.setData({
            requestBody: v,
        })
    },
    doAct(e) {
        let v = this.data.requestBody
        v.actname = this.data.actArrays[e.detail.value]
        this.setData({
            requestBody: v,
        })
    },
    doRule() {
        let date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        let mill1 = new Date(year, month - 1, day).getTime()
        let stime = this.data.requestBody.stime
        if (stime != "请选择开始时间") {
            let mill2 = new Date(stime.replace(/-/g, "/")).getTime()
            console.log("mill1", mill1)
            console.log("mill2", mill2)
            if (mill2 > mill1) {
                this.data.canCheck = true
            }
        }
        this.setData({
            show: true,
            overlay: true,
            canCheck: this.data.canCheck,
        })
    },
    doBtn1() {
        this.setData({
            show: false,
            overlay: false,
        })
    },
    doBtn2() {
        this.setData({
            show: false,
            overlay: false,
        })

        let bean = this.data.requestBody
        let str = '', types = ''
        this.data.ruleArrays.forEach(it => {
            if (it.checked) {
                str = str + it.typename + ","
                types = types + it.id + ","
            }
        })
        if (str.length > 1) {
            str = str.substring(0, str.length - 1)
            bean.rulename = str
            bean.types = types
            this.setData({
                requestBody: bean
            })
        }
    },
    checkRule(e) {
        var v = this.data.ruleArrays
        console.log("idx", e.currentTarget.dataset)
        if (v[e.currentTarget.dataset.index].typename == '入校迟到') {
            if (this.data.canCheck) {
                v[e.currentTarget.dataset.index].checked = !v[e.currentTarget.dataset.index].checked
            }
        } else {
            v[e.currentTarget.dataset.index].checked = !v[e.currentTarget.dataset.index].checked
        }
        this.setData({
            ruleArrays: v,
        })
    },
    doInput: function (e) {
        const v = this.data.requestBody;
        v.remark = e.detail.value
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
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})