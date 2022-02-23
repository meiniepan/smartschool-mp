// pages/circular/circular.js
import {toIntSafe, isLogin, showToastWithoutIcon, showModal} from '../../utils/util';

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
        mRequest: {},
        lastId: null,
        noUnread: true,
        scrollTop: 0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.checkUpdate()
        this.refresh()
        this.getSemester()
        this.requestPermission()
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

    requestPermission() {
        if (wx.getStorageSync("request_accept") !== true) {
            showModal('为了及时收到消息推送，请先允许小程序发送消息',
                '温馨提示',
                (res) => {
                    if (res.confirm) {
                        let template_id = "kZHak-g9etu5s55hiWTQy5L8GoqoDiMA7lyOJo4c-N4"//汇文云
                        // let template_id = "JQwCCBkWHFveipdddNnDrKVEOATJCwQtxcoMQaZZRc0"//校能云
                        wx.requestSubscribeMessage({
                            tmplIds: [template_id],
                            success(res) {
                                let request = res.[template_id]
                                if (request == "accept") {
                                    wx.setStorageSync("request_accept", true)
                                } else {
                                    wx.setStorageSync("request_accept", false)
                                }
                            },
                            fail(err) {
                                console.log("fail", err)
                            }
                        })
                    }
                })
        }
    },

    doTitle: function (unRead) {
        let title = "通知"

        if (unRead > 0) {
            if (unRead > 99) {
                title = "通知(99+)"
            } else {
                title = "通知(" + unRead + ")"
            }
        }
        return title;
    },

    getList(type) {
        let mRequest = this.data.mRequest
        let lastId = null
        if (type === 'refresh') {
            mRequest.end = false
        }
        if (mRequest.end) return;

        mRequest.requesting = true;
        this.setData({
            mRequest,
        })
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
            mRequest.requesting = false;
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
                } else if (item.expand.action == "admin/notices/default") {
                    item.typeStr = '通知公告'
                    item.icon = 'ic_tonggao'
                } else {
                    item.typeStr = '通知公告'
                    item.icon = 'ic_tonggao'
                }
            })

            if (data.length > 0) {
                lastId = data[data.length - 1].id
            } else {
                mRequest.end = true;
            }
            if (type === 'more') {
                data = this.data.mData.concat(data)
            } else {
                mRequest.emptyShow = data.length == 0
            }
            data.forEach(item => {
                item.isRead = this.isRead(item)
            });
            let unRead = toIntSafe(res.respResult.unread)
            let title = this.doTitle(unRead);
            console.log("request", data)
            this.setData({
                mData: data,
                lastId: lastId,
                mRequest,
                unRead,
                title
            });
        });


    },

    getSemester() {
        let url = "/api/v17/global/setting/semesters";

        let data = {
            token: wx.getStorageSync('token'),
        }

        app.httpPost(url, data, false).then((res) => {
            let data = res.respResult;
            wx.setStorageSync('stime', data.starttime)
            wx.setStorageSync('etime', data.endtime)
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
        console.log('uid', wx.getStorageSync('uid'))
        console.log('domain', wx.getStorageSync('domain'))

        this.setData({
            lastId: null,
            scrollTop: 0
        });
        this.getList('refresh');
    },

    more() {
        this.getList('more');
    },
    doJump: function (item) {
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
        } else if (item.expand.action == "admin/notices/default") {
            page = 'notice'
        } else {
            page = 'notice'
            // showToastWithoutIcon("未知类型")
            // return
        }
        wx.navigateTo({
            url: '/packageA/pages/' + page + '/' + page + '?id=' + item.id,
        })
    },

    doDetail(e) {
        let item = e.currentTarget.dataset.bean
        let index = e.currentTarget.dataset.index
        this.setData({
            curItem: item,
        })
        if (item.status != '1') {
            this.doRead(item.id, index)
        } else {
            this.doJump(item);
        }
    },
    doRead(id, index) {
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
            this.data.mData[index].isRead = true
            this.setData({
                mData: this.data.mData,
                unRead: this.data.unRead - 1,
                title: this.doTitle(this.data.unRead - 1)
            })

            this.doJump(this.data.curItem)
        });

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})
