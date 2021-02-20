// pages/repairList/repairList.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mData:{lastid:null,listData:[]},
    },

    getList(type, lastid) {
        let mData = this.data.mData;
        if (type === 'refresh') {
            mData.end = false
        }
        if (mData.end) return;

        mData.requesting = true;
        this.setData({
            mData,
        });
        let url = "/api/v17/teacher/repair/listsByID"
        let data = {
            token: wx.getStorageSync('token'),
            lastid: lastid,
            type:this.data.typeStr,
        }

        app.httpPost(url, data).then((res) => {
            mData.requesting = false;
            let listData = res.respResult.data
            let statusStr=""
            if (listData.length>0){
                listData.forEach(item=>{
                    if(item.status == "0"){
                        statusStr = "已撤销"
                    }
                    else if(item.status == "1"){
                        statusStr = "未接单"
                    }
                    else if(item.status == "2"){
                        if (item.isdelay == "1") {
                            statusStr = "已延期"
                        } else {
                            statusStr = "已接单"
                        }
                    }
                    else if(item.status == "3"){
                        statusStr = "已完成"
                    }
                    item.statusStr = statusStr;
                    item.fileinfo.forEach(it=>{
                        it.url = wx.getStorageSync("domain")+it.url
                    })
                    //图片个数凑够3的倍数，方便布局
                    if (item.fileinfo.length>0){
                        let n = 3-item.fileinfo.length%3
                        for (let i = 0; i <n ; i++) {
                            item.fileinfo.push({url:""})
                        }
                    }
                })
            }else {
                mData.emptyShow = true
            }
            if (listData.length > 0) {
                mData.lastid = listData[listData.length - 1].id
            } else {
                mData.end = true;
                mData.lastid = null
            }
            if (type === 'refresh') {
                mData.listData = listData;
            } else {
                mData.listData = mData.listData.concat(listData);
            }
            this.setData({
                mData,
            });
        })
    },
    refresh() {
        this.getList('refresh',null);
    },

    more() {
        this.getList('more', this.data.mData.lastid);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let typeStr;
        if (options.type == "0") {
            typeStr = "report"
        } else if (options.type == "1") {
            typeStr = "repairer"
        }
        this.setData({
            typeStr,
        })
        this.refresh()
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