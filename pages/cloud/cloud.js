import {showToastWithoutIcon} from '../../utils/util';
import {getFileImage} from '../../utils/util';
import {formatShowTime} from '../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        duration: 300,  // swiper-item 切换过渡时间
        mCurrent: 0, // 当前tab
        categoryMenu: ["1", "2"], // 分类菜单数据, 字符串数组格式
        navigationHeight: app.globalData.navigationHeight,
        mData: [],
        isInit: false,
        mDataPriFolder: [],
        mDataPubFolder: [],
        lastId: null,
    },
    getFolder(type, folderid, init) {
        let url = ""
        let urlPriFolder = "/api/v17/disk/folder/mylists"
        let urlPriFile = "/api/v17/disk/folder/myFiles"
        let urlPubFolder = "/api/v17/disk/folderrs/lists"
        let urlPubFile = "/api/v17/disk/folder/myFolderFiles"
        if (type === 0) {
            url = urlPriFolder
        } else {
            url = urlPubFolder
        }
        let data = {
            token: wx.getStorageSync('token'),
            folderid: folderid
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            console.log("data", data)
            let isEmpty = data.length == 0
            data.forEach(item => {
                console.log("cuid", item.cuser_id)
                item.isAdmin = (wx.getStorageSync('uid') == item.cuser_id && type == 1)
                console.log("isAdmin", item.isAdmin)

                item.name = item.foldername
                item.icon = '/assets/images/ic_file.png'
                item.updatetime = formatShowTime(item.updatetime)
            })
            let mDataPriFolder, mDataPubFolder
            if (type === 0) {
                mDataPriFolder = data
            } else {
                mDataPubFolder = data
            }
            if (init === true) {
                this.setData({
                    mDataPubFolder,
                    isEmpty
                });
            } else {
                if (type === 0) {
                    this.setData({
                        mData: data,
                        mDataPriFolder,
                        isEmpty
                    });
                } else {
                    this.setData({
                        mData: data,
                        mDataPubFolder,
                        isEmpty
                    });
                }
            }
        });
    },
    checkPri() {
        if (this.data.mCurrent === 1) {
            this.setData({
                mCurrent: 0,
                mData: this.data.mDataPriFolder
            })
        }
    },
    checkPub() {
        if (this.data.mCurrent === 0) {
            this.setData({
                mCurrent: 1,
                mData: this.data.mDataPubFolder
            })
        }
    },

    doDetail(e) {
        wx.navigateTo({
            url: '/pages/noticeDetail/noticeDetail?id=' + e.currentTarget.data.url,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getFolder(0, null)
        this.getFolder(1, null,true)
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
