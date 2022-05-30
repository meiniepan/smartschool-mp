// packageA/pages/archives/archives.js
const {getRpx} = require("../../../utils/util");
const {isEmpty} = require("../../../utils/util");
let app = getApp()
let bacArchives = "archives_bac2"
let uid = ""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img: "/assets/images/ic_avatar_default.png",
        title: "教师成长档案",
        curTab: 0,
        mDataTab: [],
        bac: "",
        mMarginTop: app.globalData.navigationHeight * getRpx() + 115,
        dataUrls0: [{name: "班主任年限", data: [], url: "/api/v17/develop/teachers/headmaster_list"},
            {name: "任教情况及年限", data: [], url: "/api/v17/develop/teachers/teacherTeach_list"},
            {name: "岗位情况", data: [], url: "/api/v17/develop/teachers/post_list"},],
        dataUrls1: [{name: "职称等级", data: [], url: "/api/v17/develop/teachers/professional_list"},
            {name: "骨干级别", data: [], url: "/api/v17/develop/teachers/backbone_list"},
            {name: "荣誉称号", data: [], url: "/api/v17/develop/teachers/honorary_list"},],
        dataUrls2: [{name: "参与课题", data: [], url: "/api/v17/develop/teachers/topic_list"},
            {name: "论文获奖", data: [], url: "/api/v17/develop/teachers/award_list"},
            {name: "论文发表", data: [], url: "/api/v17/develop/teachers/publish_list"},
            {name: "著作出版", data: [], url: "/api/v17/develop/teachers/book_list"},
            {name: "做课历史", data: [], url: "/api/v17/develop/teachers/teacher_course_list"},
            {name: "师徒制", data: [], url: "/api/v17/develop/teachers/pupil_list"},
            {name: "社会兼职", data: [], url: "/api/v17/develop/teachers/partjob_list"},],
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bac = wx.getStorageSync(bacArchives)
        if (bac.length > 0) {
            this.setData({
                bac,
            })
        } else {
            this.getBac();
        }
        this.getData(options.uid)

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
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    doSearch() {
        let this_ = this
        wx.navigateTo({
            url: "../addInvolve2/addInvolve2",
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                involvePerson: function (data) {
                    //这里是获取被打开页面传送到当前页面的数据
                    console.log("uid===", data)
                    this_.getData(data);
                }
            },
        });
    },
    getBac: function () {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        wx.cloud.downloadFile({
            fileID: 'cloud://env-4gwafyi0129f4b02.656e-env-4gwafyi0129f4b02-1308234288/bac_archives.png',
            success: res => {
                // get temp file path
                wx.setStorageSync(bacArchives, res.tempFilePath)
                this.setData({
                    bac: res.tempFilePath,
                })

            },
            fail: err => {
                // handle error

            }
        })
    },

    binderror(e) {
        this.data.mData.portrait = "/assets/images/ic_avatar_default.png"
        this.setData({
            mData: this.data.mData,
        })
    },

    getData(uid) {
        this.uid = uid
        let url = "/api/v17/develop/teachers/info"
        let data = {
            token: wx.getStorageSync('token'),
            uid: uid,
        }

        app.httpPost(url, data).then((res) => {
            let mData = res.respResult
            if (!isEmpty(mData.portrait)) {
                mData.portrait = wx.getStorageSync("domain") + mData.portrait;
            } else {
                mData.portrait = "/assets/images/ic_avatar_default.png"
            }
            let sex = mData.sex == "1" ? "男" : mData.sex == "2" ? "女" : "未知";
            if (mData.work_year.length > 0) {
                mData.work_year = mData.work_year + "年"
            }
            if (mData.teach_year.length > 0) {
                mData.teach_year = mData.teach_year + "年"
            }
            mData.sex = sex
            this.setData({
                mData,
            })
        })

        this.getDataTab(uid)
    },


    getDataTab(uid) {
        let urls = []
        let ss = ""
        let data = {
            token: wx.getStorageSync('token'),
            uid: uid,
        }
        for (let i = 0; i < 3; i++) {
            if (i == 0) {
                ss = "dataUrls0"
                urls = this.data[ss]
            } else if (i == 1) {
                ss = "dataUrls1"
                urls = this.data[ss]
            } else if (i == 2) {
                ss = "dataUrls2"
                urls = this.data[ss]
            }
            for (let j = 0; j < urls.length; j++) {
                this.getDataTabDetail(urls,data,i,j,ss)
            }
        }

    },

    getDataTabDetail(urls,data,i,j,ss){
        app.httpPost(urls[j].url, data).then((res) => {
            let data = res.respResult.datalist

            if (data.length>5){
                data = data.slice(0,5)
            }
            data.forEach(it=>{
                it.time= ""
                it.str= ""
                if(i == 0&&j==0){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.class_other
                    +"\n"+it.classtype_other?it.classtype_other:it.classtype_str
                }else if(i == 0&&j==1){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.class_other
                    +"\n"+it.subject_other?it.subject_other:it.subject_str
                    +"\n"+it.teachtype_other?it.teachtype_other:it.teachtype_str
                }if(i == 0&&j==2){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.post_other?it.post_other:it.post_str
                }if(i == 1&&j==0){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.professional_other?it.professional_other:it.professional_str
                }if(i == 1&&j==1){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.backbone_other?it.backbone_other:it.backbone_str
                }if(i == 1&&j==2){
                    it.time= it.grant_time
                    it.str= it.honorary_other?it.honorary_other:it.honorary_str
                }if(i == 2&&j==0){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.name
                }if(i == 2&&j==1){
                    it.time= it.award_time
                    it.str= it.name
                    +"\n"+it.award_grade_other?it.award_grade_other:it.award_grade_str
                }if(i == 2&&j==2){
                    it.time= it.publish_time
                    it.str= it.article_name
                }if(i == 2&&j==3){
                    it.time= it.publish_time
                    it.str= it.book_name
                }if(i == 2&&j==4){
                    it.time= it.course_time
                    it.str= it.name
                    +"\n"+it.course_grade_other?it.course_grade_other:it.course_grade_str
                }if(i == 2&&j==5){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.pupil_name
                    +"\n"+it.pupil_subject_other?it.pupil_subject_other:it.pupil_subject_str
                }if(i == 2&&j==6){
                    it.time= it.start_time+it.start_time?"~":""+it.end_time
                    it.str= it.partjob
                }
            })
            urls[j].data = data
            urls[j].count = res.respResult.count
            this.setData({
                [ss]: urls,
            })
            console.log([ss],urls)
        })
    },

    doMore(e) {
        let url = e.currentTarget.dataset.data.url
        let name = e.currentTarget.dataset.data.name
        wx.navigateTo({
            url: "../archivesMore/archivesMore?url="+url+"&uid="+uid+"&name="+name,
        });
    },

    check0(e) {
        this.setData({
            curTab: 0,
        })
    },
    check1(e) {
        this.setData({
            curTab: 1,
        })
    },
    check2(e) {
        this.setData({
            curTab: 2,
        })
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
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})
