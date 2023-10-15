import {
    forStep
} from "./opData.js";
export function mul(...args) {
    return forStep(args, (it, _, res) => {
        if (!it) throw 0;
        const item = `${it}.`.split(".");
        res.res *= item[0] + item[1];
        res.len += item[1].length
    }, { res: 1, len: 0 }, true, (res, args) => {
        if (!res) return 0;
        return res.res / Math.pow(10, res.len)
    });
}

export function div(...args) {
    return forStep(args, (it, _, res) => {
        if (!it) {
            if (!res.res) {
                throw res.res = NaN
            } else {
                return res.res = (res.sign *= Object.is(it, -0) ? -1 : 1) * 0 //+0与-0并不相同
            }
        } else if (!res.res) {
            return res.res = (res.sign *= Object.is(res.res, -0) ? -1 : 1) * Infinity
        } else if (it === Infinity) {
            if (res.res === Infinity || res.res === -Infinity) {
                throw res.res = NaN
            } else {
                return res.res = res.sign * 0
            };
        } else if (it === -Infinity) {
            if (res.res === Infinity || res.res === -Infinity) {
                throw res.res = NaN
            } else {
                res.sign *= -1;
                return res.res = res.sign * 0;
            };
        };
        const item = `${it}.`.split(".");
        res.res /= item[0] + item[1];
        res.len -= item[1].length;
        res.sign *= Math.sign(it);
    }, {}, true, {
        start(it, _, res) {
            if (!it) {
                res.res = it;
                res.sign = Object.is(it, -0) ? -1 : 1;
                return
            } else if (it === Infinity) {
                res.res = it;
                res.sign = Math.sign(it);
                return
            } else if (it === -Infinity) {
                res.res = it;
                res.sign = Math.sign(it);
                return
            };
            const item = `${it}.`.split(".");
            res.res = item[0] + item[1];
            res.len = item[1].length;
            res.sign = Math.sign(it);
        },
        last(res) {
            if (!res) return res;
            return res.res / Math.pow(10, res.len)
        }
    });
}

//加法函数，用来得到精确的加法结果   
export function add(...args) {
    let l = 0;
    return forStep(
        forStep(args, (it, _, res) => {
            if (it) {
                const its = `${it}.`.split("."), len = its[1].length;
                res.push(its);
                if (len > l) l = len;
            }
        }, [], true),
        (it, _, res) => {
            it[1] = it[1].padEnd(l, 0);
            return res - -(it[0] + it[1]);
        },
        0
    ) / Math.pow(10, l)
}

//减法函数，用来得到精确的减法结果   
export function sub(...args) {
    let l = 0;
    return forStep(
        forStep(args, (it, _, res) => {
            if (it) {
                const its = `${it}.`.split("."), len = its[1].length;
                res.push(its);
                if (len > l) l = len;
            }
        }, [], true),
        (it, _, res) => {
            it[1] = it[1].padEnd(l, 0);
            return res - (it[0] + it[1]);
        },
        0
    ) / Math.pow(10, l)
}

/**
 * @param {Array} list 被统计表
 * @param {string|Object} key 统计字段或正负字段对象
 * @returns {Number}
 * 用例 total(this.mergeList, {"+": "fukuan","-": "xiaofei",});
 */
export function total(list = [], key) {
    if (typeof key === 'string') return list.reduce((pv, cv) => add(pv, cv[key]), 0);
    return add(...list.reduce((pv, cv) => {
        forStep(key, (it, index) => {
            pv.push(index === '-' ? -cv[it] : cv[it])
        });
        return pv
    }, []))
}

//非数字转空字串
export function NaNToEmpty(value) {
    return isNaN(value) ? '' : value
}

/**
 * 
 * @param {number} amount 阿拉伯数字
 * @returns 中文数字
 */
