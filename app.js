//app.js
let host = require('/utils/host.js');
let uploadImage = require('/ossjs/uploadImg/uploadImg.js');//地址换成你自己存放文件的位置
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
    checkUpdate() {
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(res=> {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: res=> {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        })
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
        let requestUrl = host.BASE_URL + url;
        console.log("url", requestUrl)
        console.log("body", data)
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
                        if (code == '0004') {
                            wx.setStorageSync('token', null)
                            if (wx.getStorageSync('environment')) {//企业微信环境
                                wx.redirectTo({
                                    url: '/pages/splash/splash',
                                })
                            } else {
                                //非企业微信环境
                                wx.redirectTo({
                                    url: '/packageA/pages/switch_role/switch_role',
                                })
                            }

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
                fail: res=> {
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
    httpBase0: function (method, url, data, loading = false, loadingMsg, contentType = 'application/x-www-form-urlencoded') {
        let requestUrl = url;
        console.log("url", requestUrl)
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
                    'Content-Type': contentType,
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


                    resolve(res);
                },
                fail: res=> {
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
    httpGet0: function (url, data, loading, loadingMsg) {
        return this.httpBase0('GET', url, data, loading, loadingMsg);
    },

    httpPost: function (url, data, loading = true, loadingMsg) {
        return this.httpBase('POST', url, data, loading, loadingMsg);
    },
    httpPost0: function (url, data, loading = true, loadingMsg, contentType) {
        return this.httpBase0('POST', url, data, loading, loadingMsg, contentType);
    },
    ossUpload(objectKey, filePath, callback) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/user/student/osssts"
        } else {
            url = "/api/v17/user/teachers/osssts"
        }
        let data = {
            token: wx.getStorageSync('token'),
        }

        this.httpPost(url, data, false).then((res) => {

            let data = res.respResult.Credentials;
            console.log("ststoken", data)
            uploadImage(data, filePath, objectKey, callback
            )
        });
    },
    ossUpload_(stsTokenBean, objectKey, filePath, callback) {
        let aa = objectKey.split('/')
        if (aa.length > 0) {
            objectKey = aa[aa.length - 1]
        }
        let uid = wx.getStorageSync('uid')
        if (wx.getStorageSync('usertype') === "1") {
            objectKey = "student/" + uid + "/" + objectKey
        } else {
            objectKey = "teacher/" + uid + "/" + objectKey
        }
        const OSS = require('ali-oss');

        const client = new OSS({
            // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
            region: 'oss-cn-beijing',
            // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
            accessKeyId: stsTokenBean.AccessKeyId,
            accessKeySecret: stsTokenBean.AccessKeySecret,
            // 从STS服务获取的安全令牌（SecurityToken）。
            stsToken: stsTokenBean.SecurityToken,
            // 填写Bucket名称。
            bucket: 'xiaoneng'
        });

        const fs = wx.getFileSystemManager()
        fs.readFile({
            filePath: filePath,
            encoding: 'utf8',
            position: 0,
            success(res) {
                let data = res.data
                console.log(res.data)

                async function putObject() {
                    try {
                        const result = await client.put(objectKey, data);
                        callback.success(result)
                        console.log('ossresult', result);
                    } catch (e) {
                        console.log(e);
                    }
                }

                putObject();
            },
            fail(res) {
                console.error(res)
            }
        })


    },

    logout() {
        wx.setStorageSync('token', null)
    },

    saveUserInfo: function (data) {
        console.log("info",data)
        wx.setStorageSync('token', data.token)
        wx.setStorageSync('uid', data.uid)
        wx.setStorageSync('idcard', data.idcard)
        wx.setStorageSync('sno', data.sno)
        wx.setStorageSync('cno', data.cno)
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
        wx.setStorageSync('levelclass', data.levelclass)
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
        for (var i = 0; i < beans.length; i++) {
            if (beans[i].url == key) {
                return beans[i].choice == "1"
            }
        }
        return false
    },
    checkRule2(key) {
        let beans = wx.getStorageSync("appInfo")
        for (var i = 0; i < beans.length; i++) {
            for (var j = 0; j < beans[i].items.length; j++) {
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
        quantizeTitle: "量化评比",
        noticeTitle: "通知公告",
        salaryTitle: "工资条",
        taskTitle: "任务协作",
        cloudTitle: "教学云盘",
        propertyTitle: "报修报送",
        siteTitle: "场地预约",
        attendanceTitle: "学生考勤",
        achievementTitle: "成绩汇总",
        timetableTitle: "我的课表",
        eduAttendance: "教学考勤",

        deleteSure: "确定删除？",
    }
})
