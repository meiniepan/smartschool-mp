// pages/attendance/attendance.js
import {getToday, getTodayMD, getTodayStr} from "../../../utils/util";

let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMaster: false,
        todayStr: "",
        date: "",
        mode: "",//"stu-ad","stu","tea","master","school"
        classData: [],
        indexClass: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let isMaster = false;
        let modeMaster = false;
        let typeArrays = [];
        let mode = "";
        let indexType = 0;
        if (app.checkRule2("student/attendances/privateAtts")) {

            //学生管理员权限
            if (app.checkRule2("student/attendances/lists")) {
                typeArrays.push("课堂考勤")
                mode = "stu-ad"
            } else {
                mode = "stu"
            }
            typeArrays.push("我的考勤")
        } else if (app.checkRule2("teacher/attendances/lists")) {

            if (app.checkRule2("teacher/attendances/masterlists")) {
                typeArrays.push("班级考勤")
                mode = "master"
                isMaster = true
                modeMaster = true
            } else {
                mode = "tea"
            }
            typeArrays.push("课堂考勤")
        } else if (app.checkRule2("teacher/attendances/sclists")) {
            typeArrays.push("校级考勤")
            mode = "school"
        } else {

        }
        this.setData({
            todayStr: getToday(),
            date: getTodayMD(),
            dateStr: getTodayStr(),
            isMaster,
            modeMaster,
            mode,
            typeArrays,
            indexType,
        })

        if (app.checkRule2("student/attendances/privateAtts")) {
            if (app.checkRule2("student/attendances/lists")) {
                this.getTimetable()
            } else {
                this.getStuData()
            }
        } else if (app.checkRule2("teacher/attendances/lists")) {
            if (app.checkRule2("teacher/attendances/masterlists")) {
                this.getDataMaster()
            } else {
                this.getTimetable()
            }
        } else if (app.checkRule2("teacher/attendances/sclists")) {
            this.getSchoolData()
        } else {
            // this.getStuData()
        }
    },
    getDataMaster() {
        let url;
        let data = {
            token: wx.getStorageSync('token'),
        }
        url = "/api/v17/teacher/attendances/lists"
        if (this.data.classData.length > 0) {
            data = {
                token: wx.getStorageSync('token'),
                classid: this.data.classData[this.data.indexClass].classid,
                atttime: this.data.dateStr,
            }
        }

        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            let classData = res.respResult.classs;
            let indexClass = 0;
            let classArrays = [];
            for (let i = 0; i < classData.length; i++) {
                classArrays.push(classData[i].levelname + classData[i].classname)
                if (classData[i].choice == "1") {
                    indexClass = i
                }
            }
            let isEmpty = false
            if (data.length == 0) {
                isEmpty = true
            }
            this.setData({
                isEmpty,
                mData: data,
                classData,
                classArrays,
                indexClass,
            });

        });
    },
    getStuData() {
        let url;
        let data = {
            token: wx.getStorageSync('token'),
        }
        url = "/api/v17/student/attendances/privateAtts"
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.attendances;

            console.log("data2", data)
            this.setData({
                mData: data,
            });

        });
    },
    getSchoolData() {
        let url;
        let data = {
            token: wx.getStorageSync('token'),
        }
        url = "/api/v17/teacher/attendances/sclists"
        app.httpPost(url, data).then((res) => {
            let data = res.respResult;
            let data2 = [];
            data2.push({name: "病假", value: data.sickleave + "人", list: data.sickleavelist});
            data2.push({name: "事假", value: data.thingleave + "人", list: data.thingleavelist});
            data2.push({name: "早间迟到", value: data.morninglate + "人", list: data.morninglatelist});
            data2.push({name: "课堂迟到", value: data.courselate + "人", list: data.courselatelist});
            data2.push({name: "旷课", value: data.truant + "人", list: data.truantlist});
            console.log("data2", data2)
            this.setData({
                mData: data2,
            });

        });
    },

    getTimetable() {
        let url;
        let data = {
            token: wx.getStorageSync('token'),
        }
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/attendances/timeTable"
        } else {
            url = "/api/v17/teacher/attendances/timeTable"
        }

        app.httpPost(url, data).then((res) => {
            let data = res.respResult.list;
            let isEmpty = false
            if (data.length == 0) {
                isEmpty = true
            }
            console.log('data', data)
            this.setData({
                isEmpty,
                mData: data,
            });

        });
    },
    doClickCourse: function (e) {
        wx.navigateTo({
            url: '/packageA/pages/attendance2/attendance2?data=' + JSON.stringify(e.currentTarget.dataset.data),
        })
    },
    bindPickerChange: function (e) {
        let type = e.currentTarget.dataset.type;
        let isMaster;
        if (type == "indexType") {
            let typeStr = this.data.typeArrays[e.detail.value]
            console.log("type", typeStr)
            isMaster = typeStr == "班级考勤";


            this.setData({
                [type]: e.detail.value,

            })
            if (typeStr == "课堂考勤") {
                let mode = "tea"
                if (app.checkRule2("student/attendances/privateAtts")) {
                    mode = "stu-ad"
                }
                this.setData({
                    mode: mode,
                    isMaster,
                })
                this.getTimetable()
            } else if (typeStr == "我的考勤") {
                this.setData({
                    mode: "stu",
                })
                this.getStuData()
            } else if (typeStr == "班级考勤") {
                this.setData({
                    mode: "master",
                    isMaster,
                })
                this.getDataMaster()
            }

        } else {
            this.setData({
                [type]: e.detail.value,
            })
            this.getDataMaster()
        }
    },
    bindDateChange(e) {
        let a = e.detail.value.split("-")
        if (a.length > 2) {
            this.setData({
                date: a[1] + "月" + a[2] + "日",
                dateStr: a[0] + a[1] + a[2],
            })
        }
        this.getDataMaster()
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