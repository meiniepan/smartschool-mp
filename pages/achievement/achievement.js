// pages/achievement/achievement.js
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isStu: false,
        classData: [],
        indexTest: 0,
        indexClass: 0,
        indexCourse: 0,
    },
    getTestCourse() {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/achievements/testCourse"
        } else {
            url = "/api/v17/teacher/achievements/testCourse"
        }
        let data = {
            token: wx.getStorageSync('token'),
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult;
            let testArrays = [], classArrays = [], courseArrays = [];
            let currentTest, classid, courseid;
            let indexClass = 0;

            if (data.testname.length > 0) {
                currentTest = data.testname[0]
                testArrays = data.testname
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '查询不到考试信息',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        } else if (res.cancel) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    },
                    confirmColor: "#445FF5",
                })
                return;
            }
            if (data.classs.length > 0) {
                classid = data.classs[0].classid
                for (let i = 0; i < data.classs.length; i++) {
                    classArrays.push(data.classs[i].classname)
                }
            }
            let courseData = []
            data.course.forEach(it => {
                courseData = courseData.concat(it.courses)

            })
            if (courseData.length > 0) {
                courseid = courseData[0].cno
                for (let i = 0; i < courseData.length; i++) {
                    courseArrays.push(courseData[i].coursename)
                }
            }
            this.setData({
                courseData: courseData,
                classData: data.classs,
                currentTest,
                classid,
                courseid,
                testArrays,
                classArrays,
                courseArrays,
            });
            this.getList()
        });
    },
    getList() {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/achievements/lists"
        } else {
            url = "/api/v17/teacher/achievements/lists"
        }
        let data = {
            token: wx.getStorageSync('token'),
            testname: this.data.testArrays[this.data.indexTest],
            cno: this.data.courseData[this.data.indexCourse].cno,
            classid: this.data.classData[this.data.indexClass].classid,
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.list;
            let isEmpty = data.length == 0
            console.log("data", data)
            this.setData({
                mData: data,
                isEmpty,
            });
        });
    },
    bindPickerChange: function (e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            [type]: e.detail.value,
        })
        this.getList()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.checkRule2("student/achievements/testCourse")) {
            this.setData({
                isStu: true,
            })
        }
        this.getTestCourse()

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