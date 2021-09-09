// pages/circular/circular.js
import {isLogin, showToastWithoutIcon} from '../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        duration: 300,  // swiper-item 切换过渡时间
        categoryCur: 0, // 当前数据列索引
        categoryMenu: ["1", "2"], // 分类菜单数据, 字符串数组格式
        navigationHeight: app.globalData.navigationHeight,
        mData: [],
        lastId: null,
        noUnread: true,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.checkUpdate()

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
        this.refresh();
        this.getSemester()
    },
    getList(type) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/notices/lists"
        } else {
            url = "/api/v17/teacher/notices/lists"
        }
        let data = {
            token: wx.getStorageSync('token'),
            id: this.data.lastId,
            type: 'system'
        }

        app.httpPost(url, data).then((res) => {
            console.log('res', res)
            let data = res.respResult.data;
            data.forEach(item => {
                if (item.expand.action == "admin/spacebook/default") {
                    item.typeStr = '场地预约'
                    item.icon = 'ic_changdi'
                } else if (item.expand.action == "admin/schedules/default") {
                    item.typeStr = '日程安排'
                    item.icon = 'ic_richeng'
                } else if (item.expand.action == "moral/moral/default") {
                    item.typeStr = '量化评比'
                    item.icon = 'ic_quantize'
                } else if (item.expand.action == "admin/wages/default") {
                    item.typeStr = '工资条'
                    item.icon = 'ic_gongzitiao'
                } else if (item.expand.action == "admin/repair/default") {
                    item.typeStr = '报修报送'
                    item.icon = 'ic_baoxiu'
                } else if (item.expand.action == "admin/tasks/default") {
                    item.typeStr = '任务协作'
                    item.icon = 'ic_renwu'
                } else if (item.expand.action == "disk/folder/default") {
                    item.typeStr = '教学云盘'
                    item.icon = 'ic_yunpan'
                } else if (item.expand.action == "admin/attendances/default") {
                    item.typeStr = '学生考勤'
                    item.icon = 'ic_kaoqin'
                } else if (item.expand.action == "admin/achievements/default") {
                    item.typeStr = '成绩汇总'
                    item.icon = 'ic_chengji'
                } else if (item.expand.action == "admin/courses/default") {
                    item.typeStr = '我的课表'
                    item.icon = 'ic_kebiao'
                } else {
                    item.typeStr = ''
                    item.icon = 'ic_tonggao'
                }
            })


            if (type === 'more') {
                if (data.length > 0) {
                    let lastId = data[data.length - 1].id
                    this.setData({
                        mData: this.data.mData.concat(data),
                        lastId: lastId
                    });
                } else {
                    showToastWithoutIcon('无更多数据');
                }
            } else {
                let isEmpty = data.length == 0
                wx.stopPullDownRefresh();
                let lastId = ""
                if (data.length > 0) {
                    lastId = data[data.length - 1].id
                }
                this.setData({
                    mData: data,
                    lastId: lastId,
                    isEmpty
                });
            }
            var data2 = this.data.mData;
            data2.forEach(item => {
                item.isRead = this.isRead(item)
            });
            let unRead = res.respResult.unread
            let title = "通知"

            if (unRead.length > 0) {
                if (parseInt(unRead) > 0) {
                    if (parseInt(unRead) > 99) {
                        title = "通知(99+)"
                    } else {
                        title = "通知(" + unRead + ")"
                    }
                }
            }
            this.setData({
                mData: data2,
                title
            });
        });


    },

    doRead(id) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/notices/modify"
        } else {
            url = "/api/v17/teacher/notices/modify"
        }
        let data = {
            token: wx.getStorageSync('token'),
            id: id,
            status: '1'
        }

        app.httpPost(url, data, false).then((res) => {

            let data = res.respResult.data;
            this.refresh();

        });


    },
    getSemester() {
        let url="/api/v17/global/setting/semesters";

        let data = {
            token: wx.getStorageSync('token'),
        }

        app.httpPost(url, data, false).then((res) => {
            let data = res.respResult;
            wx.setStorageSync('stime',data.starttime)
            wx.setStorageSync('etime',data.endtime)
        });


    },
    doAct() {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/notices/modifyAll"
        } else {
            url = "/api/v17/teacher/notices/modifyAll"
        }
        let data = {
            token: wx.getStorageSync('token'),
            type: 'system',
            status: '1'
        }

        app.httpPost(url, data, false).then((res) => {

            let data = res.respResult.data;
            this.refresh()

        });
    },
    refresh() {
        console.log('domain', wx.getStorageSync('domain'))
        this.setData({
            lastId: null
        });
        this.getList('refresh');
    },

    more() {
        this.getList('more');
    },
    doDetail(e) {
        let item = e.currentTarget.dataset.bean
        if (item.status != '1') {
            this.doRead(item.id)
        }
        let page = ''

            if (item.expand.action == "admin/spacebook/default") {
                page = 'bookSite'
            } else if (item.expand.action == "admin/schedules/default") {
                page = 'schedule'
            } else if (item.expand.action == "moral/moral/default") {
                page = 'quantize'
            } else if (item.expand.action == "admin/wages/default") {
                page = 'salary'
            } else if (item.expand.action == "admin/repair/default") {
                page = 'repair'
            } else if (item.expand.action == "admin/tasks/default") {
                page = 'task'
            } else if (item.expand.action == "disk/folder/default") {
                page = 'cloud'
            } else if (item.expand.action == "admin/attendances/default") {
                page = 'attendance'
            } else if (item.expand.action == "admin/achievements/default") {
                page = 'achievement'
            } else if (item.expand.action == "admin/courses/default") {
                page = 'timetable'
            } else {
                page = ''
            }
        wx.navigateTo({
            url: '/packageA/pages/' + page + '/' + page + '?id=' + item.id,
        })
    },
    //判断是否已读
    isFeedback(item) {
        if (item.type == "feedback") {

            return true
        } else {
            return false
        }
    },

    isRead(item) {
        if (item.type == "feedback") {
            if (item.received == "1") {
                return true
            } else {
                return false
            }
        } else {
            if (item.status == "1") {
                return true
            } else {
                return false
            }
        }
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
        this.refresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.more()
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
