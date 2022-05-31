// packageA/pages/archivesMore/archivesMore.js
import {isEmpty, toIntSafe} from "../../../utils/util";

let app = getApp()
let url = ""
let uid = ""
let i = ""
let j = ""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mData: [],
        mRequest: {},
        lastId: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        url = options.url
        uid = options.uid
        i = options.i
        j = options.j
        wx.setNavigationBarTitle({
            title: options.name
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
    getList(type) {
        let mRequest = this.data.mRequest
        let lastId = null
        if (type === 'refresh') {
            mRequest.end = false
        }
        if (mRequest.end) return;

        mRequest.requesting = true;
        this.setData({
            mRequest,
        })
        let data = {
            token: wx.getStorageSync('token'),
            uid: uid,
            id: this.data.lastId,
        }
        app.httpPost(url, data).then((res) => {
            mRequest.requesting = false;
            let data = res.respResult.datalist

            let sss = " "
            data.forEach(it=>{
                it.time= ""
                it.str= ""

                if(i == 0&&j==0){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= it.class_other
                        +sss+(!isEmpty(it.classtype_other)?it.classtype_other:it.classtype_str)
                }else if(i == 0&&j==1){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= it.class_other
                        +sss+(!isEmpty(it.subject_other)?it.subject_other:it.subject_str)
                        +sss+(!isEmpty(it.teachtype_other)?it.teachtype_other:it.teachtype_str)
                }if(i == 0&&j==2){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= (!isEmpty(it.post_other)?it.post_other:it.post_str)
                }if(i == 1&&j==0){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= (!isEmpty(it.professional_other)?it.professional_other:it.professional_str)
                }if(i == 1&&j==1){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= (!isEmpty(it.backbone_other)?it.backbone_other:it.backbone_str)
                }if(i == 1&&j==2){
                    it.time= it.grant_time
                    it.str= (!isEmpty(it.honorary_other)?it.honorary_other:it.honorary_str)
                }if(i == 2&&j==0){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= it.name
                }if(i == 2&&j==1){
                    it.time= it.award_time
                    it.str= it.name
                        +sss+(!isEmpty(it.award_grade_other)?it.award_grade_other:it.award_grade_str)
                }if(i == 2&&j==2){
                    it.time= it.publish_time
                    it.str= it.article_name
                }if(i == 2&&j==3){
                    it.time= it.publish_time
                    it.str= it.book_name
                }if(i == 2&&j==4){
                    it.time= it.course_time
                    it.str= it.name
                        +sss+(!isEmpty(it.course_grade_other)?it.course_grade_other:it.course_grade_str)
                }if(i == 2&&j==5){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= it.pupil_name
                        +sss+(!isEmpty(it.pupil_subject_other)?it.pupil_subject_other:it.pupil_subject_str)
                }if(i == 2&&j==6){
                    it.time= it.start_time+(!isEmpty(it.start_time)?" ~ ":"")+it.end_time
                    it.str= it.partjob
                }
            })


            if (data.length > 0) {
                lastId = data[data.length - 1].id
            } else {
                mRequest.end = true;
            }
            if (type === 'more') {
                data = this.data.mData.concat(data)
            } else {
                mRequest.emptyShow = data.length == 0
            }
            this.setData({
                mData: data,
                lastId: lastId,
                mRequest,
            });
        });


    },

    refresh() {

        this.setData({
            lastId: null,
            scrollTop: 0
        });
        this.getList('refresh');
    },

    more() {
        this.getList('more');
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
            imageUrl: "../../assets/images/bac_share.png",
        }
    }
})