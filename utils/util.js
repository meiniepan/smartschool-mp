const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formateDate = (date) => {
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
    if (typeof (string) == 'undefined' || string == null || string == '') {
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
    let today = year + zero(month) + zero(date);
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

    }else {
        result = date
    }
    return result
}

function getFileImage(path) {
    let type = ""
    path = path.toLocaleLowerCase()
    if (isImage(path)) {
        type = "/assets/images/ic_type_image.png"
    } else if (isVideo(path)) {
        type = "/assets/images/ic_type_video.png"
    } else if (path.endsWith(".doc") || path.endsWith(".docx")) {
        type = "/assets/images/ic_type_word.png"
    } else if (path.endsWith(".xls") || path.endsWith(".xlsx")) {
        type = "/assets/images/ic_type_excel.png"
    } else if (path.endsWith(".pdf")) {
        type = "/assets/images/ic_type_pdf.png"
    } else if (path.endsWith(".zip") || path.endsWith(".rar") || path.endsWith(".tar") || path.endsWith(
        ".gz"
    )
    ) {
        type = "/assets/images/ic_type_zip.png"
    } else {
        type = "/assets/images/ic_type_unknow.png"
    }
    return type
}

function isVideo(path) {
    let type = false
    path = path.toLocaleLowerCase()
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
    path = path.toLocaleLowerCase()
    if (path.endsWith(".jpg") || path.endsWith(".png")
        || path.endsWith(".jpeg")
        || path.endsWith(".gif")
        || path.endsWith(".bmp")) {
        type = true
    }


    return type
}

module.exports = {
    formatTime: formatTime,
    formateDate: formateDate,
    isEmpty: isEmpty,
    isLogin: isLogin,
    clearLoginInfo: clearLoginInfo,
    showToastWithoutIcon: showToastWithoutIcon,
    isEmptyObj: isEmptyObj,
    zero: zero,
    getDayInWeek: getDayInWeek,
    getTodayMD: getTodayMD,
    getToday: getToday,
    getTodayStr: getTodayStr,
    getFileImage: getFileImage,
    formatShowTime: formatShowTime,
    isVideo: isVideo,
    isImage: isImage,
}