export function toChineseNum(amount) {
    // 转换为字符串
    amount = amount.toString();
    if (!amount) {
        return ''
    } else if (amount >= 9999999999999999.99) {// 最大处理的数字
        return "无穷大";
    } else if (amount === '0') {
        return '零元整'
    }
    const parts = amount.split("."),//分离金额后用的数组，预定义
        cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"],// 汉字的数字
        cnIntRadice = ["", "拾", "佰", "仟"],// 基本单位
        cnIntUnits = ["", "万", "亿", "兆"],// 对应整数部分扩展单位
        cnDecUnits = ["角", "分", "厘", "毫"],// 对应小数部分单位
        cnIntLast = "元";// 整型完以后的单位
    let integerNum = parts[0],// 金额整数部分
        decimalNum = parts[1] ? parts[1].substring(0, 4) : '',// 金额小数部分
        chineseStr = "";// 输出的中文金额字符串

    // 获取整型部分转换
    if (+integerNum > 0) {
        let zeroCount = 0;
        const IntLen = integerNum.length;
        for (let i = 0; i < IntLen; i++) {
            const n = integerNum[i],
                p = IntLen - i - 1,
                q = p / 4,
                m = p % 4;
            if (n === "0") {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                // 归零
                zeroCount = 0;
                chineseStr += cnNums[n] + cnIntRadice[m];
            }
            if (m === 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    // 小数部分
    if (+decimalNum > 0) {
        const decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
            const n = decimalNum[i];
            if (n !== "0") {
                chineseStr += cnNums[n] + cnDecUnits[i];
            }
        }
    }
    return chineseStr;
}

/**
 * @param {Number} end 结束值
 * @param {Number} start 开始值
 * @param {Function} callback 回调
 * @param {Boolean} reverse 是否从大到小
 * @returns {Array} 生成数字序列数组
 */
export function range(end, start = 1, callback, reverse) {
    if (start > end) {
        reverse = true;
        const tepm = end;
        end = start;
        start = tepm;
    }
    if (reverse === true) {
        const arr = [];
        if (callback) {
            for (let i = end; i >= start; i--) {
                arr.push(callback(i));
            };
        } else {
            for (let i = end; i >= start; i--) {
                arr.push(i);
            };
        }
        return arr;
    } else {
        const arr = [];
        if (callback) {
            for (let i = start; i <= end; i++) {
                arr.push(callback(i));
            };
        } else {
            for (let i = start; i <= end; i++) {
                arr.push(i);
            };
        }
        return arr;
    }
}

/**
* 生成重复数值
* @param {*} num 重复次数
* @param {*} call 回调处理函数,依次传入0~num生成不同值
* @param {*} concat 是否展开回调处理函数返回结果
* @returns {Array} 填充好的数组
* call				concat
* [function!boolean]	false 		将num深入一层拷贝再填充
* [function!boolean]	true		将num完全深度拷贝再填充
* true				true		填充1~num
* true				false		填充num~1
* false				true		填充0~num-1
* false				false		填充num-1~0
* function 			false		以0~num-1依次调用call的返回值作为填充值
* function 			true		以0~num-1依次调用call的返回值展开做填充
* Any					undefined	将call原样填充
*/
export function repeat(num, call, concat) {
    const type = typeof call;
    const repeatArr = [];
    if (concat === undefined) {
        for (let key = 0; key < num; key++) {
            repeatArr.push(call)
        }
        return repeatArr;
    } else switch (type) {
        case 'function':
            for (let key = 0; key < num; key++) {
                concat ? repeatArr.push(...call(key)) : repeatArr.push(call(key))
            }
        case 'boolean':
            if (call) {
                if (concat) {
                    for (let key = 0; key < num; key++) {
                        repeatArr.push(key + 1)
                    }
                } else {
                    for (let key = 0; key < num; key++) {
                        repeatArr.push(num - key)
                    }
                }
            } else {
                if (concat) {
                    for (let key = 0; key < num; key++) {
                        repeatArr.push(key)
                    }
                } else {
                    for (let key = 0; key < num; key++) {
                        repeatArr.push(num - key - 1)
                    }
                }
            }
            return repeatArr;
        default:
            if (concat) {
                for (let key = 0; key < num; key++) {
                    repeatArr.push(JSON.parse(JSON.stringify(call)))
                }
            } else {
                for (let key = 0; key < num; key++) {
                    repeatArr.push(Array.isArray(call) ? [...call] : { ...call })
                }
            }
            return repeatArr;
    }
}