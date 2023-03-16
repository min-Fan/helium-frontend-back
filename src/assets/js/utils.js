
let _accounts = {

    // 简化地址 -- 传入 作用域当中的 this 对象获取Vuex
    easyAccount(that, start = 5, endNum = 4, addr = '') {
        if (addr != '') {
            let account = addr
            let str = account.slice(0, start)
            let end = account.substring(account.length-endNum)
            return `${str}...${end}`
        } else {
            let account = that.$store.state.address
            let str = account.slice(0, start)
            let end = account.substring(account.length-endNum)
            return `${str}...${end}`
        }

    },

}

let _date = {

    // 格式化 iso_86 时间
    isoDate(string) {
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
            "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
            "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        if(string)
        {
            var d = string.match(new RegExp(regexp));
            var offset = 0;
            var date = new Date(d[1], 0, 1);

            if (d[3]) {
                date.setMonth(d[3] - 1);
            }
            if (d[5]) {
                date.setDate(d[5]);
            }
            if (d[7]) {
                date.setHours(d[7]);
            }
            if (d[8]) {
                date.setMinutes(d[8]);
            }
            if (d[10]) {
                date.setSeconds(d[10]);
            }
            if (d[12]) {
                date.setMilliseconds(Number("0." + d[12]) * 1000);
            }
            if (d[14]) {
                offset = (Number(d[16]) * 60) + Number(d[17]);
                offset *= ((d[15] == '-') ? 1 : -1);
            }
            offset -= date.getTimezoneOffset();
            var time = (Number(date) + (offset * 60 * 1000));
            return time;
        }
        else
        {
            return null;
        }
    },
    // YYYY-MM-DD HH:mm:ss  timestamp - 毫秒
    getYMDHMS (timestamp) {
        let time = new Date(timestamp)
        let year = time.getFullYear()
        const month = (time.getMonth() + 1).toString().padStart(2, '0')
        const date = (time.getDate()).toString().padStart(2, '0')
        const hours = (time.getHours()).toString().padStart(2, '0')
        const minute = (time.getMinutes()).toString().padStart(2, '0')
        const second = (time.getSeconds()).toString().padStart(2, '0')

        return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
    },

    // YYYY-MM-DD HH:mm:ss  timestamp - 毫秒
    getMDHM (timestamp) {
        let time = new Date(timestamp)
        let year = time.getFullYear()
        const month = (time.getMonth() + 1).toString().padStart(2, '0')
        const date = (time.getDate()).toString().padStart(2, '0')
        const hours = (time.getHours()).toString().padStart(2, '0')
        const minute = (time.getMinutes()).toString().padStart(2, '0')
        const second = (time.getSeconds()).toString().padStart(2, '0')

        return month + '-' + date + ' ' + hours + ':' + minute
    },
    // YYYY-MM-DD HH:mm:ss  timestamp - 毫秒
    getMDHMS (timestamp) {
        let time = new Date(timestamp)
        let year = time.getFullYear()
        const month = (time.getMonth() + 1).toString().padStart(2, '0')
        const date = (time.getDate()).toString().padStart(2, '0')
        const hours = (time.getHours()).toString().padStart(2, '0')
        const minute = (time.getMinutes()).toString().padStart(2, '0')
        const second = (time.getSeconds()).toString().padStart(2, '0')

        return month + '-' + date + ' ' + hours + ':' + minute + ':' + second
    },
    // YYYY-MM-DD HH:mm:ss  timestamp - 毫秒
    getYMD (timestamp) {
        let time = new Date(timestamp)
        let year = time.getFullYear()
        const month = (time.getMonth() + 1).toString()
        const date = (time.getDate()).toString()

        return year + '-' + month + '-' + date
    },
    formatAMPM (date) {
      let time = new Date(date)
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      const month = (time.getMonth() + 1).toString().padStart(2, '0')
      const day = (time.getDate()).toString().padStart(2, '0')
      const second = (time.getSeconds()).toString().padStart(2, '0')
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes.toString().padStart(2, '0');
      let strTime = month + '/' + day + ' ' + hours + ':' + minutes + ':' + second +' ' + ampm;
      return strTime;
    }

}

let _tools = {

    // 复制内容
    copyValue (val) {
        // 删除原有元素
        let body = document.body;
        let oldCopy = document.querySelectorAll('.copyDom')
        oldCopy.forEach(v => {
            body.removeChild(v);//一个一个的删除
        })
        // 添加可编辑元素
        let dom = document.createElement("input");
        dom.type = "text";
        dom.className = "copyDom";
        dom.value = val;
        // 隐藏该元素
        dom.style.opacity = '0'
        dom.style.position = 'relative'
        dom.style.bottom = '0'
        dom.style.left = '0'
        body.appendChild(dom)
        // 获取可编辑元素
        let copy = document.querySelector('.copyDom')
        copy.select()
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            body.removeChild(copy);
        }

        setTimeout(() => {

        }, 1000)
    },

    formatDecimal(num, decimal) {
        num = num.toString()
        let index = num.indexOf('.')
        if (index !== -1) {
          num = num.substring(0, decimal + index + 1)
        } else {
          num = num.substring(0)
        }
        return parseFloat(num).toFixed(decimal)
    },

    // num传入的数字，n需要的字符长度
    prefixInteger(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    },

    // 截取小数点
    interceptFloat(strNumber) {
        if (strNumber == '') {
            return ''
        }
        let reg = /\.+\d*/ig
        let reg2 = /\d*/ig
        if (strNumber.match(reg) == null) {
            return strNumber.match(reg2).join('')
        } else {
            return strNumber.replace(reg, '')
        }
    }

}

export { _accounts, _tools, _date }
