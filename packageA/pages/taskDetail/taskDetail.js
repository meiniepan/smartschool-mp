// pages/taskDetail/taskDetail.js
import {getFileImage, isImage, isVideo} from "../../../utils/util";

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: {
            token: wx.getStorageSync('token'),
            id: null,
            plantime: '请选择开始时间',
            overtime: '请选择结束时间',
            status: '',
            stuStr: '',
            taskname: '',
            remark: '',
            involve: '',
            fileinfo: '',
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            type: options.type,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let url, data = ''
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/tasks/info"
            data = {
                token: wx.getStorageSync('token'),
                id: this.data.id,
            }
        } else {
            url = "/api/v17/teacher/tasks/info"
            if (this.data.type == "1") {
                data = {
                    token: wx.getStorageSync('token'),
                    id: this.data.id,
                }
            } else if (this.data.type == "0") {
                data = {
                    token: wx.getStorageSync('token'),
                    id: this.data.id,
                    type: 'task'
                }
            }

        }


        app.httpPost(url, data).then((res) => {

            let mData = res.respResult
            console.log('data', res)
            let mFiles = []
            if (mData.fileinfo.length > 0) {
                mData.fileinfo = JSON.parse(mData.fileinfo)
                mData.fileinfo.forEach((it, arr) => {
                    let type = getFileImage(it.url);

                    mFiles.push({name: it.name, image: type, url: wx.getStorageSync("domain") + it.url})
                })
            } else {
                mData.fileinfo = []
            }


            //是否是发布人
            let showClose = false
            let isOperator = mData.operatorid == wx.getStorageSync('uid')
            if (isOperator && this.data.type == "0" && mData.status != "3") {
                showClose = true
            } else {
                showClose = false
            }

            var logData = mData.tasklist
            let mDataLog = []
            var isEmpty = true
            if (this.data.type == "1") {
                mData.addLog = true
            } else {
                mData.addLog = false
            }
            var finishNum = 0
            let mDataUnread = []
            let myLogBean = {}
            logData.forEach(it => {
                if (it.completestatus == "1") {
                    let mFiles = []
                    if (it.fileinfo.length > 0) {
                        it.fileinfo = JSON.parse(it.fileinfo)
                        it.fileinfo.forEach((it, arr) => {
                            let type = getFileImage(it.url);
                            mFiles.push({name: it.name, image: type, url: wx.getStorageSync("domain") + it.url})
                        })
                    }
                    it.mFiles = mFiles
                    finishNum++
                    isEmpty = false
                    mDataLog.push(it)
                } else {
                    mDataUnread.push({uid: it.uid, username: it.username})
                }
                if (it.uid == wx.getStorageSync('uid')) {
                    myLogBean = it
                    if (it.feedback == null || it.feedback == '') {
                        mData.addLog = true
                    } else {
                        mData.addLog = false
                    }
                }
            })
            mData.finishStr = '完成情况(' + finishNum + '/' + logData.length + ')'
            if (isEmpty) {
                if (this.data.type == "1") {

                } else if (this.data.type == "0") {

                }
            } else {

            }
            mData.mDataLog = mDataLog
            mData.myLogBean = myLogBean

            this.setData({
                requestBody: mData,
                mType: this.data.type,
                mFiles,
                showClose,
                isOperator,
            })
            this.doResult(mData.involve)
        });
    },
    doResult(data) {
        let str = '', involves = []

        data.forEach(it => {
            str = str + it.realname + "、"
            involves.push(it)
        })

        str = str.substring(0, str.length - 1)
        this.data.requestBody.stuStr = str
        this.setData({
                requestBody: this.data.requestBody,
            }
        )
    },
    openFile(e) {
        let url = e.currentTarget.dataset.url;
        let url2 = encodeURIComponent(e.currentTarget.dataset.url);
        console.log("url3", e.currentTarget.dataset.url)

        if (isVideo(url)) {
            wx.navigateTo({
                url: `../videoPlayer/videoPlayer?url=${url}`,
            });
        } else if (isImage(url)) {
            let u = []
            u.push(url)
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: u // 需要预览的图片http链接列表
            })
        } else {
            wx.navigateTo({
                url: `../webDetail/webDetail?url=${url2}`,
            });
        }
    },
    doAddLog(e) {
        wx.navigateTo({
            url: `../addLog/addLog?bean=${JSON.stringify(this.data.requestBody.myLogBean)}`,
        });
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