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
}