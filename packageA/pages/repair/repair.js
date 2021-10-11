// pages/repair/repair.js
import {showToastWithoutIcon} from '../../../utils/util';
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isRepair: false,
        categoryCur: 0, // 当前数据列索引
        categoryMenu: ['维修记录', '报修历史'], // 分类菜单数据
        categoryData: [], // 所有数据列
        types: [], // 所有数据列
        isInit: [true, false],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getType()
        let categoryData = []
        this.data.categoryMenu.forEach((item, index) => {
            categoryData.push({
                requesting: false,
                end: false,
                lastid: null,
                listData: [],
                init: false,
                emptyShow: true,
            })
        })
        this.setData({
            categoryData
        })
        let isRepair;
        if (app.checkRule2("teacher/repairservice/listsByID")) {
            isRepair = true;
            this.setData({
                isRepair,
            })
            this.refresh();
        }
    },
    doAdd(e) {
        let p = e.detail.value
        wx.navigateTo({
            url: '/packageA/pages/addRepair/addRepair?bean=' + JSON.stringify(this.data.types[p])
        })
    },
    checkPri() {
        if (this.data.categoryCur !== 0) {
            this.setData({
                categoryCur: 0
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
                categoryCur: 1
            });
            let pageData = this.getCurrentData();
            if (pageData.init != true) {
                this.getList('refresh');
            }
        }
    },
    getType() {
        let url = '/api/v17/admin/repair/listsType';

        let data = {
            token: wx.getStorageSync('token'),
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            console.log('types', data)

            this.setData({
                types: data,
            });
        });
    },
    getList(type, lastid) {

        let currentCur = this.data.categoryCur;
        if (currentCur == 0 && !this.data.isRepair) {
            return;
        }
        let pageData = this.getCurrentData(currentCur);
        if (type === 'refresh') {
            pageData.end = false
        }
        if (pageData.end) return;

        pageData.requesting = true;
        this.setCurrentData(currentCur, pageData);

        let typeStr;
        if (currentCur == 0) {
            typeStr = "repairer"
        } else {
            typeStr = "report"
        }
        let url = "/api/v17/teacher/repair/listsByID"
        let data = {
            token: wx.getStorageSync('token'),
            lastid: lastid,
            type: typeStr,
        }

        app.httpPost(url, data).then((res) => {
            pageData.requesting = false;
            let listData = res.respResult.data
            let statusStr = ""
            if (listData.length > 0) {
                listData.forEach(item => {
                    item.token = wx.getStorageSync('token')
                    if (item.status == "0") {
                        statusStr = "已撤销"
                    } else if (item.status == "1") {
                        statusStr = "未接单"
                    } else if (item.status == "2") {
                        if (item.isdelay == "1") {
                            statusStr = "已延期(" + item.delayreasons + ")"
                        } else {
                            statusStr = "已接单"
                        }
                    } else if (item.status == "3") {
                        statusStr = "已完成"
                    }
                    item.statusStr = statusStr;
                    item.fileinfo.forEach(it => {
                        it.url = wx.getStorageSync("domain") + it.url
                    })
                    //图片个数凑够3的倍数，方便布局
                    if (item.fileinfo.length > 0) {
                        if (item.fileinfo.length % 3 != 0) {
                            let n = 3 - item.fileinfo.length % 3
                            for (let i = 0; i < n; i++) {
                                item.fileinfo.push({url: ""})
                            }
                        }
                    }

                    if (currentCur == 1) {
                        //报修人逻辑
                        //0撤销 1未接单 2接单 3完成
                        item.isBottom = false
                        if (item.status == "0") {
                            item.isBottom = false
                        } else if (item.status == "1") {
                            item.isBottom = true
                            item.isAction0 = true
                            item.isAction1 = true
                            item.action0 = 'doCancel'
                            item.action0Str = '撤销'
                            item.action1 = 'doRemind'
                            item.action1Str = '提醒'

                        } else if (item.status == "2") {
                            item.isBottom = true
                            item.isAction0 = false
                            item.isAction1 = true
                            item.action1 = 'doRemind'
                            item.action1Str = '提醒'
                        } else if (item.status == "3") {
                            item.isBottom = false
                        }

                    } else if (currentCur == 0) {
                        //维修人逻辑
                        if (item.status == "0") {
                            item.isBottom = false
                        } else if (item.status == "1") {
                            item.isBottom = true
                            item.isAction0 = true
                            item.isAction1 = true
                            item.action0 = 'doShift'
                            item.action0Str = '转单'
                            item.action1 = 'doReceive'
                            item.action1Str = '接单'

                        } else if (item.status == "2") {
                            if (item.isdelay == "1") {
                                item.isBottom = true
                                item.isAction0 = false
                                item.isAction1 = true
                                item.action1 = 'doFinish'
                                item.action1Str = '完成'

                            } else {
                                item.isBottom = true
                                item.isAction0 = true
                                item.isAction1 = true
                                item.action0 = 'doDelay'
                                item.action0Str = '延期'
                                item.action1 = 'doFinish'
                                item.action1Str = '完成'

                            }

                        } else if (item.status == "3") {
                            item.isBottom = false

                        }
                    }
                })
            } else {
                pageData.emptyShow = true
            }
            if (listData.length > 0) {
                pageData.lastid = listData[listData.length - 1].id
            } else {
                pageData.end = true;
                pageData.lastid = null
            }
            if (type === 'refresh') {
                pageData.listData = listData;
            } else {
                pageData.listData = pageData.listData.concat(listData);
            }
            pageData.init = true
            this.setCurrentData(currentCur, pageData);

        })
    },
    checkType(e){
        let b = this.data.types2
        b.forEach(it=>{
            it.checked = false
        })
        b[e.currentTarget.dataset.index].checked = true
        this.setData({
            types2:b,
        })
    },
    modify(bean) {
        let url = "/api/v17/teacher/repair/modify"
        let data = bean

        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            this.refresh()
        })
    },
    remind(id) {
        let url = "/api/v17/teacher/repair/remind"
        let data = {
            token: wx.getStorageSync('token'),
            id: id
        }

        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
        })
    },
    preview(e){
        let url = e.currentTarget.dataset.src
        let u = []
        u.push(url)
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: u // 需要预览的图片http链接列表
        })
    },
    makeCall(event) {
        let number = event.currentTarget.dataset.src
        wx.makePhoneCall({
            phoneNumber: number,
            success: function () {
                console.log("成功拨打电话")
            },
        })
    },
    doBtnFinish() {
        let bean = this.data.requestBody
        if (this.data.showFinish){

        this.modify(bean)
        }else if(this.data.showShift){
            this.data.types.forEach(it=>{
                if (it.checked){
                    bean.typeid = it.id
                }
            })
            this.modify(bean)
        }else if(this.data.showDelay){
            if (bean.delayreasons==null){
                let dd = false
                this.data.types.forEach(it=>{
                    if (it.checked){
                        dd = true
                        bean.delayreasons = it.name
                    }
                })
                if(!dd){
                    showToastWithoutIcon('请说明原因')
                    return
                }
            }else {

            }
            bean.isdelay = "1"
            this.modify(bean)
        }
        this.setData({
            showDialog:false,
            showFinish: false,
            showDelay: false,
            showShift: false,
            overlay: false,
        })

    },
    doInput: function (e) {
        let type = e.currentTarget.dataset.type;
        const v = this.data.requestBody;
        if (type == 'delay') {
            v.delayreasons = e.detail.value
        } else {
            v.completeremark = e.detail.value
        }
        this.setData({
            requestBody: v
        });
    },

    doFinish(e) {
        let bean=e.currentTarget.dataset.bean
        bean.status = "3"
        this.setData({

            showDelay: false,
            showShift: false,
            showDialog:true,
            showFinish:true,
            overlay: true,
            requestBody:bean,
            dialogTitle:'完成备注',
        })
    },
    doReceive(e) {
        let bean=e.currentTarget.dataset.bean
        bean.status = "2"
        bean.repairerid = wx.getStorageSync('uid')
        this.modify(bean)
    },
    doRemind(e) {
        let bean=e.currentTarget.dataset.bean
        this.remind(bean.id)
    },
    doCancel(e) {
        let bean=e.currentTarget.dataset.bean
        bean.status = "0"
        this.modify(bean)
    },
    doShift(e) {
        console.log("aa",'shift')
        let d = this.data.types
        if(d.length>0){
            d[0].checked = true
        }
        this.setData({
            showFinish: false,
            showDelay: false,

            showDialog:true,
            showShift:true,
            overlay: true,
            requestBody:e.currentTarget.dataset.bean,
            types2:d,
            dialogTitle:'请选择转单给',
        })
    },
    doDelay(e) {
        console.log("aa",'doDelay')
        let d = [{name:'返厂维修',checked:false},{name:'购置新品',checked:false}]

        this.setData({
            showFinish: false,

            showShift: false,
            showDialog:true,
            showDelay:true,
            overlay: true,
            requestBody:e.currentTarget.dataset.bean,
            types2:d,
            dialogTitle:'请选择延期原因',
        })
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
            if (pageData.init != true) {
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
        this.getList('refresh', null);
    },

    more() {
        this.getList('more', this.getCurrentData(this.data.categoryCur).lastid);
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