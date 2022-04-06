// packageA/pages/quantizeCommon/quantizeCommon.js
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
            score: "",
            correctscore: "",
            remark: null,
        },
        bean: {},
        choosePosition: 0,
        departData: [],
        classData: [],
        scoreMap: new Map(),
        totalScore: 0,
        stuItemIndex: -1,
        classItemIndex: -1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)
        this.setData({
            bean,
        })
        this.getList(bean.id)
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
        if (this.data.categoryCur !== 1) {
            this.setData({
                categoryCur: 1
            });

        }
    },

    getList(id) {
        let url = '';
        let data;
        let mDataClasses = []

        url = '/api/v17/moral/moralType/info'
        data = {
            token: wx.getStorageSync('token'),
            id: id,
        }

        app.httpPost(url, data).then((res) => {
            let scoreMap = new Map()
            let mData = res.respResult
            let stuItemIndex = -1
            let classItemIndex = -1
            let scoreItemIndex = -1
            console.log("data", mData)
            if (mData.template.length > 0) {
                mData.template = JSON.parse(mData.template)
                mData.template.forEach((it, index) => {
                    if (it.name == "InputNumber") {
                        if (it.label == "扣分") {
                            this.data.requestBody.score = it.value
                            this.data.totalScore = it.value
                            scoreItemIndex = index
                        } else if (it.label == "综合加分") {
                            this.data.requestBody.correctscore = it.value
                        }
                        it.mNumber = parseInt(it.value)
                    } else if (it.name == "InputScore") {
                        it.mNumber = parseInt(it.value)
                        scoreMap.set(index, it.mNumber)
                    } else if (it.name == "ChoseStudents") {
                        stuItemIndex = index
                    } else if (it.name == "CascaderClass") {
                        classItemIndex = index
                    } else if (it.name == "DatePicker") {
                        let v = this.data.requestBody
                        v.checktime = formatDate()
                        it.value = formatDate()
                        it.rules.required.hasValue = true
                    } else if (it.name == "DateTimePicker") {
                        let v = this.data.requestBody
                        v.checktime = formatTimeHM()
                        it.value = formatTimeHM()
                        it.rules.required.hasValue = true
                    }
                    if (it.value != null && it.value.length > 0) {
                        it.rules.required.hasValue = true
                    }
                })
            } else {
                mData.template = []
            }
            let url = '/api/v17/teacher/classs/treeClass'
            let data = {
                token: wx.getStorageSync('token'),
            }
            app.httpPost(url, data).then((res) => {
                let data = res.respResult

                data.forEach(it => {
                    mDataClasses = mDataClasses.concat(it.list)
                })
                this.setData({
                    mData,
                    mDataClasses,
                    requestBody: this.data.requestBody,
                    totalScore: this.data.totalScore,
                    stuItemIndex,
                    classItemIndex,
                    scoreItemIndex,
                    scoreMap,
                })
            })

        })
    },

    dealList: function (data) {
        let date = new Date()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        let classValue = data.levelclass
        let realname = data.realname
        let time = [hour, minute, second].map(formatNumber).join(':')
        let score = this.data.requestBody.score + "分"
        let gap = "　　"
        let remark = ""
        if (!isEmpty(data.remark)) {
            remark = data.remark + gap
        }
        let ss = classValue + gap + realname + gap + score + gap + remark + time
        this.data.mDataRecord.unshift(ss)
        this.setData({
            mDataRecord: this.data.mDataRecord,
            isEmpty: this.data.mDataRecord.length == 0,
        })
    },

    doConfirm(e) {
        this.onConfirm("", "")
    },

    onConfirm(data2, cardno) {

        let url = "/api/v17/moral/moralScore/add"
        let data = ""

        let bean = this.data.requestBody
        bean.token = wx.getStorageSync('token')
        let cc = this.data.mData.template
        for (let i = 0; i < cc.length; i++) {
            if (cc[i].rules.required.required == true) {
                if (cc[i].rules.required.hasValue != true) {
                    let s = '请完善信息'
                    let message = cc[i].rules.required.message
                    if (message != null && message.length > 0) {
                        s = message
                    }
                    showToastWithoutIcon(s)
                    return
                }
            }
        }

        bean.templatedata = JSON.stringify(this.data.mData.template)
        bean.typeid = this.data.bean.id
        data = bean
        app.httpPost(url, data).then((res) => {
            if (this.data.categoryCur == "1") {
                if (this.data.categoryCur == "1") {
                    this.dealList(data2);
                }
            } else {
                showToastWithoutIcon('处理完成')
            }

        });


    },
    doInput: function (e) {
        const p = e.currentTarget.dataset.position;
        this.data.mData.template[p].value = e.detail.value

        this.data.mData.template[p].rules.required.hasValue = e.detail.value.length > 0

        this.setData({
            mData: this.data.mData,
            requestBody: this.data.requestBody,
        });
    },

    setTotalScore() {
        let totalScore = 0
        this.data.scoreMap.forEach((value => {
            if (typeof (value) == "number") {

                totalScore += value
            }
        }))
        this.data.requestBody.score = totalScore.toString()
        this.setData({
            requestBody: this.data.requestBody,
            totalScore,
        })
    },

    doInputNum: function (e) {
        const p = e.currentTarget.dataset.position;
        let ss = e.detail.value
        if (ss < this.data.mData.template[p].setting.min) {
            ss = this.data.mData.template[p].setting.min
            showToastWithoutIcon("注意最小值~")
        } else if (ss > this.data.mData.template[p].setting.max) {
            ss = this.data.mData.template[p].setting.max
            showToastWithoutIcon("注意最大值~")
        }
        this.data.mData.template[p].value = ss
        this.data.mData.template[p].mNumber = parseInt(ss)
        if (this.data.mData.template[p].label == "扣分") {
            this.data.requestBody.score = ss
            this.data.totalScore = parseInt(ss)
        } else if (this.data.mData.template[p].label == "综合加分") {
            this.data.requestBody.correctscore = ss
        } else {
            this.data.scoreMap.set(p, parseInt(ss))
            this.setData({
                scoreMap: this.data.scoreMap,
            }, () => {
                this.setTotalScore()
            });
        }
        this.data.mData.template[p].rules.required.hasValue = ss.length > 0

        this.setData({
            mData: this.data.mData,
            requestBody: this.data.requestBody,
            totalScore: this.data.totalScore,
        });
    },
    doMinus(e) {
        const p = e.currentTarget.dataset.position;

        let mNumber = this.data.mData.template[p].mNumber
        if (mNumber > this.data.mData.template[p].setting.min) {
            mNumber -= this.data.mData.template[p].setting.step

            if (mNumber < this.data.mData.template[p].setting.min) {
                mNumber = this.data.mData.template[p].setting.min
            }
            this.data.mData.template[p].value = mNumber.toString()
            this.data.mData.template[p].mNumber = mNumber
            this.data.mData.template[p].rules.required.hasValue = mNumber == null
            if (this.data.mData.template[p].label == "扣分") {
                this.data.requestBody.score = mNumber.toString()
                this.data.totalScore = mNumber
            } else if (this.data.mData.template[p].label == "综合加分") {
                this.data.requestBody.correctscore = mNumber.toString()
            } else {
                this.data.scoreMap.set(p, mNumber)
                this.setData({
                    scoreMap: this.data.scoreMap,
                }, () => {
                    this.setTotalScore()
                });
            }
        } else {
            showToastWithoutIcon("不能再减了~")
        }
        this.setData({
            mData: this.data.mData,
            requestBody: this.data.requestBody,
            totalScore: this.data.totalScore,
        });
    },
    doPlus(e) {
        const p = e.currentTarget.dataset.position;

        let mNumber = this.data.mData.template[p].mNumber
        console.log("num", mNumber)
        console.log("max", this.data.mData.template[p].setting.max)
        console.log("min", this.data.mData.template[p].setting.min)
        console.log("score", this.data.requestBody.score)
        if (mNumber < this.data.mData.template[p].setting.max) {
            mNumber += this.data.mData.template[p].setting.step
            if (mNumber > this.data.mData.template[p].setting.max) {
                mNumber = this.data.mData.template[p].setting.max
            }
            this.data.mData.template[p].value = mNumber.toString()
            this.data.mData.template[p].mNumber = mNumber
            this.data.mData.template[p].rules.required.hasValue = mNumber == null
            if (this.data.mData.template[p].label == "扣分") {
                this.data.requestBody.score = mNumber.toString()
                this.data.totalScore = mNumber
            } else if (this.data.mData.template[p].label == "综合加分") {
                this.data.requestBody.correctscore = mNumber.toString()
            } else {
                this.data.scoreMap.set(p, mNumber)
                this.setData({
                    scoreMap: this.data.scoreMap,
                }, () => {
                    this.setTotalScore()
                });
            }
        } else {
            showToastWithoutIcon("不能再加了~")
        }

        this.setData({
            mData: this.data.mData,
            requestBody: this.data.requestBody,
            totalScore: this.data.totalScore,
        });
    },
    doAct(e) {
        const p = e.currentTarget.dataset.position;
        let v = this.data.mData.template[p]
        this.data.mData.template[p].value = v.selections[e.detail.value]
        this.data.mData.template[p].rules.required.hasValue = true
        this.setData({
            mData: this.data.mData
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
    doRule(e) {
        let p = e.currentTarget.dataset.position
        let cc = this.data.mData.template[p].selections
        if (cc.length > 0 && cc[0].name == null) {
            cc.forEach((it, index, arr) => {
                arr[index] = {name: it, checked: false}
            })
        }
        this.data.mData.template[p].rules.required.hasValue = true
        this.setData({
            choosePosition: e.currentTarget.dataset.position,
            mData: this.data.mData,
            show: true,
            overlay: true,
        })
    },
    doBtn1() {
        this.setData({
            show: false,
            overlay: false,
        })
    },
    doBtn2() {
        this.setData({
            show: false,
            overlay: false,
        })

        let bean = this.data.requestBody
        var v = this.data.mData.template[this.data.choosePosition]
        let str = '', types = ''
        v.selections.forEach(it => {
            if (it.checked) {
                str = str + it.name + ","
            }
        })
        if (str.length > 1) {
            str = str.substring(0, str.length - 1)
            v.value = str
            this.setData({
                requestBody: bean,
                mData: this.data.mData,
            })
        }
    },
    checkRule(e) {
        var v = this.data.mData.template[this.data.choosePosition].selections
        v[e.currentTarget.dataset.index].checked = !v[e.currentTarget.dataset.index].checked
        this.setData({
            mData: this.data.mData,
        })
    },
    bindDate(e) {
        let v = this.data.requestBody
        const p = e.currentTarget.dataset.position;
        v.checktime = e.detail.value
        this.data.mData.template[p].value = e.detail.value
        this.data.mData.template[p].rules.required.hasValue = true
        this.setData({
            requestBody: v,
            mData: this.data.mData
        })

    },
    bindTime(e) {
        let v = this.data.requestBody
        const p = e.currentTarget.dataset.position;
        let cc = this.data.mData.template[p]
        v.checktime = e.detail.dateString
        this.data.mData.template[p].value = e.detail.dateString
        this.data.mData.template[p].rules.required.hasValue = true
        this.setData({
            requestBody: v,
            mData: this.data.mData
        })

    },
    bindTimeS(e) {
        let v = this.data.requestBody
        v.stime = e.detail.value
        this.setData({
            requestBody: v,
        })
    },
    bindTimeE(e) {
        let v = this.data.requestBody
        v.etime = e.detail.value
        const p = e.currentTarget.dataset.position;
        this.data.mData.template[p].value = v.stime + '至' + v.etime
        this.setData({
            mData: this.data.mData,
            requestBody: v,
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
        let str = '', involves = []
        var v = this.data.mData.template[this.data.choosePosition]
        data.mDataDepartment.forEach(it => {
            if (it.num > 0) {
                it.list.forEach(it => {
                    str = str + it.realname + "、"
                    involves.push(it)
                })
            }
        })
        data.mDataClasses.forEach(it => {
            if (it.num > 0) {
                it.list.forEach(it => {
                    str = str + it.realname + "、"
                    involves.push(it)
                })
            }
        })
        console.log('stu', v)
        console.log('involves', involves)
        if (str.length > 0) {
            v.rules.required.hasValue = true
            str = str.substring(0, str.length - 1)
        } else {
            v.rules.required.hasValue = false
        }

        this.data.requestBody.involve = JSON.stringify(involves)
        v.value = JSON.stringify(involves)
        v.value2 = str
        this.setData({
                mData: this.data.mData,
                requestBody: this.data.requestBody,
                departData: data.mDataDepartment,
                classData: data.mDataClasses,
            }
        )
    },


    icRequest(id) {

        let url = '/api/v17/user/login/cardinfo'
        let data = {
            token: wx.getStorageSync('token'),
            cardno: "12",
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult
            if (this.data.stuItemIndex != -1 && this.data.classItemIndex != -1) {
                var v = this.data.mData.template[this.data.stuItemIndex]
                var vClass = this.data.mData.template[this.data.classItemIndex]
                v.value2 = data.realname
                v.rules.required.hasValue = true
                vClass.rules.required.hasValue = true
                vClass.value = data.levelclass
                this.data.requestBody.classid = data.classid
                let involves = []
                involves.push(data)
                this.data.requestBody.involve = JSON.stringify(involves)

                this.setData({
                    mData: this.data.mData,
                    requestBody: this.data.requestBody,
                }, () => {
                    if (this.data.categoryCur == "1") {
                        this.onConfirm(data, id)
                    }
                })
            }

        })
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