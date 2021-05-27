// pages/school/school.js
const app = getApp();
const globalData = getApp().globalData;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mData: [],
        appData: app.globalData
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.checkRules()
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

    },
    doClick(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },

    checkRules() {//判断权限
        let mData = [];
        var bean1 = { name: "信息递送", items: [] }
        if (app.checkRule1("admin/spacebook/default")) {
            bean1.items.push(
                {
                    name: globalData.siteTitle,
                    remark: "场地时段 一目了然",
                    icon: "/assets/images/ic_changdi.png",
                    click: "/pages/bookSite/bookSite"
                })
        }
        if (app.checkRule1("admin/notices/default")) {
            bean1.items.push(
                {
                    name: globalData.noticeTitle,
                    remark: "快速准确 一键提醒",
                    icon: "/assets/images/ic_tonggao.png",
                    click: "/packageA/pages/notice/notice"
                })
        }

        if (app.checkRule1("admin/schedules/default")) {
            bean1.items.push(
                {
                    name: globalData.scheduleTitle,
                    remark: "工作安排 井井有条",
                    icon: "/assets/images/ic_richeng.png",
                    click: "/pages/schedule/schedule"
                })
        }
        if (app.checkRule1("admin/wages/default")) {
            bean1.items.push(
                {
                    name: globalData.salaryTitle,
                    remark: "保护隐私 查看明细",
                    icon: "/assets/images/ic_gongzitiao.png",
                    click: "/pages/salary/salary"
                })
        }
        if (app.checkRule1("admin/repair/default")) {
            bean1.items.push(
                {
                    name: globalData.propertyTitle,
                    remark: "一键拨打 随叫随到",
                    icon: "/assets/images/ic_baoxiu.png",
                    click: "/pages/repair/repair"
                })
        }
        if (app.checkRule1("admin/tasks/default")) {
            bean1.items.push(
                {
                    name: globalData.taskTitle,
                    remark: "任务管理 办公协作",
                    icon: "/assets/images/ic_renwu.png",
                    click: "/pages/task/task"
                })
        }

        if (app.checkRule1("admin/attendances/default")) {
            bean1.items.push(
                {
                    name: globalData.attendanceTitle,
                    remark: "实时更新 系统上报",
                    icon: "/assets/images/ic_kaoqin.png",
                    click: "/pages/attendance/attendance"
                })
        }
        if (app.checkRule1("admin/achievements/default")) {
            bean1.items.push(
                {
                    name: globalData.achievementTitle,
                    remark: "各科成绩 汇总分析",
                    icon: "/assets/images/ic_chengji.png",
                    click: "/pages/achievement/achievement"
                })
        }

        if (app.checkRule1("admin/courses/default")) {
            bean1.items.push(
                {
                    name: globalData.timetableTitle,
                    remark: "班级课表 教学课表",
                    icon: "/assets/images/ic_kebiao.png",
                    click: "/pages/timetable/timetable"
                })
        }
        if (bean1.items.length > 0) {
            mData.push(bean1)
        }
        
        this.setData({
            mData: mData
        })
    }
})
