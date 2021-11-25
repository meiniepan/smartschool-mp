// pages/task/task.js
import {isLogin, showToastWithoutIcon} from '../../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        duration: 300,  // swiper-item 切换过渡时间
        categoryCur: 0, // 当前数据列索引
        categoryMenu: ['我发起的', '我参与的'], // 分类菜单数据
        categoryData: [], // 所有数据列
        statusArr: [], // 状态数据列
        statusStrArr: [], // 状态数据列
        status: '-1',
        statusStr: '任务状态',
        stime: '',
        etime: '',
        stimeStr: '开始时间',
        etimeStr: '结束时间',
        navigationHeight: app.globalData.navigationHeight,
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            scrollTop:0
        })
        this.refresh();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.requestSubscribeMessage({
        //     tmplIds: ['aasPBwm2xjII9E6K9Ee17ljHSYxQxwBWWDKxG0peDqc'],
        //     success (res) { }
        // })

        let categoryData = [];
        let statusArr; // 分类菜单数据
        let statusStrArr; // 分类菜单数据
        let statusArrS = ['-1', "0", "1"]; // 分类菜单数据,学生
        let statusStrArrS = ["全部", "未完成", "已完成"]; // 分类菜单数据,学生
        let statusArrT = ['-1', "1", "0", "3"]; // 分类菜单数据, 老师
        let statusStrArrT = ["全部", "进行中", "草稿箱", "已关闭"]; // 分类菜单数据, 老师
        console.log("type",wx.getStorageSync('usertype'))
        if (wx.getStorageSync('usertype') === "1") {
            statusArr = statusArrS
            statusStrArr = statusStrArrS
            this.setData({
                mType: '1'
            })
        } else {
            statusArr = statusArrT
            statusStrArr = statusStrArrT
            this.setData({
                mType: '2'
            })
        }
        let url, type, taskStatus;
        this.data.categoryMenu.forEach((item, index) => {

            if (wx.getStorageSync('usertype') === "1") {
                url = "/api/v17/student/tasks/lists"
                taskStatus = null
                type = "1"
                categoryData.push({
                    categoryCur: index,
                    requesting: false,
                    end: false,
                    lastid: "",
                    listData: [],
                    type: type,
                    url: url,
                    taskStatus: taskStatus
                })
            } else {
                if (index == 0) {
                    taskStatus = null
                    type = "2"
                    url = "/api/v17/teacher/tasks/tasklist"
                } else if (index == 1) {
                    taskStatus = null
                    type = "1"
                    url = "/api/v17/teacher/tasks/lists"
                }

                categoryData.push({
                    categoryCur: index,
                    requesting: false,
                    end: false,
                    lastid: null,
                    listData: [],
                    type: type,
                    url: url,
                    taskStatus: taskStatus
                })
            }

        })
        this.setData({
            categoryData,
            statusArr,
            statusStrArr,
        });

    },
    doAdd() {
        wx.navigateTo({
            url: '/packageA/pages/addTask/addTask'
        })
    },
    checkPri() {
        if (this.data.categoryCur !== 0) {
            this.setData({
                categoryCur: 0,
                status: '-1',
                statusStr: '任务状态',
                stime: '',
                etime: '',
                stimeStr: '开始时间',
                etimeStr: '结束时间',
            });
            let pageData = this.getCurrentData();
            if (pageData.init != true) {
                this.getList('refresh');
            }
        }
    },
    checkPub() {
        if (this.data.categoryCur !== 1) {
            this.setData({
                categoryCur: 1,
                status: '-1',
                statusStr: '任务状态',
                stime: '',
                etime: '',
                stimeStr: '开始时间',
                etimeStr: '结束时间',
            });
            let pageData = this.getCurrentData();
            if (pageData.init != true) {
                this.getList('refresh');
            }
        }
    },
    doAct(e) {
        let p = e.detail.value
        let status = this.data.statusArr[p]
        let statusStr = this.data.statusStrArr[p]
        this.setData({
            status,
            statusStr,
        })
        this.refresh()
    },
    bindTimeS(e) {
        let stime = e.detail.value
        let stimeStr = e.detail.value.substr(5, e.detail.value.length - 1)
        this.setData({
            stime,
            stimeStr,
        })
        this.refresh()
    },
    bindTimeE(e) {
        let etime = e.detail.value
        let etimeStr = e.detail.value.substr(5, e.detail.value.length - 1)
        this.setData({
            etime,
            etimeStr,
        })
        this.refresh()
    },
    getList(type, lastid) {
        let currentCur = this.data.categoryCur;
        let pageData = this.getCurrentData(currentCur);
        if (type === 'refresh') {
            pageData.end = false
        }
        if (pageData.end) return;

        pageData.requesting = true;
        let status = this.data.status
        let stime = this.data.stime
        let etime = this.data.etime


        let url = pageData.url;
        let data;
        if (currentCur == 0) {

            data = {
                token: wx.getStorageSync('token'),
                id: lastid,
                status: status,
                stime: stime,
                etime: etime,
            }
        } else if (currentCur == 1) {
            data = {
                token: wx.getStorageSync('token'),
                id: lastid,
                completestatus: status,
                stime: stime,
                etime: etime,
            }

        }
        if (wx.getStorageSync('usertype') == '1') {
            data = {
                token: wx.getStorageSync('token'),
                id: lastid,
                completestatus: status,
                stime: stime,
                etime: etime,
            }
        }
        this.setCurrentData(currentCur, pageData);
        console.log('data', data)
        app.httpPost(url, data).then((res) => {

            let data = res.respResult || {
                data: []
            };
            let listData = data.data || [];
            pageData.requesting = false;
            if (listData.length > 0) {
                pageData.lastid = listData[listData.length - 1].id
            } else {
                pageData.end = true;
                pageData.lastid = null
            }
            if (type === 'refresh') {
                pageData.listData = listData;
                pageData.emptyShow = listData.length==0
            } else {
                pageData.listData = pageData.listData.concat(listData);
            }
            this.initStr(pageData)
            pageData.init = false
            this.setCurrentData(currentCur, pageData);
        })
    },
    //初始化item显示
    initStr(pageData) {

        pageData.listData.forEach((item) => {
            let statusStr = ""
            var line2Str = "负责人：" + item.operatorname
            var ss = ""
            let it = item.involve
            if (it.length > 3) {
                ss = it[0].realname + "、" +
                    it[1].realname + "、" +
                    it[2].realname + "等" + item.involve.length + "人..."
            } else {
                if (it.length > 0) {
                    it.forEach((it) => {
                        ss = ss + it.realname + "、"
                    })
                    ss = ss.substring(0, ss.length - 1)
                } else {
                    ss = ss
                }
            }
            var line4Str = "参与人：" + ss
            if (pageData.type == "1") {
                if (item.completestatus == "0") {//任务状态0待发布1进行中2完成3关闭
                    statusStr = "未完成"

                } else if (item.completestatus == "1") {
                    statusStr = "已完成"
                }
            } else if (pageData.type == "2") {
                if (item.taskstatus == "0") {//任务状态0待发布1进行中2完成3关闭
                    statusStr = "草稿箱"
                } else if (item.taskstatus == "1") {
                    statusStr = "进行中"
                } else if (item.taskstatus == "3") {
                    statusStr = "已关闭"
                }
            }
            item.statusStr = statusStr;
            item.line2Str = line2Str;
            item.line4Str = line4Str;
        })

    },
    // 顶部tab切换事件
    toggleCategory(e) {
        this.setData({
            duration: 300
        });

        setTimeout(() => {
            this.setData({
                categoryCur: e.detail.index
            });
            let pageData = this.getCurrentData();
            if (pageData.init != true) {
                this.getList('refresh', null);
            }
        }, 0);
    },
    // 页面滑动切换事件
    animationFinish(e) {
        this.setData({
            duration: 300
        });
        setTimeout(() => {
            this.setData({
                categoryCur: e.detail.current
            });
            let pageData = this.getCurrentData();
            if (pageData.listData.length === 0) {
                this.getList('refresh', null);
            }
        }, 0);
    },
    // 更新页面数据
    setCurrentData(currentCur, pageData) {
        let categoryData = this.data.categoryData
        categoryData[currentCur] = pageData
        this.setData({
            categoryData: categoryData
        })
    },
    // 获取当前激活页面的数据
    getCurrentData() {
        return this.data.categoryData[this.data.categoryCur]
    },
    refresh() {
        this.getList('refresh', "");
    },

    more() {
        this.getList('more', this.getCurrentData(this.data.categoryCur).lastid);
    },


    doTaskDetail(e) {
        let bean = e.currentTarget.dataset.bean
        if (this.data.categoryCur=='0'&&bean.status=='0') {
            wx.navigateTo({
                url: '/packageA/pages/addTask/addTask?id=' + bean.id + '&type=' + this.data.categoryCur,
            })
        } else {
            wx.navigateTo({
                url: '/packageA/pages/taskDetail/taskDetail?id=' + bean.id + '&type=' + this.data.categoryCur,
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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


    /**
     * 页面上拉触底事件的处理函数
     */


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
