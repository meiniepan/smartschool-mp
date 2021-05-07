//app.js
let host = require('/utils/host.js');
App({
    onLaunch: function () {
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.systemInfo = res;
                if (res.model.search('iphone X') !== -1) {
                    this.globalData.isIpohoneX = true;
                }
                // if (res.screenHeight - res.windowHeight - res.statusBarHeight - 34 > 72) {
                //     this.globalData.isFullScreen = true;
                // }

                this.globalData.statusBarHeight = res.statusBarHeight;
                let capsuleBound = wx.getMenuButtonBoundingClientRect();
                this.globalData.navigationHeight = capsuleBound.top - res.statusBarHeight + capsuleBound.bottom;
            }
        });
    },


    /**
     * http请求封装
     * @param method 请求方法类型
     * @param url 请求路径
     * @param data 请求参数
     * @param loading 请求加载效果 {0: 正常加载, 1: 表单提交加载效果 }
     * @param loadingMsg 请求提示信息
     */
    httpBase: function (method, url, data, loading = false, loadingMsg) {
        let requestUrl = host.BASE_URL_DEV + url;

        if (loading) {
            wx.showLoading({
                title: loadingMsg || '加载中...',
                mask: true
            });
        } else {
            wx.showNavigationBarLoading();
        }

        function request(resolve, reject) {
            wx.request({
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: method,
                url: requestUrl,
                data: data,
                success: function (result) {
                    if (loading) {
                        wx.hideLoading({
                            complete: (res) => {
                            },
                        });
                    } else {
                        wx.hideNavigationBarLoading({
                            complete: (res) => {
                            },
                        });
                    }

                    let res = result.data || {};
                    let code = res.respCode;
                    let errMsg = res.respMsg;

                    if (code != '0000') {
                        if(code == '0004'){
                            wx.redirectTo({
                                url: '/pages/switch_role/switch_role',
                            })
                            return
                        }
                        reject(res);
                        if (errMsg) {
                            wx.showToast({
                                title: errMsg,
                                icon: 'none'
                            });
                        }
                    } else {
                        resolve(res);
                    }
                },
                fail: function (res) {
                    reject(res);

                    if (loading) {
                        wx.hideLoading({
                            complete: (res) => {
                            },
                        });
                    } else {
                        wx.hideNavigationBarLoading({
                            complete: (res) => {
                            },
                        });
                    }

                    wx.showToast({
                        title: '网络异常，请稍后重试',
                        icon: 'none'
                    });
                }
            });
        }

        return new Promise(request);
    },

    httpGet: function (url, data, loading, loadingMsg) {
        return this.httpBase('GET', url, data, loading, loadingMsg);
    },

    httpPost: function (url, data, loading = true, loadingMsg) {
        return this.httpBase('POST', url, data, loading, loadingMsg);
    },

    logout(){
        wx.setStorageSync('token', null)
    },

    saveUserInfo: function (data) {
        wx.setStorageSync('token', data.token)
        wx.setStorageSync('uid', data.uid)
        wx.setStorageSync('idcard', data.idcard)
        wx.setStorageSync('sno', data.sno)
        wx.setStorageSync('eduid', data.eduid)
        wx.setStorageSync('realname', data.realname)
        wx.setStorageSync('sex', data.sex)
        wx.setStorageSync('phone', data.phone)
        wx.setStorageSync('birthday', data.birthday)
        wx.setStorageSync('portrait', data.portrait)
        wx.setStorageSync('class_id', data.class_id)
        wx.setStorageSync('schoolid', data.schoolid)
        wx.setStorageSync('classname', data.classname)
        wx.setStorageSync('companyid', data.companyid)
        wx.setStorageSync('openid', data.openid)
        wx.setStorageSync('wxname', data.wxname)
        wx.setStorageSync('remark', data.remark)
        wx.setStorageSync('isactive', data.isactive)
        wx.setStorageSync('device_no', data.device_no)
        wx.setStorageSync('parentphone', data.parentphone)
        wx.setStorageSync('parentuid', data.parentuid)
        wx.setStorageSync('parentname', data.parentname)
        wx.setStorageSync('classmaster', data.classmaster)
        wx.setStorageSync('isad', data.isad)
        wx.setStorageSync('roleid', data.roleid)
        wx.setStorageSync('usertype', data.usertype)
        wx.setStorageSync('logintype', data.logintype)
        wx.setStorageSync('parents', JSON.stringify(data.parents))
        wx.setStorageSync('students', JSON.stringify(data.students))
        wx.setStorageSync('domain', data.domain)

    },
    //保存用户权限
    saveAppInfo: function (data) {
        wx.setStorageSync('appInfo', data)
    },

    checkRule1(key) {
        let beans = wx.getStorageSync("appInfo")
        for(var i= 0;i< beans.length; i++){
            if (beans[i].url == key) {
                return beans[i].choice == "1"
            }}
        return false
    },
    checkRule2(key) {
        let beans = wx.getStorageSync("appInfo")
        for(var i= 0;i< beans.length; i++){
            for(var j= 0;j< beans[i].items.length; j++){
                if (beans[i].items[j].url == key) {
                    return beans[i].items[j].choice == "1"
                }
            }
        }
        return false
    }
    ,

    globalData: {
        systemInfo: null,
        userInfo: null,
        isIpohoneX: false,
        // isFullScreen: false,
        statusBarHeight: 0,
        navigationHeight: 0,

        scheduleTitle: "日程安排",
        noticeTitle: "通知公告",
        salaryTitle: "工资条",
        taskTitle: "任务协作",
        propertyTitle: "报修报送",
        siteTitle: "场地预约",
        attendanceTitle: "学生考勤",
        achievementTitle: "成绩汇总",
        timetableTitle: "我的课表"
    }
})
