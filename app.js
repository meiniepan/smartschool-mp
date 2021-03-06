//app.js
import {isEmpty, showModal} from "./utils/util";

let host = require('/utils/host.js');
let uploadImage = require('/ossjs/uploadImg/uploadImg.js');//地址换成你自己存放文件的位置
var pluginSpeech = requirePlugin("WechatSI");

App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }

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

        updateManager.onCheckForUpdate(res => {
            // 请求完新版本信息的回调
            console.log("hasUpdate", res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            showModal(
                '新版本已经准备好，是否重启应用？',
                '更新提示',
                (res) => {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            )
        })

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        })
    },

    // 定义调用云函数获取openid
    getOpenid() {
        let openid = wx.getStorageSync("openid")
        if (!isEmpty(openid)) {
            return openid
        }
        return new Promise(resolve => {
            wx.cloud.callFunction({
                name: 'get',
                complete: res => {
                    var openid = res.result.openid
                    resolve(openid)
                    console.log("openid", openid)
                    wx.setStorageSync("openid", openid)
                }
            })
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
        let that = this
        let requestUrl = host.BASE_URL + url;
        // let requestUrl = host.BASE_URL_DEV + url;
        console.log("url", requestUrl)
        console.log("body", JSON.stringify(data))
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
                    console.log("result", result)
                    let res = result.data || {};
                    let code = res.respCode;
                    let errMsg = res.respMsg;

                    if (code != '0000') {
                        if (code == '0004') {
                            showModal(
                                '登录失效，是否重新登录？',
                                '温馨提示',
                                (res) => {
                                    if (res.confirm) {
                                        // 重新登录
                                        that.reLogin()
                                    }
                                }
                            )
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
                fail: res => {
                    reject(res);
                    console.log("fail", res)
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
    reLogin() {
        wx.setStorageSync('token', null)
        if (wx.getStorageSync('environment')) {//企业微信环境
            wx.redirectTo({
                url: '/pages/splash/splash',
            })
        } else {
            //非企业微信环境
            this.openidLogin()
        }

        return
    },

    async openidLogin() {
        let openid = wx.getStorageSync("openid")
        if (isEmpty(openid)) {
            openid = await this.getOpenid()
        }
        let usertype = wx.getStorageSync('usertype')
        if (isEmpty(usertype)) {
            wx.redirectTo({
                url: '/packageA/pages/switch_role/switch_role',
            })
            return
        }
        let url = "/api/v17/user/login/Wxloginin"
        if (wx.getStorageSync('usertype') === "1") {
            if (wx.getStorageSync('logintype') === "self") {
                url = "/api/v17/user/login/sWxloginin"
            } else {
                url = "/api/v17/user/login/pWxloginin"
            }
        } else {
            url = "/api/v17/user/login/eWxloginin"
        }
        let data = {
            openid: openid
        }
        this.httpPost(url, data).then((res) => {
            console.log("loginres", res)
            this.saveUserInfo(res.respResult)
            let url;
            if (wx.getStorageSync('usertype') === "1") {
                url = "/api/v17/user/student/apps"
            } else {
                url = "/api/v17/user/teachers/apps"
            }
            let data = {
                token: wx.getStorageSync('token')
            };
            this.httpPost(url, data, false).then((res) => {
                this.saveAppInfo(res.respResult)
                wx.switchTab({
                    url: '/pages/circular/circular',
                })
                wx.showToast({
                    title: "登陆成功",
                    icon: 'none'
                });
            });

        }, (res) => {
            if (wx.getStorageSync('usertype') === "1") {
                if (wx.getStorageSync('logintype') === "self") {
                    wx.redirectTo({
                        url: '/packageA/pages/login_s/login_s',
                    })
                } else {
                    wx.redirectTo({
                        url: '/packageA/pages/login_t/login_t?id=3',
                    })
                }
            } else {
                wx.redirectTo({
                    url: '/packageA/pages/login_t/login_t?id=2',
                })
            }
        });

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
                fail: res => {
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

    httpGet0: function (url, data, loading, loadingMsg) {
        return this.httpBase0('GET', url, data, loading, loadingMsg);
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

    soundCommon(){
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = 'packageA/assets/sound/yes2.mp3'
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    soundErr(){
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = 'packageA/assets/sound/err1.mp3'
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },

    textToSpeech(content) {
        pluginSpeech.textToSpeech({
            lang: "zh_CN",
            tts: true,
            content: content,
            success: (res) =>{
                this.speech(res.filename)
            },
            fail:  (res)=> {
                console.log("fail tts", res)
            }
        })
    },
    speech(url) {
        const audio = wx.createInnerAudioContext()
        audio.autoplay = true
        audio.src = url
        audio.volume = 1
        audio.onPlay(() => {
            console.log('开始播放')
        })
    },

    nfcRead(func) {

        let nfcBody = {nfc: null, handler: null}

        const nfc = wx.getNFCAdapter()

        nfcBody.nfc = nfc

        let _this = this


        function discoverHandler(res) {

            console.log('discoverHandler', res)

            const data = new Uint8Array(res.id)

            let str = ""
            let aa = [4]
            data.forEach((e, index) => {

                let item = e.toString(16)

                if (item.length == 1) {

                    item = '0' + item

                }

                item = item.toUpperCase()
                aa[3 - index] = item
                console.log(item)

                str += item

            })
            let id = ""
            aa.forEach(it => {
                id += it
            })
            id = parseInt(id, 16) + ""
            let len = id.length;

            if (len < 10) {
                for (let i = 0; i < (10 - len); i++) {
                    id = "0" + id;
                }
            }

            // wx.showToast({
            //
            //     title: '读取成功！',
            //
            //     icon: 'none'
            //
            // })
            _this.soundCommon()
            func(id)

        }

        nfcBody.handler = discoverHandler

        nfc.startDiscovery({

            success(res) {

                console.log(res)

                // wx.showToast({
                //
                //     title: 'NFC读取功能已开启！',
                //
                //     icon: 'none'
                //
                // })

                nfc.onDiscovered(discoverHandler)

            },

            fail(err) {

                console.log('failed to discover:', err)

                if (!err.errCode) {

                    // wx.showToast({
                    //
                    //     title: '请检查NFC功能是否正常!',
                    //
                    //     icon: 'none'
                    //
                    // })

                    return

                }

                switch (err.errCode) {

                    case 13000:

                        wx.showToast({

                            title: '设备不支持NFC!',

                            icon: 'none'

                        })

                        break;

                    case 13001:

                        wx.showToast({

                            title: '系统NFC开关未打开!',

                            icon: 'none'

                        })

                        break;

                    case 13019:

                        wx.showToast({

                            title: '用户未授权!',

                            icon: 'none'

                        })

                        break;

                    case 13010:

                        wx.showToast({

                            title: '未知错误!',

                            icon: 'none'

                        })

                        break;

                }

            }

        })
        return nfcBody
    },

    logout() {
        wx.setStorageSync('token', null)
    },

    saveUserInfo: function (data) {
        console.log("info", data)
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
        // wx.setStorageSync('openid', data.openid)
        wx.setStorageSync('wxname', data.wxname)
        wx.setStorageSync('remark', data.remark)
        wx.setStorageSync('isactive', data.isactive)
        wx.setStorageSync('device_no', data.device_no)
        wx.setStorageSync('parentphone', data.parentphone)
        wx.setStorageSync('parentuid', data.parentuid)
        wx.setStorageSync('parentname', data.parentname)
        wx.setStorageSync('classmaster', data.classmaster)//班主任
        wx.setStorageSync('levelmaster', data.levelmaster)//年级组长
        wx.setStorageSync('level', data.level)//年级ID
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
        teaTitle: "教师档案",
        cardTitle: "考勤管理",

        deleteSure: "确定删除？",
    }
})
