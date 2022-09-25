/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    }
    return time + label + 's';
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    } else {
        return pluralize(~~(between / 86400), ' day');
    }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' },
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
        }
    }
    return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

/**
 * 10000 => "10,000.00"
 * @param {number} num
 */
export function toThousandDecimalFilter(num, keep = 2) {
    num = isNaN(num) ? 0 : num;
    return num.toFixed(keep).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}


/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// 将秒格式化成分秒显示
export function secToMin(second) {
    function format(value) {
        return value > 9 ? value : `0${value}`;
    }

    const min = format(Math.floor(second / 60));
    const sec = format(second % 60);
    return `${min}:${sec}`;
}


/**
 * http补全
 * @param {String} url
 */
export function editUrl(url) {
    return url && String(url).includes('http') ? url : `http://${url}`;
}


// 格式化显示数据 保留两位小数
export function formatNumber(value, keep = 2) {
    if (typeof value == 'undefined' || value == null || isNaN(value)) {
        return value;
    }
    return parseFloat(value).toFixed(keep);
}


export function numberFormatterToCN(num, digits) {
    const si = [
        { value: 1E8, symbol: '亿' },
        { value: 1E4, symbol: '万' },
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
        }
    }
    return num.toString();
}


// 格式化成百分比
export function toPercent(value, keep = 2) {
    if (typeof value == 'undefined' || value == null || isNaN(value)) { return value; }
    return (parseFloat(value) * 100).toFixed(keep) + '%';
}