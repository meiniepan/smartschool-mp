// components/calendar/calendar.js
Component({
    // 外部数据
    properties: {
        //默认日期 格式：20200101
        defaultValue: {
            type: String,
            value: '',
        },
        // 特殊数组
        specialDays: {
            type: Array,
            // 格式：20200101
            value: [],
        },
        // 周几开始
        weekStart: {
            type: String,
            value: '0',
        },
        // 星期数组
        weeks: {
            type: Array,
            value: ['日', '一', '二', '三', '四', '五', '六'],
        },

        // 最多显示天数(不够的话下个月补)
        maxDay: {
            type: String,
            value: '',
        },
    },

    observers: {
        'specialDays': function () {
            this.checkEvent()
        },
    },

    // 组件的初始数据
    data: {
        // 上个月
        lastDays: [],
        // 这个月
        thisDays: [],
        // 下个月
        nextDays: [],

        // 选中
        select: '',
        // 标题
        title: '',

        // 临时记录年月日
        year: 0,
        month: 0,
        date: 0,
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    ready: function () {
        //初始化一下今天
        this.init()
    },

    methods: {
        //初始化
        display: function (year, month, date) {
            this.setData({
                year,
                month,
                date,
                title: year + '年' + this.zero(month) + '月',
            })
            this.createDays(year, month)
            this.createEmptyDays(year, month)
        },

        //初始化组件
        init: function () {
            var defaultValue = this.data.defaultValue,
                year,
                month,
                date,
                select, today
            if (defaultValue.length == 8) {
                year = defaultValue.substring(0, 4)
                month = parseInt(defaultValue.substring(4, 6))
                date = parseInt(defaultValue.substring(6, 8))
            }

            let temp = year ? new Date(year, month - 1, date) : new Date()

            year = temp.getFullYear()
            month = temp.getMonth() + 1
            date = temp.getDate()
            today = year.toString() + this.zero(month) + this.zero(date)
            select = today
            this.setData({
                year,
                month,
                date,
                select,
                today,
            })

            //初始化日历组件UI
            this.display(year, month, date)

        },

        // 选择 并格式化数据
        select: function (e) {
            let day = e.currentTarget.dataset.index
            let select =
                this.data.year.toString() +
                day.monthFormat +
                day.dateFormat
            let select2 =
                this.data.year + '/' +
                day.monthFormat + '/' +
                day.dateFormat

            this.setData({
                select,
                month: day.monthFormat,
                date: day.dateFormat,
            })
            //发送事件监听
            this.triggerEvent('select', select2)
        },

        //上个月
        lastMonth: function () {
            let month = this.data.month === 1 ? 12 : parseInt(this.data.month) - 1
            let year = this.data.month === 1 ? this.data.year - 1 : this.data.year
            //初始化日历组件UI
            this.display(year, month, 0)
            this.triggerEvent('lastMonth', year.toString() + this.zero(month))
        },

        //下个月
        nextMonth: function () {
            let month = this.data.month === 12 ? 1 : parseInt(this.data.month) + 1
            let year = this.data.month === 12 ? this.data.year + 1 : this.data.year
            //初始化日历组件UI
            this.display(year, month, 0)
            this.triggerEvent('nextMonth', year.toString() + this.zero(month))
        },

        //获取指定月天数
        getThisDays: function (year, month) {
            return new Date(year, month, 0).getDate()
        },

        // 绘制当月天数占的格子
        createDays: function (year, month) {
            let thisDays = []
            let days = this.getThisDays(year, month)

            // 判断特殊
            for (let i = 1; i <= days; i++) {
                let color = "white",
                    monthFormat = this.zero(month),
                    dateFormat = this.zero(i)
                //是否特殊

                if (this.data.today === year.toString() + monthFormat + dateFormat) {
                    color = "#FBB347";
                }
                thisDays.push({
                    date: i,
                    color,
                    dateFormat: dateFormat,
                    monthFormat: monthFormat,
                    week: this.data.weeks[
                        new Date(Date.UTC(year, month - 1, i)).getDay()
                        ],
                })
            }
            this.setData({
                thisDays,
            })
        },

        checkEvent() {
            let thisDays = this.data.thisDays

            thisDays.forEach(it => {
                let year = this.data.year,
                    monthFormat = it.monthFormat,
                    dateFormat = it.dateFormat
                it.isSpecial = false
                this.data.specialDays.map((item) => {
                    // 20200101
                    if (item === `${year}${monthFormat}${dateFormat}`) {
                        it.isSpecial = true
                    }
                })
            })
            this.setData({
                thisDays
            })
        },

        //获取当月空出的天数
        createEmptyDays: function (year, month) {
            // 获取本月一号为周几
            let week = new Date(Date.UTC(year, month - 1, 1)).getDay()
            let lastDays = []
            let nextDays = []

            // 计算差几天
            var temp = week - parseInt(this.data.weekStart)
            temp = temp == 0 ? 0 : temp

            //上月天数
            var lastDay =
                month - 1 < 0
                    ? this.getThisDays(year - 1, 12)
                    : this.getThisDays(year, month - 1)

            //最大天数
            let maxDay = parseInt(this.data.maxDay)

            //空出日期
            for (let i = 0; i < temp; i++) {
                var item = lastDay - (temp - i - 1)
                if (!maxDay) {
                    item = ''
                }
                // 取出上个月后几天
                lastDays.push(item)
            }

            //下个月天数
            var current = this.data.thisDays.length + lastDays.length
            var next = 0

            // 计算差几天
            if (maxDay <= current) {
                // 补几天
                next = 7 - (current % 7)
            } else {
                // 补满(保护一下)
                next = maxDay - current > 0 ? maxDay - current : 0
            }

            for (let i = 1; i <= next; i++) {
                // 取出下个月前几天
                nextDays.push(i)
            }
            this.setData({
                lastDays,
                nextDays,
            })
        },

        //补全0
        zero: function (i) {
            return i >= 10 ? i : '0' + i
        },
    },
})
