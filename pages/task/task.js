// pages/task/task.js
import { isLogin, showToastWithoutIcon } from '../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        duration: 300,  // swiper-item 切换过渡时间
        categoryCur: 0, // 当前数据列索引
        categoryMenu: [], // 分类菜单数据
        categoryData: [], // 所有数据列
        lastid: null,
        completestatus: null,
        status: null,
        navigationHeight: app.globalData.navigationHeight,
    },
    getList(type, lastid) {
        let currentCur = this.data.categoryCur;
        let pageData = this.getCurrentData(currentCur);
        if (type === 'refresh') {
            pageData.end = false
        }
        if (pageData.end) return;

        pageData.requesting = true;
        this.setCurrentData(currentCur, pageData);

        let url = pageData.url;
        let data;
        if (pageData.taskStatus == "-1") {
            data = {
                token: wx.getStorageSync('token'),
                id: lastid,
            }
        }
        else if (pageData.type == "1") {
            data = {
                token: wx.getStorageSync('token'),
                id: lastid,
                completestatus: pageData.taskStatus,
            }
        } else {
            data = {
                token: wx.getStorageSync('token'),
                id: lastid,
                status: pageData.taskStatus,
            }
        }

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
                pageData.emptyShow = true
            }
            if (type === 'refresh') {
                pageData.listData = listData;
            } else {
                pageData.listData = pageData.listData.concat(listData);
            }
            this.initStr(pageData)

            this.setCurrentData(currentCur, pageData);
        })
    },
    //初始化item显示
    initStr(pageData) {

        pageData.listData.forEach((item) => {
            var statusStr = ""
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
            if (pageData.listData.length === 0) {
                this.getList('refresh');
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
        this.getList('refresh',null);
    },

    more() {
        this.getList('more', this.getCurrentData(this.data.categoryCur).lastid);
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
        let categoryMenu; // 分类菜单数据
        let categoryMenuS = ["全部", "未完成", "已完成"]; // 分类菜单数据,学生
        let categoryMenuT = ["全部", "进行中", "草稿箱", "已关闭", "未完成", "已完成"]; // 分类菜单数据, 老师
        if (wx.getStorageSync('usertype') === "1") {
            categoryMenu = categoryMenuS
        } else {
            categoryMenu = categoryMenuT
        }
        let url, type, taskStatus;
        categoryMenu.forEach((item, index) => {

            if (wx.getStorageSync('usertype') === "1") {
                url = "/api/v17/student/tasks/lists"
                if (index == 0) {
                    taskStatus = "-1"
                    type = "1"
                } else if (index == 1) {
                    taskStatus = "0"
                    type = "1"
                } else if (index == 2) {
                    taskStatus = "1"
                    type = "1"
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
            } else {
                if (index == 0) {
                    taskStatus = "-1"
                    type = "1"
                    url = "/api/v17/teacher/tasks/lists"
                } else if (index == 1) {
                    taskStatus = "1"
                    type = "2"
                    url = "/api/v17/teacher/tasks/tasklist"
                } else if (index == 2) {
                    taskStatus = "0"
                    type = "2"
                    url = "/api/v17/teacher/tasks/tasklist"
                } else if (index == 3) {
                    taskStatus = "3"
                    type = "2"
                    url = "/api/v17/teacher/tasks/tasklist"
                } else if (index == 4) {
                    taskStatus = "0"
                    type = "1"
                    url = "/api/v17/teacher/tasks/lists"
                } else if (index == 5) {
                    taskStatus = "1"
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
            categoryMenu
        });

        setTimeout(() => {
            this.refresh();
        }, 350);
    },

    doTaskDetail(e){
        wx.navigateTo({
            url: '/pages/taskDetail/taskDetail?id=' + e.currentTarget.dataset.url+'&type=' + this.data.categoryData[this.data.categoryCur].type,
        })
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


    /**
     * 页面上拉触底事件的处理函数
     */


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
