import {showToastWithoutIcon} from '../../utils/util';
import {getFileImage} from '../../utils/util';
import {formatShowTime} from '../../utils/util';
import {isVideo} from '../../utils/util';
import {isImage} from '../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        duration: 300,  // swiper-item 切换过渡时间
        folderBean: {},
        mData: [],
        mDataFolder: [],
        mPath: "",
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
            let isEmpty = data.length == 0
            data.forEach(item => {
                item.type = type
                item.isAdmin = (wx.getStorageSync('uid') == item.cuser_id && type == 1)
                item.name = item.foldername
                item.icon = '/assets/images/ic_file.png'
                item.updatetime = formatShowTime(item.updatetime)
                item.isFolder = true
            })
            this.setData({
                mDataFolder: data,
            });
            this.getFile(type, folderid)
        });
    },

    getFile(type, folderid) {
        let url = ""
        let urlPriFolder = "/api/v17/disk/folder/mylists"
        let urlPriFile = "/api/v17/disk/folder/myFiles"
        let urlPubFolder = "/api/v17/disk/folderrs/lists"
        let urlPubFile = "/api/v17/disk/folder/myFolderFiles"
        if (type === 0) {
            url = urlPriFile
        } else {
            url = urlPubFile
        }
        let data = {
            token: wx.getStorageSync('token'),
            folderid: folderid
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            console.log("data", data)
            data.forEach(item => {
                item.isAdmin = (wx.getStorageSync('uid') == item.cuser_id && type == 1)
                item.name = item.filename
                item.icon = getFileImage(item.objectid)
                item.updatetime = formatShowTime(item.updatetime)
                item.isFolder = false
                item.objectid = wx.getStorageSync('domain')+item.objectid
            })
            let total = this.data.mDataFolder.concat(data)
            let isEmpty = total.length == 0

            this.setData({
                mData: total,
                isEmpty
            });
        });
    },

    doDetail(e) {
        let position = e.currentTarget.dataset.position
        let bean = this.data.mData[position]
        bean.fullName = this.data.mPath
        if (bean.isFolder) {
            wx.navigateTo({
                url: '/pages/cloudFolder/cloudFolder?bean=' + JSON.stringify(bean),
            })
        } else {
            if (isVideo(bean.objectid)) {
                let url = bean.objectid;
                wx.navigateTo({
                    url: `../videoPlayer/videoPlayer?url=${url}`,
                });
            } else if(isImage(bean.objectid)) {
                let u = []
                u.push(bean.objectid)
                wx.previewImage({
                    current: bean.objectid, // 当前显示图片的http链接
                    urls: u // 需要预览的图片http链接列表
                })
            }else {
                let url = encodeURIComponent(bean.objectid);
                wx.navigateTo({
                    url: `../webDetail/webDetail?url=${url}`,
                });
            }

        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)
        console.log("option",bean)
        this.setData({
            mPath: bean.fullName + '>' + bean.foldername,
            folderBean: bean
        })
        this.getFolder(bean.type, bean.folderid)
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
