// packageA/pages/addTask/addTask.js
import {showToastWithoutIcon, zero} from "../../../utils/util";

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: {
            token: '',
            id: null,
            plantime: '请选择开始时间',
            overtime: '请选择结束时间',
            status: '',
            stuStr: '',
            taskname: '',
            remark: '',
            involve: '',
            fileinfo: '',
        },
        chosenDay: '',
        showChooseStudent: false,
        isModify: false,
        departData: [],
        classData: [],
        bean: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        let id = options.id
        let temp = new Date()
        let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let date = temp.getDate()
        let today = year + '/' + zero(month) + '/' + zero(date)
        let h = temp.getHours()
        let m = temp.getMinutes()
        let time = today + " " + zero(h) + ":" + zero(m)
        let requestBody = this.data.requestBody
        requestBody.plantime = time
        requestBody.overtime = time
        this.setData({
            requestBody
        })
        if (id != null) {
            this.getTaskInfo(id)
        }
    },

    doConfirm() {
        let this_ = this
        wx.showModal({
            title: '温馨提示',
            content: '确定发布任务？',
            success(res) {
                if (res.confirm) {
                    this_.doConfirm2()
                } else if (res.cancel) {
                    wx.navigateBack({
                        delta: 1,
                    })
                }
            },
            confirmColor: "#F95B49",
        })

    },
    doConfirm2() {

        let bean = this.data.requestBody
        bean.token = wx.getStorageSync('token')
        bean.status = '1'
        let url = ''
        if (bean.plantime == "请选择开始时间" ||
            bean.overtime == "请选择结束时间" ||
            bean.taskname == null || bean.taskname == '') {
            showToastWithoutIcon('请完善信息')
            return
        }
        if (bean.id == null) {
            url = '/api/v17/teacher/tasks/add'
        } else {
            url = '/api/v17/teacher/tasks/modifyTask'
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
    getTaskInfo(id) {
        let url = ''

        if (wx.getStorageSync('usertype') === "1") {
            url = '/api/v17/student/tasks/info'
        } else {
            url = '/api/v17/teacher/tasks/info'
        }


        let data = {
            token: wx.getStorageSync('token'),
            id: id,
            type: 'task',
        }

        app.httpPost(url, data).then((res) => {

            let involve = res.respResult.involve
console.log('involve',involve)
            let departData = [];
            let classData = [];
            if (involve.length > 0) {
                let mMap1 = new Map(), mMap2 = new Map();
                involve.forEach(it => {
                    if (it.topdepartid == "grade0") {
                        it.secdepartid = '1_'+it.secdepartid
                        it.parentId = it.secdepartid
                        if (mMap2.get(it.secdepartid) == null) {
                            var mList = []
                            mList.push(it)
                            if(it.secdepartid!=null){
                                mMap2.set(it.secdepartid, mList)
                            }

                        } else {
                            mList = mMap2.get(it.secdepartid)
                            mList.push(it)
                            if(it.secdepartid!=null){
                                mMap2.set(it.secdepartid, mList)
                            }
                        }
                    } else {
                        it.topdepartid = '0_'+it.topdepartid
                        it.parentId = it.topdepartid
                        if (mMap1.get(it.topdepartid) == null) {
                            var mList = []
                            mList.push(it)
                            if(it.topdepartid!=null){
                                mMap1.set(it.topdepartid, mList)
                            }

                        } else {
                            mList = mMap1.get(it.topdepartid)
                                mList.push(it)
                            if(it.topdepartid!=null){
                                mMap1.set(it.topdepartid, mList)
                            }
                        }
                    }
                })
                mMap1.forEach((value, key, map)=>{
                    departData.push({id:key,list:value,num:value.length})
                })
                console.log('mMap1', mMap1)
                mMap2.forEach((value, key, map)=>{
                    classData.push({id:key,list:value,num:value.length})
                })
            }
            let data = {mDataDepartment:departData,mDataClasses:classData}
            console.log('data', data)
            this.setData({
                requestBody: res.respResult,
                departData,
                classData,
            })
            this.doResult(data)
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
        v.plantime = e.detail.dateString
        this.setData({
            requestBody: v,
        })
    },
    bindTimeE(e) {
        let v = this.data.requestBody
        v.overtime = e.detail.dateString
        this.setData({
            requestBody: v,
        })
    },

    doInput: function (e) {
        let type = e.currentTarget.dataset.type;
        const v = this.data.requestBody;
        if (type == 'taskname') {
            v.taskname = e.detail.value
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