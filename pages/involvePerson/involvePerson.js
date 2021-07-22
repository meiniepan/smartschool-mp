// pages/involvePerson/involvePerson.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)

        this.setData({
            bean: bean,
            mDataInvolve: [],
            mDataReceive:[],
        })
        var s = bean.id.split('_')
        this.getList(bean.type, s[s.length - 1])
    },
    getList(type, id) {
        let that = this
        let url = "", data = {}
        let urlDepart = "/api/v17/teacher/teacher/listByDep"
        let urlClass = "/api/v17/teacher/student/listByClass"
        if (type === 0) {
            url = urlDepart
            data = {
                token: wx.getStorageSync('token'),
                depid: id,
            }
        } else {
            url = urlClass
            data = {
                token: wx.getStorageSync('token'),
                classid: id,
            }
        }

        app.httpPost(url, data).then((res) => {
            let data = [], mDataInvolve = [];
            if (type === 0) {
                console.log("depart", res)
                data = res.respResult;
                data.forEach(bean => {
                    bean.data.forEach(it => {
                        it.parentId = id
                        if (that.data.bean.id.indexOf("_")>=0) {
                            it.topdepartid = that.data.bean.id.split("_")[1]
                        }
                        it.secdepartid = bean.id
                        it.label = it.realname[it.realname.length-1]
                        this.setChoice(it)
                    })
                })
                mDataInvolve=mDataInvolve.concat(data)
            } else {
                data = res.data
                data.forEach(it => {
                    it.parentId = id
                    it.topdepartid = "grade0"
                    if (that.data.bean.id.indexOf("_")>=0) {
                        it.secdepartid = that.data.bean.id.split("_")[1]
                    }
                    it.label = it.realname[it.realname.length-1]
                    this.setChoice(it)
                })
                var bean = {};
                bean.departmentsname = "班级学生名单"
                bean.data = data

                mDataInvolve.push(bean)
            }
            console.log("mDataInvolve", JSON.stringify(mDataInvolve))
            this.setData({
                mDataInvolve
            })
        });
    },
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    doConfirm() {
        const involve= []
        this.data.mDataInvolve.forEach(it=>{
            it.data.forEach(it2=>{
                if (it2.checked){
                    involve.push(it2)
                }
            })
        })
        this.getOpenerEventChannel().emit('involvePerson', {data:involve})
        wx.navigateBack({
            delta: 1,
        })
    },
    setChoice(it) {
        this.data.mDataReceive.forEach(receive => {
            if (receive.uid == it.uid) {
                it.checked = true
                return
            }
        })
    },
    doCheckAll(e){
        var p = e.currentTarget.dataset.position
        var checked = this.data.mDataInvolve[p].checked
        this.data.mDataInvolve[p].checked = !checked
        this.data.mDataInvolve[p].data.forEach(it=>{
            it.checked = !checked
        })
        this.setData({
            mDataInvolve:this.data.mDataInvolve
        })
    },
    doPerson(e){
        var p0 = e.currentTarget.dataset.position0
        var p = e.currentTarget.dataset.position
        var checked = this.data.mDataInvolve[p0].data[p].checked
        this.data.mDataInvolve[p0].data[p].checked= !checked
        this.setData({
            mDataInvolve:this.data.mDataInvolve
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