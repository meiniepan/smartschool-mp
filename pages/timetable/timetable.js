// pages/achievement/achievement.js
import { getDayInWeek } from "../../utils/util";
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMaster: false,
        choseTeacher: false,
        classData: [],
        indexClass: 0,
        indexType: 0,
        todayInWeek: 0,
    },

    getList(classid = null) {
        console.log("id", classid)
        let url, choseTeacher;
        let data = {
            token: wx.getStorageSync('token'),
        }
        choseTeacher = false
        if (classid == "teacher") {
            choseTeacher = true
            url = "/api/v17/teacher/courses/timeTable"
        } else if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/courses/timeTable"
        } else {
            if (app.checkRule2("teacher/courses/mTimeTable")) {
                url = "/api/v17/teacher/courses/mTimeTable"
                if (classid != null) {
                    data = {
                        token: wx.getStorageSync('token'),
                        classid: classid,
                    }
                }

            } else {
                choseTeacher = true
                url = "/api/v17/teacher/courses/timeTable"
            }

        }

        app.httpPost(url, data).then((res) => {
            let data = res.respResult.list;
            let mLabelData = res.respResult.positions;
            let classData = res.respResult.classs;
            let indexClass = 0;
            let classArrays = [];
            if (classData!=null){
                for (let i = 0; i < classData.length; i++) {
                    classArrays.push(classData[i].classname)
                    if (classData[i].choice == "1") {
                        indexClass = i
                    }
                }
            }
            let total = mLabelData.length
            for (let i = 0; i < data.length; i++) {
                let mLessonData = [];
                let mRealLessonData = [];
                mLessonData = data[i].list
                console.log("lesson1", mLessonData)
                if (total > 0) {
                    for (let i = 0; i < total; i++) {
                        mRealLessonData.push({})
                    }
                    mLessonData.forEach(it3 => {
                        if (parseInt(it3.position) >= 0 && parseInt(it3.position) < total) {
                            mRealLessonData[parseInt(it3.position)] = it3
                        }
                    })
                }
                console.log("lesson2", mRealLessonData)
                data[i].list = mRealLessonData;
                data[i].id = "item" + i
            }

            console.log("data2", data)
            this.setData({
                mData: data,
                mLabelData,
                classData,
                classArrays,
                indexClass,
                choseTeacher,
                toView: 'item' + this.data.todayInWeek,
            });

            console.log("view", this.data.toView)
        });
    },
    bindPickerChange: function (e) {
        let type = e.currentTarget.dataset.type;
        let choseMaster;
        if (type == "indexType") {
            choseMaster = e.detail.value == 0;
            this.setData({
                [type]: e.detail.value,
                choseMaster,
            })
            if (choseMaster) {
                this.getList()
            } else {
                this.getList("teacher")
            }
        } else {
            this.setData({
                [type]: e.detail.value,
            })
            this.getList(this.data.classData[this.data.indexClass].classid)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let num = getDayInWeek();
        num = num - 1;
        if (num === -1) {
            num = 6
        }
        console.log("week", num)
        this.setData({
            todayInWeek: num,
        })
        if (app.checkRule2("teacher/courses/mTimeTable")) {
            this.setData({
                isMaster: true,
                choseMaster: true,
                typeArrays: ["班级课表", "科任课表"]
            })
        }
        this.getList()

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

    }
})