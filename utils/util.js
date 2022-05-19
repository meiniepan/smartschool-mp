const {themeColor} = require("./host");
let oldTime = 0

function clickBlock() {
    let newTime = Date.parse(new Date())
    if (newTime - oldTime < 3000) {
        oldTime = newTime
        return true;
    } else {
        oldTime = newTime
        return false
    }
}

const formatTime = (date=new Date())  => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeHM = (date=new Date())  => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatDate = (date=new Date()) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function isEmpty(string) {
    if (typeof (string) == 'undefined' || string == null || string === '') {
        return true;
    } else {
        return false;
    }
}

function isLogin() {
    let cookie = wx.getStorageSync('cookie');
    let account = wx.getStorageSync('account');
    let password = wx.getStorageSync('password');

    if (!isEmpty(cookie) && !isEmpty(account) && !isEmpty(password)) {
        return true;
    } else {
        return false;
    }
}

function clearLoginInfo() {
    wx.removeStorageSync('cookie');
    wx.removeStorageSync('account');
    wx.removeStorageSync('password');
}

function showToastWithoutIcon(content) {
    wx.showToast({
        title: content,
        icon: 'none'
    });
}

function showModal(content, title = '温馨提示', suc = () => {
}) {
    wx.showModal({
        title: title,
        content: content,
        success(res) {
            suc(res)
        },
        confirmColor: themeColor,
    })
}

function getRpx(){
    var winWidth = wx.getSystemInfoSync().windowWidth;
    return 750/winWidth;
}

function isEmptyObj(obj) {
    if (Object.keys(obj).length > 0) {
        return false;
    } else {
        return true;
    }
}

//补全0
function zero(i) {
    return i >= 10 ? i : '0' + i
}

//今天周几   日0一1
function getDayInWeek() {
    let temp = new Date()
    return temp.getDay()
}

function getTodayMD() {
    let temp = new Date();
    let year = temp.getFullYear(),
        month = temp.getMonth() + 1,
        date = temp.getDate();
    let today = zero(month) + "月" + zero(date) + "日";
    return today
}

function getTodayStr() {
    let temp = new Date();
    let year = temp.getFullYear(),
        month = temp.getMonth() + 1,
        date = temp.getDate();
    let today = year.toString()+"-" + zero(month)+"-" + zero(date);
    return today
}

function getToday() {
    let value = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let temp = new Date();
    let year = temp.getFullYear(),
        month = temp.getMonth() + 1,
        date = temp.getDate();
    let today = "今天是" + year + "年" + zero(month) + "月" + zero(date) + "日 " + value[temp.getDay()];
    return today
}

function toIntSafe(s) {
    try {
        let result = parseInt(s)
        if (isNaN(result)) {
            result = 0
        }
        return result
    } catch (e) {
        return 0
    }
}

function isSameDay(date) {
    if (date.length >= 10) {
        let temp = new Date();
        let year = temp.getFullYear(),
            month = temp.getMonth() + 1,
            day = temp.getDate();
        return year == date.substring(0, 4) &&
            month == date.substring(5, 7) &&
            day == date.substring(8, 10);
    }
}

function formatStarPhoneNum(num) {
    if (num.length > 10) {

        let s = num.substring(0, 3),
            e = num.substring(7, 11);
        return s + "****" + e
    }
}

function isSameYear(date) {
    if (date.length >= 10) {
        let temp = new Date();
        let year = temp.getFullYear()
        return year == date.substring(0, 4)
    }
}

function formatShowTime(date) {
    let result = "";
    if (date.length > 10) {
        if (isSameDay(date)) {
            result = date.substring(
                11,
                date.length
            )
        } else if (isSameYear(date)) {
            result = date.substring(
                5,
                date.length
            )
        } else {
            result = date.substring(
                2,
                date.length
            )
        }

    } else {
        result = date
    }
    return result
}

function getFileImage(path) {
    let type = ""
    path = path.toLowerCase()
    if (isImage(path)) {
        type = "/packageA/assets/images/ic_type_image.png"
    } else if (isVideo(path)) {
        type = "/packageA/assets/images/ic_type_video.png"
    } else if (path.endsWith(".doc") || path.endsWith(".docx")) {
        type = "/packageA/assets/images/ic_type_word.png"
    } else if (path.endsWith(".xls") || path.endsWith(".xlsx")) {
        type = "/packageA/assets/images/ic_type_excel.png"
    } else if (path.endsWith(".ppt") || path.endsWith(".pptx")) {
        type = "/packageA/assets/images/ic_type_ppt.png"
    } else if (path.endsWith(".pdf")) {
        type = "/packageA/assets/images/ic_type_pdf.png"
    } else if (path.endsWith(".zip") || path.endsWith(".rar") || path.endsWith(".tar") || path.endsWith(
        ".gz"
    )
    ) {
        type = "/packageA/assets/images/ic_type_zip.png"
    } else {
        type = "/packageA/assets/images/ic_type_unknow.png"
    }
    return type
}

function isVideo(path) {
    let type = false
    path = path.toLowerCase()
    wx.getSystemInfo({
        success: (result) => {
            if (result.system.indexOf('iOS') != -1) {
                if (path.endsWith(".mp4") || path.endsWith(".mov")
                    || path.endsWith(".m4v")
                    || path.endsWith(".3gp")
                    || path.endsWith(".avi")
                    || path.endsWith(".m3u8")) {
                    type = true
                }

            } else {
                if (path.endsWith(".mp4")
                    || path.endsWith(".3gp")
                    || path.endsWith(".m3u8")
                    || path.endsWith(".webm")) {
                    type = true
                }
            }
        },
    })
    return type
}

function isImage(path) {
    let type = false
    path = path.toLowerCase()
    if (path.endsWith(".jpg") || path.endsWith(".png")
        || path.endsWith(".jpeg")
        || path.endsWith(".gif")
        || path.endsWith(".heic")//ios图片格式
        || path.endsWith(".bmp")) {
        type = true
    }


    return type
}

module.exports = {
    formatTime: formatTime,
    formatTimeHM: formatTimeHM,
    formatDate: formatDate,
    isEmpty: isEmpty,
    isLogin: isLogin,
    clearLoginInfo: clearLoginInfo,
    showToastWithoutIcon: showToastWithoutIcon,
    showModal: showModal,
    isEmptyObj: isEmptyObj,
    zero: zero,
    getDayInWeek: getDayInWeek,
    getTodayMD: getTodayMD,
    getToday: getToday,
    toIntSafe: toIntSafe,
    getTodayStr: getTodayStr,
    getFileImage: getFileImage,
    formatShowTime: formatShowTime,
    isVideo: isVideo,
    isImage: isImage,
    clickBlock: clickBlock,
    formatStarPhoneNum: formatStarPhoneNum,
    formatNumber: formatNumber,
    getRpx: getRpx,
}