const validLowerCase_reg = /^[a-z]+$/;
const validUpperCase_reg = /^[A-Z]+$/;
const validAlphabets_reg = /^[A-Za-z]+$/;
const http_reg = /^https?:/;
const external_reg = /^(https?:|mailto:|tel:)/;
const validEmail_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validURL_reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/

const validRegScopeEscape_reg = /[\\\[\]^-]/;

const validRegEscape_reg = /[$^?*+|(){}\[\]\\]/g;

/**
 * @param {string} mapStr 以逗号分隔的map字符串
 * @param {boolean} expectsLowerCase 是否大写
 * @returns {function} 返回判断是否val是否在str中的函数
 */
export function makeMap(mapStr, expectsLowerCase) {
	const map = Object.create(null)
	mapStr.split(',').forEach(it => map[it] = true);
	return expectsLowerCase ?
		val => map[val.toLowerCase()] :
		val => map[val]
}

/**
 * 类型判断
 * @param {*} value 变量值
 * @param {(string|Function)[]} typeStrs 类型文本或构造函数
 * @returns {boolean} 是否为相应文本对应的类型
 */
export function isType(value, ...typeStrs) {
	return typeStrs.some(typeStr => getType(value) === typeStr || value instanceof typeStr)
}

/**
 * 获取类型
 * @param {*} value 变量值
 * @returns {string} 类型文本
 */
export function getType(value) {
	return Object.prototype.toString.call(value).split(/ |\]/)[1]
}

/**
 * @param {{attrName:string}} ele 
 * @param {[{attrName:string}]} targetArr 
 * @param {string} attrName 
 * @returns {boolean} 对象是否属于数组，以共有字段为判断条件
 */
export function oneOfAttr(ele, targetArr, attrName) {
	return targetArr.some(item => item[attrName] == ele[attrName])
};

//子集判断
export function inOf(arr, targetArr) {
	return arr.every(it => it in targetArr)
};

//元素是否属于数组
export function oneOf(ele, targetArr) {
	return ele in targetArr
};

/**
 * @param {*} arr 
 * @param {Array} targetArr
 * @returns {boolean} 数组是否包含元素或另一个数组所有元素
 */
export function has(arr, targetArr) {
	return (Array.isArray(arr) ? inOf : oneOf)(targetArr, arr);
}

/**
 * @param {*} arr
 * @param {*} ele
 * @returns {boolean} 是否在数组中或与之相等
 */
export function hasOrEq(arr, ele) {
	if (Array.isArray(arr)) {
		return oneOf(ele, arr);
	} else {
		return arr === ele;
	}
};

//是否是正则[]里面的功能字符
export function isRegScopeEscape() {
	return validRegScopeEscape_reg.test(filter[ix])
}

/**
 * 转义正则功能字符
 * @param {*} str 
	$$	插入一个 "$"。
	$&	插入匹配的子字符串。
	$`	插入匹配子字符串之前的字符串片段。
	$'	插入匹配子字符串之后的字符串片段。
	$n	插入第 n（索引从 1 开始）个捕获组，其中 n 是小于 100 的正整数。
	$	插入名称为 Name 的命名捕获组。
 */
export function nonRegEscape(str) {
	return str.replace(validRegEscape_reg, '\\$&')
}

/**
 * @param {string} path
 * @returns {Boolean} 是否为http外部链接
 */
export function isHttp(path) {
	return http_reg.test(path)
}

/**
 * @param {string} path
 * @returns {Boolean} 是否为外部链接
 */
export function isExternal(path) {
	return external_reg.test(path)
}

/**
 * @param {string} url
 * @returns {Boolean} 是否为url
 */
export function validURL(url) {
	return validURL_reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean} 是否为全小写
 */
export function validLowerCase(str) {
	return validLowerCase_reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean} 是否为全大写
 */
export function validUpperCase(str) {
	return validUpperCase_reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean} 是否为全字母
 */
export function validAlphabets(str) {
	return validAlphabets_reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean} 是否为email
 */
export function validEmail(email) {
	return validEmail_reg.test(email)
}