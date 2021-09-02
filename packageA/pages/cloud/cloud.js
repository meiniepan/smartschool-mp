import {showToastWithoutIcon} from '../../../utils/util';
import {getFileImage} from '../../../utils/util';
import {formatShowTime} from '../../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mCurrent: 0, // 当前tab
        categoryMenu: ["1", "2"], // 分类菜单数据, 字符串数组格式
        navigationHeight: app.globalData.navigationHeight,
        mData: [],
        mPathData: [],
        mPath: "",
        isInit: false,
        isHome: true,
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


            data.forEach(item => {
                item.isAdmin = (wx.getStorageSync('uid') == item.cuser_id && type == 1)
                item.type = type
                item.name = item.foldername
                item.icon = '../../assets/images/ic_file.png'
                item.updatetime = formatShowTime(item.updatetime)
            })
            let mDataPriFolder, mDataPubFolder,mPath,isEmpty
            if (type === 0) {
                mDataPriFolder = data
                mPath = '我创建的'
                isEmpty = data.length == 0
            } else {
                mDataPubFolder = data
                mPath = '共享文件夹'
            }
            if (init === true) {
                this.setData({
                    mDataPubFolder,
                    mPath,
                });
            } else {
                if (type === 0) {
                    this.setData({
                        mData: data,
                        mDataPriFolder,
                        mPath,
                        isEmpty
                    });
                } else {
                    this.setData({
                        mData: data,
                        mDataPubFolder,
                        mPath,
                    });
                }
            }
        });
    },
    checkPri() {
        if (this.data.mCurrent === 1) {
            this.setData({
                mCurrent: 0,
                mData: this.data.mDataPriFolder,
                isEmpty:this.data.mDataPriFolder.length==0
            })
        }
    },
    checkPub() {
        if (this.data.mCurrent === 0) {
            this.setData({
                mCurrent: 1,
                mData: this.data.mDataPubFolder,
                isEmpty:this.data.mDataPubFolder.length==0
            })
        }
    },

    doDetail(e) {
        console.log("ee",e.currentTarget)
        let position = e.currentTarget.dataset.position
        let bean = this.data.mData[position]
        bean.fullName = this.data.mPath
        wx.navigateTo({
            url: '/packageA/pages/cloudFolder/cloudFolder?bean=' + JSON.stringify(bean),
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getFolder(0, null)
        this.getFolder(1, null, true)
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
