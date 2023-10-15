import { cached } from "../public/public.js";
import { list } from "./opData.js";

/**
 * @param {string} str
 * @returns {number} 返回utf8编码字符串的字节数
 */
export function byteLength(str) {
	let s = str.length
	for (var i = str.length - 1; i >= 0; i--) {
		const code = str.charCodeAt(i)
		if (code > 0x7f && code <= 0x7ff) s++
		else if (code > 0x7ff && code <= 0xffff) s += 2
		if (code >= 0xDC00 && code <= 0xDFFF) i--
	}
	return s
}

// 首字母大写
export function titleCase(str) {
	return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * 串式转驼峰写法（缓存计算）
 */
export const camelize = cached(str => str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : "")));

// 下划转驼峰
export function camelCase(str) {
	return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

/**
 * 获取后缀
 * @param {string} str 字符串
 * @param {string} split 后缀之前的分隔符，默认为"."
 * @returns {string}
 */
export function pathToName(str, split = ".") {
	return str.split(new RegExp(`[${split}](?=[^${split}]+$)`))[1] || str
}

/**
 * 字符串分段处理
 * @param {String} code 处理字符串
 * @param {Array|Number} options 分段数组|断点
 * @param {Array<Function|Boolean>|Function} maps 分段映射函数
 * Function 用options函数依次处理分割出的每个字符串
 * Array<Function|Boolean> 数组按照索引处理分割出的对应字符串
 *  [Function] 				相应索引处为函数则用函数进行转化
 *  [true] 						相应索引处为true则只切割
 *  [false|undefined]	相应索引处为false|undefined时, all为true则切割否则舍弃字符串
 * @param {Boolean} all 是否完全映射
 * @returns {Array} 映射结果
 */
export function tsCode(code, options, maps, all) {
	let start = 0, res = [];
	if (!Array.isArray(options)) {
		options = [options, Infinity];
	}
	if (maps) {
		if (typeof maps === 'function') {
			options.forEach((part, index) => {
				res.push(maps(code.slice(start, part + start)));
				start += part;
			});
		} else {
			options.forEach((part, index) => {
				if (typeof maps[index] === 'function') {
					res.push(maps[index](code.slice(start, part + start)));
				} else if (maps[index] !== undefined) {
					if (maps[index] === true) res.push(code.slice(start, part + start));
					else res.push(maps[index]);
				} else if (all) res.push(code.slice(start, part + start));
				start += part;
			});
		};
		return res
	} else {
		options.forEach(part => {
			res.push(code.slice(start, part + start));
			start += part;
		});
		return res
	}
}

/**
 * @param {String} str 原始字符串
 * @param {String} placeholder 占位符
 * @param {String|RegExp} split 分割规则
 * @returns {Array} 将字符串按分割规则分割替换成占位符生成包含模板字符串和待插入数组的数组,是format的反向操作
 */
export function unFormat(str, placeholder = '{{}}', split = /(\\.)/) {
	const [odd, even] = list.split(str.split(split));
	return [odd.join(placeholder), even]
}

/**
 * 字符串格式化
 * @param {String} str 模板字符串
 * @param {Array} ins 将插入模板的数据
 * @param {String|RegExp} split 分割字符
 */
export function format(str, ins, split = '{{}}') {
	return list.interlock(str.split(split), ins)
}

/**
 * @param {string} str 目标字符串
 * @param {RegExp|string} reg 切分正则
 * @param {number} num 二级数组长度
 * @param {Function} call 对数组每项子数组的首项进行处理
 * @param {Function} end 对数组首项子数组进行处理
 * @returns {Array} 正则切分字符串,切成固定长度的多个二级数组
 */
export function split(str, reg, num, call, end) {
	if (call) {
		let res = [], index = -1;
		str.split(reg).forEach((val, key) => {
			if (!(key % num) && res.length) {
				call(res, ++index);
				res = [];
			}
			res.push(val);
		});
		if (end) end(res[0], index + 1);
	} else {
		const res = [];
		for (let i = 0; i < num; i++) {
			res[i] = []
		};
		str.split(reg).forEach((val, key) => {
			res[key % num].push(val)
		});
		return res
	}
}