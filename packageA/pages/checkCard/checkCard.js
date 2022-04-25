// packageA/pages/checkCard/checkCard.js
import {formatDate, formatNumber, formatTimeHM, isEmpty, showModal, showToastWithoutIcon} from "../../../utils/util";

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips: "请将卡片靠近手机NFC识别区域\n录入记录",
        mDataRecord: [],
        categoryCur: 0, // 当前数据列索引
        categoryMenu: ['手动录入', '刷卡录入'], // 分类菜单数据
        isEmpty: true,
        requestBody: {
            token: '',
            cardno: "",
            classroomid: "",
            iotype: "",
            attendances: "",
            uid: "",
            remark: "",
        },
        bean: {},
        choosePosition: 0,
        departData: [],
        classData: [],
        indexType: 0,
        indexRoom: 0,
        indexType3: 0,
        dataTypes: [],
        dataRooms: [],
        checked: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let indexType3 = wx.getStorageSync("indexType3")
        if (!isEmpty(indexType3)) {
            this.setData({
                indexType3,
            })
        }
        this.getList()
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
        // let attendances = this.data.bean.attendances
        // if (attendances == "1") {
        //     this.doConfirm("", "", "12")
        // } else {
        //     this.icRequest("12")
        // }
        let nfcBody = app.nfcRead((id) => {
            // showModal(id)
            this.icRequest(id)
        })
        this.nfc = nfcBody.nfc
        this.handler = nfcBody.handler
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("onhide", "=====")

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.nfc.offDiscovered(this.handler)
        this.nfc.stopDiscovery()
        console.log("unload", "=====")
    },

    check1() {
        if (this.data.categoryCur !== 0) {
            this.setData({
                categoryCur: 0
            });

        }
    },
    check2() {
        this.icRequest("12")
        if (this.data.categoryCur !== 1) {
            this.setData({
                categoryCur: 1
            });
        }
    },


    getList() {
        let url = '';
        let data;
        let dataTypes = []
        let dataRooms = []
        let dataTypes3 = []

        url = '/api/v17/moral/ioschool/listsType'
        data = {
            token: wx.getStorageSync('token'),
        }

        app.httpPost(url, data).then((res) => {
            dataTypes = res.respResult.data

            let url = '/api/v17/admin/classroom/lists'
            let data = {
                token: wx.getStorageSync('token'),
            }
            app.httpPost(url, data).then((res) => {
                dataRooms = res.respResult.data
                let url = '/api/v17/moral/moralType/lists'
                let data = {
                    token: wx.getStorageSync('token'),
                }
                app.httpPost(url, data).then((res) => {
                    dataTypes3 = res.respResult.data
                    this.setData({
                        dataTypes,
                        dataRooms,
                        dataTypes3,
                    })
                })

            })

        })
    },

    dealList: function (data) {
        let date = new Date()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        let time = [hour, minute, second].map(formatNumber).join(':')
        let gap = "　　"
        let remark = ""
        if (!isEmpty(data.remark)) {
            remark = data.remark + gap
        }
        let ss = data.levelclass + gap + data.realname + gap + remark + time
            + "\n" + data.speStr + "\n"
        this.data.mDataRecord.unshift(ss)
        this.setData({
            mDataRecord: this.data.mDataRecord,
            isEmpty: this.data.mDataRecord.length == 0,
        })
    },

    onConfirm(cardno) {
        let url = "/api/v17/moral/ioschool/checkCard"
        this.data.requestBody.token = wx.getStorageSync('token')
        this.data.requestBody.cardno = cardno
        this.data.requestBody.iotype = this.data.dataTypes[this.data.indexType].id
        this.data.requestBody.classroomid = this.data.dataRooms[this.data.indexRoom].id
        this.data.requestBody.specialtype = this.data.dataTypes3[this.data.indexType3].id
        this.data.requestBody.attendances = this.data.checked ? "1" : "0"

        if (isEmpty(this.data.requestBody.iotype)
            || isEmpty(this.data.requestBody.classroomid)
            || isEmpty(this.data.requestBody.specialtype)
            || (isEmpty(this.data.requestBody.cardno) && isEmpty(this.data.requestBody.uid))) {
            showToastWithoutIcon('请完善信息')
            return
        }

        let data = this.data.requestBody

        app.httpPost(url, data).then((res) => {
            let data = res.respResult
            let test = "0629005406"
            // data.specials.push("0629005406")
            // data.specials.push("请假条2")
            // data.specials.push("请假条3")
            if (!isEmpty(data.specials)) {
                let str = ""
                if (data.specials.length > 0) {
                    data.specials.forEach(it => {
                        str += it + "\n"
                    })


                } else {
                    str = "没有特殊情况报备"
                }
                // showModal(str, data.realname + "-特殊情况")
                data.speStr = str
                app.textToSpeech(str)
            }
                this.dealList(data);
        });
    },

    doConfirm(e) {
        this.onConfirm("")
    },

    doType(e) {
        let index = e.detail.value
        let type = e.currentTarget.dataset.type
        if (type == "indexType3") {
            wx.setStorageSync("indexType3", index)
        }
        this.setData({
            [type]: index,
        })
    },

    doClass(e) {
        const p = e.currentTarget.dataset.position;
        let vv = this.data.mDataClasses
        let v = this.data.requestBody
        this.data.mData.template[p].value = vv[e.detail.value].levelclass
        v.classid = vv[e.detail.value].id
        this.data.mData.template[p].rules.required.hasValue = true
        this.setData({
            mData: this.data.mData
        })
    },


    doChooseStudent(e) {
        this.setData({
            choosePosition: e.currentTarget.dataset.position,
        })
        let that = this
        let depart = that.data.departData
        let classes = that.data.classData

        console.log('depart', depart)
        wx.navigateTo({
            url: "../addInvolve/addInvolve?data=" + JSON.stringify(depart)
                + '&data2=' + JSON.stringify(classes)
                + '&type=1',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                quantizeSpecial: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    that.doResult(data);
                }
            },
        });
    },

    doNfc(e) {
        this.setData({
            choosePosition: e.currentTarget.dataset.position,
        })

    },

    doResult(data) {
        let realname = '', uid = ""
        data.mDataDepartment.forEach(it => {
            if (it.num > 0) {
                realname = it.list[0].realname
                this.data.requestBody.uid = it.list[0].uid
            }
        })
        data.mDataClasses.forEach(it => {
            if (it.num > 0) {
                realname = it.list[0].realname
                this.data.requestBody.uid = it.list[0].uid
            }
        })
        console.log('stu', realname)
        console.log('uid', uid)


        this.setData({
                realname,
                requestBody: this.data.requestBody,
            }
        )
    },

    switchChange(e) {
        let checked = e.detail.value
        this.setData({
            checked,
        })

    },

    icRequest(id) {
        if (this.data.categoryCur == "1") {
            this.onConfirm("12")
        }
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
            path: 'pages/splash/splash',
            imageUrl: "../../assets/images/bac_share.png",
        }
    }
})