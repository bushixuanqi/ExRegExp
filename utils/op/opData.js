import { getType, isType } from "../public/validate.js";

/**
 * 存在分支函数
 * @param {*} value 判断值
 * @param {*} call 值非undefined时调用
 * @param {*} elseCall 值为undefined时调用
 * @returns 
 */
export function if_else(value, call, elseCall) {
	if (value !== undefined) return call(value);
	else if (elseCall) return elseCall();
}

/**
 * 分步延迟执行机制
 * @param {*} obj 数据
 * @param {Number|Function} step 步数
 * @param {*} res 初始值
 * @return {*} [retRes, lable, last] retRes为true时res不会在循环过程中被返回值覆盖; lable 作为当前forStep的标签, 作为跳出多层forStep的标记; last为结束时调用函数
 * 
 * 当step为函数时:
 * 立即循环执行step函数,并返回其值,可throw 抛出最终结果中途结束循环
 * 返回值有 Symbol.for('for-lable') 键时表示跳出多层到此键值对应的标签处; Symbol.for('for-value') 键可携带一个值到对应标签处
 * 
 * 否则,返回两个函数:
 * op(call) //添加中间处理函数,数量与step相等时,立即执行所有步骤并返回结果
 * end(call?) //立即执行所有步骤并返回结果,可临时添加最后的处理函数
 * 特殊用法:可在传入的函数中手动用 throw 抛出最终结果 直接结束并返回最终结果
 */
export function forStep(obj, step, res, ...agrs) {
	let retRes, lable, start, last;
	if (agrs.length) {
		switch (typeof agrs[0]) {
			case 'object':
				({ start, last } = agrs[0]);
				break;
			case 'function':
				last = agrs[0];
				break;
			case 'string':
				[lable, last] = agrs;
				if (typeof last === 'object') {
					({ start, last } = last);
				}
				break;
			default:
				[retRes, lable, last] = agrs;
				switch (typeof lable) {
					case 'object':
						({ start, last } = lable);
						lable = undefined;
						break;
					case 'function':
						last = lable;
						lable = undefined;
						break;
					default:
						if (typeof last === 'object') {
							({ start, last } = last);
						}
				}
		}
	};
	if (typeof step === 'function') {
		lable: for (const key in obj) {
			const forLable = Symbol.for('for-lable');
			try {
				let innerRes;
				if (start) {
					innerRes = start(obj[key], key, res);
					start = undefined;
				} else {
					innerRes = step(obj[key], key, res);
				};
				if (innerRes && innerRes.hasOwnProperty(forLable)) {
					const forValue = Symbol.for('for-value');
					innerRes = innerRes.hasOwnProperty(forValue) ? innerRes[forValue] : res;
					if (lable === innerRes[forLable]) {
						res = innerRes;
						break lable;
					} else throw last ? last(innerRes, obj) : innerRes
				}
				if (!retRes) {
					res = innerRes
				}
			} catch (innerRes) {
				res = innerRes;
				break;
			}
		};
		return last ? last(res, obj) : res;
	};
	const steps = [];
	function end() {
		lable: for (const key in obj) {
			for (const it of steps) {
				try {
					let innerRes;
					if (start) {
						innerRes = start(obj[key], key, res);
						start = undefined;
					} else {
						innerRes = it(obj[key], key, res);
					};
					const forLable = Symbol.for('for-lable');
					if (innerRes && innerRes.hasOwnProperty(forLable)) {
						const forValue = Symbol.for('for-value');
						innerRes = innerRes.hasOwnProperty(forValue) ? innerRes[forValue] : res;
						if (lable === innerRes[forLable]) {
							res = innerRes;
							break lable;
						} else throw last ? last(innerRes, obj) : innerRes
					}
					if (!retRes) {
						res = innerRes
					}
				} catch (innerRes) {
					res = innerRes;
					break lable;
				}
			};
		};
		return last ? last(res, obj) : res;
	};
	return {
		op(...call) {
			if (call.length) steps.push(...call);
			if (step === steps.length) {
				end();
				return res
			}
		},
		end(...call) {
			if (call.length) steps.push(...call);
			end();
			return res
		}
	}
};

/**
 * 分步延迟执行机制
 * @param {*} obj 数据
 * @param {Number|Function} step 步数
 * @param {*} res 初始值
 * @return {*} [retRes, lable, last] retRes为true时res不会在循环过程中被返回值覆盖; lable 作为当前forStep的标签, 作为跳出多层forStep的标记; last为结束时调用函数
 * 
 * 当step为函数时:
 * 立即循环执行step函数,并返回其值,可throw 抛出最终结果中途结束循环
 * 返回值有 Symbol.for('for-lable') 键时表示跳出多层到此键值对应的标签处; Symbol.for('for-value') 键可携带一个值到对应标签处
 * 
 * 否则,返回两个函数:
 * op(call) //添加中间处理函数,数量与step相等时,立即执行所有步骤并返回结果
 * end(call?) //立即执行所有步骤并返回结果,可临时添加最后的处理函数
 * 特殊用法:可在传入的函数中手动用 throw 抛出最终结果 直接结束并返回最终结果
 */
export function forNum(obj, step, res, ...agrs) {
	let retRes, lable, startNum, endNum, stepNum;
	if (agrs.length) {
		switch (typeof agrs[0]) {
			case 'object':
				({ start, last } = agrs[0]);
			case 'function':
				last = agrs[0];
				break;
			case 'string':
				[lable, last] = agrs;
				if (typeof last === 'object') {
					({ start, last } = last);
				}
				break;
			default:
				[retRes, lable, last] = agrs;
				if (typeof last === 'object') {
					({ start, last } = last);
				}
		}
	};
	if (typeof obj === 'number') {
		startNum = 0;
		endNum = obj;
		stepNum = startNum > endNum ? -1 : 1;
	} else {
		[startNum, endNum, stepNum] = obj;
		if (!stepNum) stepNum = startNum > endNum ? -1 : 1;
	};
	if (typeof step === 'function') {
		if (stepNum > 0) lable: for (; startNum <= endNum; startNum += stepNum) {
			const forLable = Symbol.for('for-lable');
			try {
				let innerRes;
				if (start) {
					innerRes = start(obj[startNum], startNum, res);
					start = undefined;
				} else {
					innerRes = step(obj[startNum], startNum, res);
				};
				if (innerRes && innerRes.hasOwnProperty(forLable)) {
					const forValue = Symbol.for('for-value');
					innerRes = innerRes.hasOwnProperty(forValue) ? innerRes[forValue] : res;
					if (lable === innerRes[forLable]) {
						res = innerRes;
						break lable;
					} else throw last ? last(innerRes, obj) : innerRes
				}
				if (!retRes) {
					res = innerRes
				}
			} catch (innerRes) {
				res = innerRes;
				break;
			}
		} else lable2: for (; startNum >= endNum; startNum += stepNum) {
			const forLable = Symbol.for('for-lable');
			try {
				let innerRes;
				if (start) {
					innerRes = start(obj[startNum], startNum, res);
					start = undefined;
				} else {
					innerRes = step(obj[startNum], startNum, res);
				};
				if (innerRes && innerRes.hasOwnProperty(forLable)) {
					const forValue = Symbol.for('for-value');
					innerRes = innerRes.hasOwnProperty(forValue) ? innerRes[forValue] : res;
					if (lable === innerRes[forLable]) {
						res = innerRes;
						break lable2;
					} else throw last ? last(innerRes, obj) : innerRes
				}
				if (!retRes) {
					res = innerRes
				}
			} catch (innerRes) {
				res = innerRes;
				break;
			}
		};
		return last ? last(res, obj) : res;
	};
	const steps = [];
	function end() {
		if (stepNum > 0) lable1: for (; startNum <= endNum; startNum += stepNum) {
			for (const it of steps) {
				try {
					let innerRes;
					if (start) {
						innerRes = start(obj[startNum], startNum, res);
						start = undefined;
					} else {
						innerRes = it(obj[startNum], startNum, res);
					};
					const forLable = Symbol.for('for-lable');
					if (innerRes && innerRes.hasOwnProperty(forLable)) {
						const forValue = Symbol.for('for-value');
						innerRes = innerRes.hasOwnProperty(forValue) ? innerRes[forValue] : res;
						if (lable === innerRes[forLable]) {
							res = innerRes;
							break lable1;
						} else throw last ? last(innerRes, obj) : innerRes
					}
					if (!retRes) {
						res = innerRes
					}
				} catch (innerRes) {
					res = innerRes;
					break lable1;
				}
			};
		} else lable2: for (; startNum >= endNum; startNum += stepNum) {
			for (const it of steps) {
				try {
					let innerRes;
					if (start) {
						innerRes = start(obj[startNum], startNum, res);
						start = undefined;
					} else {
						innerRes = it(obj[startNum], startNum, res);
					};
					const forLable = Symbol.for('for-lable');
					if (innerRes && innerRes.hasOwnProperty(forLable)) {
						const forValue = Symbol.for('for-value');
						innerRes = innerRes.hasOwnProperty(forValue) ? innerRes[forValue] : res;
						if (lable === innerRes[forLable]) {
							res = innerRes;
							break lable2;
						} else throw last ? last(innerRes, obj) : innerRes
					}
					if (!retRes) {
						res = innerRes
					}
				} catch (innerRes) {
					res = innerRes;
					break lable2;
				}
			};
		}
		return last ? last(res, obj) : res;
	};
	return {
		op(...call) {
			if (call.length) steps.push(...call);
			if (step === steps.length) {
				end();
				return res
			}
		},
		end(...call) {
			if (call.length) steps.push(...call);
			end();
			return res
		}
	}
};

/**
例子:
whenElse(
	label,
	["日营收总表", "日营收明细", this.getData],
	["日收款明细", this.getData3],
	this.getData2
);
相当于:
switch (label) {
	case '日营收总表':
	case '日营收明细': {
		this.getData();
		break;
	}
	case '日收款明细': {
		this.getData3();
		break;
	}
	default:this.getData2
}
 * @param {*} caseKey 匹配键
 * @param  {...any} args 候选列表
 * 匹配键 -> 可以为任意类型的值
 * 候选列表 -> 每项按相应逻辑依次匹配`匹配键`,匹配成功则执行相应逻辑
 * 匹配逻辑:
 * 	候选项为数组时, 数组最后一项元素为匹配成功时执行的逻辑, 数组前面的元素为一至多个匹配条件, 只要匹配成功一个就会执行相应函数(不是函数则返回相应数据)
 * 	候选项为函数时, 直接执行此函数
 *  候选项为对象时, 按下面加强匹配的规则进行匹配
 *  候选项不是数组函数以及对象时, 直接返回此数据
 *  
 * 加强匹配:
 * 	对象结构为	{match,call}	相当于[...match,call], 主要用于混合匹配,混合模式指的是多种模式依次匹配, 如 {match,search,...,call}
 * 	对象结构为	{secret,call}	当secret.search(caseKey)大于-1时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{search,call}	当caseKey.search(search)大于-1时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{tobe,call}		当tobe.test(caseKey)非空时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{test,call}		当caseKey.test(test)非空时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{string,call}	当string和caseKey转为字符串相等且值也相等时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{number,call}	当number和caseKey转为数值相等或isNaN键为true且两者转数值都为NaN时, 执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{string,call}	当string和caseKey转为字符串相等时, 且值也相等时执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{part,call}		当part中的键都存在于caseKey中, 且值也相等时执行相应函数(不是函数则返回相应数据)
 *  对象结构为	{cand,call}		当caseKey中的键都存在于cand中, 且值也相等时执行相应函数(不是函数则返回相应数据)
 *	对象结构为	{type,call}		当caseKey的类型是type或在type中时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{value,call}	当value的类型是caseKey或在caseKey中时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{MinMax,call}	caseKey大于等于MinMax[0]且小于等于MinMax[1]时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{Minmax,call}	caseKey大于等于Minmax[0]且小于Minmax[1]时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{minMax,call}	caseKey大于minMax[0]且小于等于minMax[1]时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{eqeq,call}		eqeq大于等于caseKey[0]且小于等于caseKey[1]时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{eqlt,call}		eqlt大于等于caseKey[0]且小于caseKey[1]时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{gteq,call}		gteq大于caseKey[0]且小于等于caseKey[1]时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{inner,call}	caseKey包含inner时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{outer,call}	outer包含caseKey时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{prop,call}		caseKey包含inner键时,执行相应函数(不是函数则返回相应数据)
 * 	对象结构为	{root,call}		root包含caseKey键时,执行相应函数(不是函数则返回相应数据)
 * 
 * 补充逻辑:
 *  加强匹配中包含not键时, 匹配条件反转, {part,call,not:true}<=>{part,call}
 *  函数执行后, 若用throw抛出值, 则抛出值赋值到temp上, 且继续匹配下个候选项
 * 	候选项非对象时函数参数为(caseKey,temp), 其中temp为上次的抛出值
 * 	候选项为对象时函数参数为(capture,caseKey,temp), 其中capture为候选项为对象时caseKey包含但part不包含的键组成的对象
 *  whenElse的值为匹配成功后执行函数的返回值
 * 
 * @returns 
 */
export function whenElse(caseKey, ...args) {
	let capture = {},
		date = `whenElse:${+new Date}`,
		opTry = (call, ...args) => {
			if (typeof call === 'function') {
				try {
					temp = call(...args);
					return true;
				} catch (error) {
					temp = error;
				}
			} else {
				temp = call;
				return true
			};
		},
		temp,
		res;
	return forStep(args, (it) => {
		if (Array.isArray(it)) {
			const call = it.pop();
			if (it.includes(caseKey)) {
				if (opTry(call, caseKey, it, capture, temp)) throw temp;
			}
		} else {
			const type = typeof it;
			if (type === 'object') {
				const { not, call, ...it3 } = it;
				if (
					forStep(it3,
						(it, key) => {
							switch (key) {
								case 'match'://{match,call}<->[...match,call]
									res = it.includes(caseKey)
									break;
								case 'secret':
									res = ~(capture = it.search(caseKey))
									break;
								case 'search'://it.search<->it.secret
									res = ~(capture = caseKey.search(it))
									break;
								case 'test':
									res = caseKey.test(it)
									break;
								case 'tobe'://it.tobe<->it.test
									res = it.test(caseKey)
									break;

								case 'string':
									res = JSON.stringify(it) === JSON.stringify(caseKey)
									break;
								case 'number':
									res = +it === +caseKey || isNaN(it) && isNaN(caseKey)
									break;
								case 'part':
									res = !forStep(caseKey, (it2, key) => {
										const isTrue = it.hasOwnProperty(key)
											? it[key] === it2
											: (capture[key] = it2, true);
										if (!isTrue) throw true;
									})
									break;
								case 'cand'://it<->it.part
									res = !forStep(it, (it2, key) => {
										const isTrue = caseKey.hasOwnProperty(key)
											? caseKey[key] === it2
											: (capture[key] = it2, true);
										if (!isTrue) throw true;
									})
									break;
								case 'type':
									if (Array.isArray(it)) {
										res = it.some((value) => new Object(caseKey) instanceof value
										)
									} else {
										res = new Object(caseKey) instanceof it
									}
									break;
								case 'value'://it<->it.type
									if (Array.isArray(caseKey)) {
										res = caseKey.some((value) =>
											new Object(it) instanceof value
										)
									} else {
										res = new Object(it) instanceof caseKey
									}
									break;
								case 'MinMax':
									res = caseKey >= it[0] && caseKey <= it[1]
									break;
								case 'Minmax':
									res = caseKey >= it[0] && caseKey < it[1]
									break;
								case 'minMax':
									res = caseKey > it[0] && caseKey <= it[1]
									break;
								case 'eqeq'://it.eqeq<->it.MinMax
									res = it >= caseKey[0] && it <= caseKey[1]
									break;
								case 'eqlt'://it.eqlt<->it.Minmax
									res = it >= caseKey[0] && it < caseKey[1]
									break;
								case 'gteq'://it.gteq<->it.minMax
									res = it > caseKey[0] && it <= caseKey[1]

									break;
								case 'inner':
									res = it.includes(caseKey);
									break;
								case 'outer'://it.outer<->it.inner
									res = caseKey.includes(it)
									break;
								case 'prop':
									res = caseKey.hasOwnProperty(it)
									break;
								case 'root'://it.root<->it.prop
									res = it.hasOwnProperty(caseKey)
									break;
								default:
									res = Symbol.for(date)
							}
							if (
								res !== Symbol.for(date) && (not ? !res : res) && opTry(call, caseKey, it3, capture, temp)
							) throw true;
						}
					)
				) throw temp;
			} else if (type === 'function') {
				let isTry;
				try {
					temp = it(caseKey, temp);
					isTry = true;
				} catch (error) {
					temp = error;
					isTry = undefined;
				}
				if (isTry) throw temp;
			} else throw it;
		}
	});
}

//数组转化
export const list = {
	/**
	 * @param {Array} arr
	 * @returns {Array} 去重的数组
	 */
	unique(arr) {
		return Array.from(new Set(arr))
	},
	/**
	 * 数组按照索引的奇偶分成两个数组，若有非数字索引则分为三个数组
	 * @param {Array} arr 可迭代数据
	 * @returns {Array} [odd, even, other]
	 */
	split(arr) {
		const odd = [], even = [], other = [];
		for (const key in arr) {
			const num = +key;
			if (Number.isNaN(num)) {
				other.push([key, arr[key]]);
			} else if (num % 2) {
				even.push(arr[key])
			} else {
				odd.push(arr[key])
			}
		}
		return [odd, even, other]
	},
	/**
	 * @param {Array} arr 分解数组
	 * @param {Array} ins 将插入模板的数据
	 * @returns {string} 数组交错合并为字符串
	 */
	interToStr(arr, ins) {
		let res = '';
		const joins = ins.slice();
		for (const key in arr) {
			res += arr[key] + joins[key] || ''
		};
		return res
	},
	/**
	 * 数组里某几个数字或字符风别多少个/数组里某个数字或字符串的个数
	 * @param {*} strArr 可迭代数据
	 * @param {Array|number|string} arr 被统计字符数组
	 * @returns {*} 字符个数
	 */
	hasCharts(strArr, arr) {
		if (!Array.isArray(arr)) {
			//数组里某几个数字或字符风别个数
			const res = Array(arr.length).fill(0);
			for (const item of strArr) {
				const index = arr.indexOf(item);
				if (~index) {
					res[index]++;
				}
			}
			return res
		} else {
			//数组里某个数字或字符串的个数
			let num = 0;
			for (const item of strArr) {
				if (arr === item) {
					num++;
				}
			}
			return num
		}
	},
	/**
	 * 查找返回给定数组中对象的索引
	 * @param  {Array} arr   源对象
	 * @param  {Object} options 查找的参考对象
	 * @param  {Boolean} stringify 是否转为字符串比较对象值
	 * @return {Number} 数组中对象的索引
	 */
	indexForObj(arr, options, stringify) {
		if (stringify) {
			for (const key in arr) {
				for (const key2 in options) {
					if (JSON.stringify(options[key2]) !== JSON.stringify(arr[key][key2])) {
						return
					};
				};
				return key
			}
		} else {
			for (const key in arr) {
				for (const key2 in options) {
					if (options[key2] !== arr[key][key2]) {
						return
					};
				};
				return key
			}
		}
	},
	/**
	 * 键数组和值数组合成键值对象
	 * @param {*} L1 键数组
	 * @param {*} L2 值数组
	 * @returns 键值对象
	 */
	joinToObj(L1, L2) {
		const res = {};
		for (const key in L1) {
			res[L1[key]] = L2[key];
		};
		return res
	},
	/**
	 * 按参考对象字面量查找并返回给定数组中对象
	 * @param  {*} arr   源对象
	 * @param  {*} options 查找的参考对象
	 * @param  {Boolean} stringify 是否转为字符串比较对象值
	 * @return {Object} 数组中的对象
	 */
	find(arr, options, stringify) {
		if (stringify) {
			for (const it of arr) {
				for (const key2 in options) {
					if (JSON.stringify(options[key2]) !== JSON.stringify(it[key2])) {
						return
					};
				};
				return it
			}
		} else {
			for (const it of arr) {
				for (const key2 in options) {
					if (options[key2] !== it[key2]) {
						return
					};
				};
				return it
			}
		}
	},
	/**
	 * 查找返回给定数组中对象的[索引,对象值]
	 * @param  {Array} arr   源对象
	 * @param  {Object} options 查找的参考对象
	 * @param  {Boolean} stringify 是否转为字符串比较对象值
	 * @return {Array} 数组中对象的索引及其值组合成的数组
	 */
	entries(arr, options, stringify) {
		if (stringify) {
			for (const it of arr) {
				for (const key2 in options) {
					if (JSON.stringify(options[key2]) !== JSON.stringify(it[key2])) {
						return
					};
				};
				return [key, it]
			}
		} else {
			for (const it of arr) {
				for (const key2 in options) {
					if (options[key2] !== it[key2]) {
						return
					};
				};
				return [key, it]
			}
		}
	},
	/**
	 * 过滤掉源数组中不符合要求的对象
	 * @param  {Array} arr   源数组
	 * @param  {Object} options 查找的参考对象
	 * @param  {Boolean} stringify 是否转为字符串比较对象值
	 * @return {Array} 过滤后的数组
	 */
	filter(arr, options, stringify) {
		const list = [];
		if (stringify) {
			out: for (const it of arr) {
				for (const key2 in options) {
					if (JSON.stringify(options[key2]) !== JSON.stringify(it[key2])) {
						continue out;
					};
				};
				list.push(it);
			};
		} else {
			out: for (const it of arr) {
				for (const key2 in options) {
					if (options[key2] !== it[key2]) {
						continue out;
					};
				};
				list.push(it);
			};
		};
		return list
	},
	/**
	* 将后面数组中对应对象合并到前面数组对应的对象中
	* @param  {Array} arr   源数组
	* @param  {Array} arrs  被合并的数组
	* @param  {Array} options arr中键序列，将对应键值作为依据对象到arrs查询相应对象
	* @param  {Boolean} self 是否原地并入到arr中，还是创建新对象
	* @param  {Boolean} stringify 是否转为字符串比较对象值
	* @return {Array} 源数组
	*/
	merge(arr, [...arrs], options, self = true, stringify) {
		if (self) {
			for (const aIt of arr) {
				const obj = {};
				options.forEach(it => {
					obj[it] = aIt[it];
				});
				Object.assign(aIt, arrs.splice(list.indexForObj(arrs, obj, stringify), 1)[0]);
				if (!arrs.length) return arrs;
			};
		} else {
			const arrRes = Array.isArray(arr) ? [] : {};
			for (const aIt of arr) {
				const obj = {};
				options.forEach(it => {
					obj[it] = aIt[it];
				});
				arrRes[key] = { ...aIt, ...arrs.splice(list.indexForObj(arrs, obj, stringify), 1)[0] }
				if (!arrs.length) return arrRes;
			};
		}
	},
	/**
	* 数组对象转对象数组
	* @param {*} list 数组对象
	* @param {*} options 配置
	* options 为 true 全部转化,返回对象数组
	* options 为 字符串 只转化options指定的字段为数组,返回数组
	* options 为 数组 转化options数组包含的字段为数组,返回对象数组
	* options 为 对象 只转化options对象包含的键, 但转而赋值给options元素值对应的键,返回对象数组
	* @returns 对象数组
	例子：toObjArr([{a:3,b:4},{a:2,b:5}],{a:'b',b:'c'}) => {b:[3,2],c:[4,5]}
	*/
	toObjArr(list, options = true) {
		let data = {};
		const ts = options === true
			? (ix, it) => {
				if (data[ix]) {
					data[ix].push(it[ix]);
				} else {
					data[ix] = [it[ix]];
				}
			} :
			typeof options === 'string'
				? (data = [], (ix, it) => {
					data.push(it[options]);
				}) :
				Array.isArray(options)
					? (ix, it) => {
						if (options.includes(ix)) {
							if (data[ix]) {
								data[ix].push(it[ix]);
							} else {
								data[ix] = [it[ix]];
							}
						}
					} : (ix, it) => {
						if (options.hasOwnProperty(ix)) {
							const key = options[ix];
							if (data[key]) {
								data[key].push(it[ix]);
							} else {
								data[key] = [it[ix]];
							}
						}
					}
			;

		list.forEach(it => {
			for (const ix in it) {
				ts(ix, it)
			}
		});

		return data
	},
	/**
	 * 过滤数组,通过指定的键,只保留相应键值在相应集合时的数组元素
	 * @param {Array} data 数组
	 * @param {Array} ids 值范围
	 * @param {String} id 过滤键
	 * @returns {Array} 过滤后的数组
	 */
	filterForKey(data, ids, id = "id") {
		return data.filter(it => ids.includes(it[id]))
	},
	/**
	 * 通过一个键查找数组中的对象,并把另一个键的值提取出来
	 * @param {Array} data 数组
	 * @param {Array} ids 值范围
	 * @param {String} id 过滤键
	 * @param {String} name 提取键
	 * @returns {Array} nameForId([{name:3,id:5},{name:4,id:5}],[5]) => [3,4]
	 */
	keyForKey(data, ids, id = "id", name = "name") {
		return data.flatMap(it => ids.includes(it[id]) ? [it[name]] : [])
	}
};

export const obj = {
	/**
	 * @param {Array} a 
	 * @param {Array} b 
	 * @param {Boolean} sort 是否先排序再比较
	 * @returns 字面量相等
	 */
	eq(a, b, sort) {
		return sort && Array.isArray(a) ? JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()) : JSON.stringify(a) === JSON.stringify(b);
	},
	/**
	 * 对象数组转数组对象
	 * @param {*} obj 对象数组
	 * @param {*} options 配置1
	 * @param {*} options2 配置2
	 * 
	 * options 为 true 全部转化,返回数组对象
	 * 例子：toObjArr({se:[0,1],nb:[0,1],name:[0,1]},true) => [{se:0,nb:0,name:0},{se:1,nb:1,name:1}]
	 * 
	 * options 为 数组 转化options数组包含的字段为数组,返回数组对象
	 * 例子：toObjArr({se:[0,1],nb:[0,1],name:[0,1]},['se','nb']) => [{se:0,nb:0},{se:1,nb:1}]
	 * 
	 * options 为 对象 转化options对象包含的键, 但转而赋值给options元素值对应的键,返回数组对象
	 * 例子：toObjArr({se:[0,1],nb:[0,1],name:[0,1]},{se:e}) => [{e:0,nb:0,name:0},{e:1,nb:1,name:1}]
	 * 
	 * options 为 字符串: 返回对象数组
	 * 
	 * 		将obj对象每个键(key)上数组里的元素依次都变成对象,此对象为{[options]:obj[options][index],[key]:obj[key][index]},index为元素索引
	 * 		例子：toArrObj({se:[0,1],nb:[0,1],name:[0,1]},'name',{se:e}) => {se:[{name:0,e:0},{name:0,e:1}]}
	 * 
	 * 		options2 存在时,只转化options2对象包含的键, 键数组元素转为的对象为{[options]:obj[options][index],[options2[key]]:obj[key][index]}
	 * 		例子：toArrObj({se:[0,1],nb:[0,1],name:[0,1]},'name') => {se:[{name:0,se:0},{name:0,se:1}], nb:[{name:0,nb:0},{name:0,nb:1}]}
	 * 
	 * @returns 数组对象/对象数组
	 */
	toArrObj(obj, options = true, options2) {
		let data = [];
		const ts = options === true
			? (key) => {
				obj[key].forEach((item, index) => {
					if (data[index]) {
						data[index][key] = item;
					} else {
						data[index] = { [key]: item };
					}
				});
			}
			: typeof options === 'string'
				? (data = {}, options2
					? (options2[options] || (options2[options] = options), (key) => {
						if (options2.hasOwnProperty(key)) {
							data[key] = options === key ? obj[key] : obj[key].map(it => ({ [options2[key]]: it }))
						}
					})
					: (key) => {
						data[key] = options === key ? obj[key] : obj[key].map(it => ({ [key]: it }))
					})
				: Array.isArray(options)
					? (key) => {
						if (options.includes(key)) {
							obj[key].forEach((item, index) => {
								if (data[index]) {
									data[index][key] = item;
								} else {
									data[index] = { [key]: item };
								}
							});
						}
					} :
					(key) => {
						if (options.hasOwnProperty(key)) {
							obj[key].forEach((item, index) => {
								if (data[index]) {
									data[index][options[key]] = item;
								} else {
									data[index] = { [options[key]]: item };
								}
							});
						}
					}
			;

		for (const key in obj) {
			ts(key)
		};
		if (Array.isArray(data)) {
			return data;
		} else {
			const op2 = options2 ? options2[options] : options;
			for (const key in data) {
				if (key !== options) {
					data[key] = data[key].map((it, ix) => (it[op2] = data[options][ix], it))
				}
			};
			delete data[options];
			return data
		}
	},
	/**
	 * 将普通对象转为键值对对象或数组
	 * ({a:5,b:6}, ['label','value'])=>{label:['a','b'],value:[5,6]}
	 * @param {object} obj 
	 * @param {Array} arr 
	 * @returns {object}
	 */
	keyVal(obj, arr) {
		if (arr) {
			const objs = { [0]: [], [arr[1]]: [] };
			for (const key in obj) {
				objs[arr[0]].push(key);
				objs[arr[1]].push(obj[key]);
			}
			return objs
		} else {
			const objs = [[], []];
			for (const key in obj) {
				objs[0].push(key);
				objs[1].push(obj[key]);
			}
			return objs
		}
	},
	/**
	 * 将对象按照一定规则初始化为默认值
	 * @param {Object} data 
	 * @param {Object} list 
	 * @param {Array|Object} arrs 
	 * true			:list覆盖data同名字段值
	 * Array		:list覆盖data中arrs指定的字段
	 * Object		:list覆盖data中arrs指定的字段(键为data中字段,值为list中字段)
	 * undefined:仅当data字段值为undefined时,list覆盖data同名字段值
	 * 
	 * 例子：
	 * init({a:3}, {a:0}, true) => {a:0}
	 * init({a:3,b:4}, {a:0}, ['a']) => {a:0}
	 * init({a:3,b:4}, {b:0}, {a:'b'}) => {a:0}
	 * init({a:undefined,b:4}, {a:3,b:0}) => {a:3,b:4}
	 * 
	 * @returns {Object}
	 */
	init(data, list, arrs) {
		if (list) {
			if (arrs === true) {
				for (const key in data) {
					if (list.hasOwnProperty(key)) {
						data[key] = list[key]
					}
				};
			} else if (Array.isArray(arrs)) {
				for (const key of arrs) {
					data[key] = list[key]
				};
			} else if (arrs) {
				for (const key in arrs) {
					data[key] = list[arrs[key]]
				};
			} else {
				for (const key in data) {
					if (data[key] === undefined && list.hasOwnProperty(key)) {
						data[key] = list[key]
					}
				};
			};
			return data
		} else {
			const obj = {};
			for (let key in data) {
				switch (getType(data[key])) {
					case "Undefined":
						break;
					case "Null":
						obj[key] = null
						break;
					case "Array":
						obj[key] = [init(data[key][0])]
						break;
					case "Object":
						obj[key] = init(data[key])
						break;
					default:
						obj[key] = data[key].constructor()
				}
			}
			return obj;
		}
	},
	/**
	 * 改变对象属性名
	 * @param {{ data,option,ts,del,children}} param0 
	 * data 原数据
	 * option 转化配置对象,键与需转化的键对应,其键值为将作为要转成的新键
	 * ts 转化函数集,键与需转化的键对应
	 * children 有子节点则递归转换
	 * del 是否删除原来字段
	 * @returns tsProp({data:{a:1,b:2},option:{a:'c'},(it)=>`${it}`,children},false) => {c:'1',b:2,a:1}
	 */
	tsProp({
		data,
		option,
		ts,
		children,
		del = true
	}) {
		const fn =
			ts
				? del
					? children
						? ({ it, from, target }) => {
							it[target] = ts[from](it[from]);
							if (target !== from) delete it[from];
							it[children] = obj.tsProp(it[children]);
						}
						: ({ it, from, target }) => {
							it[target] = ts[from](it[from]);
							if (target !== from) delete it[from];
						}
					: children
						? ({ it, from, target }) => {
							it[target] = ts[from](it[from]);
							it[children] = obj.tsProp(it[children]);
						}
						: ({ it, from, target }) => {
							it[target] = ts[from](it[from]);
						}
				: del
					? children
						? ({ it, from, target }) => {
							it[target] = it[from];
							if (target !== from) delete it[from];
							it[children] = obj.tsProp(it[children]);
						}
						: ({ it, from, target }) => {
							it[target] = it[from];
							if (target !== from) delete it[from];
						}
					: children
						? ({ it, from, target }) => {
							it[target] = it[from];
							it[children] = obj.tsProp(it[children]);
						}
						: ({ it, from, target }) => {
							it[target] = it[from];
						};
		return data.map(it => {
			for (const from in option) fn({ it, from, target: option[from] });
			return it
		})
	}
};

export const tree = {
	/**
	 * 生成树状结构
	 * @param {*} list 平铺的对象
	 * @param {{id,pId,topId,child,tsIt,tsList}} param1 配置对象
	 * id id字段名
	 * pId 父级id字段名
	 * top 顶层id值
	 * child 子节点名
	 * tsIt 子项转化函数
	 * tsList 子项列表转化函数
	 * @returns gen([{a:1,b:3,id:2,pId:1},{a:3,b:2,id:1,pId:0}],{id:'id',pId:'pId',child:'children',top:0,tsIt:(it) => (it.c = it.a, it)}) => [
	 * {a:3,b:2,id:1,pId:0,children:[{a:1,b:3,id:2,pId:1}]}]
	 */
	gen(list, { id = 'id', pId = 'Parent', child = 'children', top = 0, tsIt, tsList } = {}) {
		const children = {},
			classify = tsIt ? function (it) {
				if (children[it[pId]]) {
					children[it[pId]].push(tsIt(it))
				} else {
					children[it[pId]] = [tsIt(it)]
				}
			} : function (it) {
				if (children[it[pId]]) {
					children[it[pId]].push(it)
				} else {
					children[it[pId]] = [it]
				}
			},
			reduce = tsList ? function () {
				return children[top] ? tsList(children[top].map((newChild) => {
					newChild[child] = tsList(children[newChild[id]]);
					return newChild
				})) : []
			} : function () {
				return children[top] ? children[top].map((newChild) => {
					newChild[child] = children[newChild[id]];
					return newChild
				}) : []
			};
		list.forEach(classify);
		return reduce()
	},
	/**
	 * 树状对象打平，有过滤函数filterFn时，按函数过滤
	 * @param {array} arr 
	 * @param {array} brr 
	 * @param {string} attributeName 
	 * @param {function} filterFn(item, brr)= (item, brr) => brr.some(item2 => item2.name == item.name)
	 * @returns flat([{a:1,b:3,child:[{a:3,b:2}]}],[],'child') =>[{a:1,b:3},{a:3,b:2}]
	 */
	flat(arr, brr = [], attributeName = 'children', filterFn) {
		arr.forEach(item => {
			const result = filterFn ? filterFn(item, brr) : true; //判断元素的某个属性值是否相等 返回 true 和false
			if (item[attributeName]) {
				const { [attributeName]: children, ...temp } = item;
				if (result) brr.push(temp);
				if (children.length) return tree.flat(children, brr)
			} else {
				if (result && item) brr.push(item)
			}
		})
		return brr
	},
	/**
	 * @param {arrry} list 数据源数组
	 * @param {string} children 子节点名
	 * @param {function} fun 过滤条件函数 targetArr.some(item => item.name == it.name)
	 * @param {string} newChildren 新子节点名
	 * @returns 结构不变的过滤后数据
	 */
	filterList(list, children = "children", fun = (it) => !it.hidden, newChildren = children) {
		const li = [];
		for (const it of list) {
			const nit = tree.filterIt(it, children, fun, newChildren);
			if (nit) li.push(nit)
		}
		return li
	},
	/**
	 * @param {Object} list 数据源对象
	 * @param {string} children 子节点名
	 * @param {function} fun 过滤条件函数 targetArr.some(item => item.name == it.name)
	 * @param {string} newChildren 新子节点名
	 * @returns {Object} 过滤后的数据源对象
	 */
	filterIt(it, children, fun, newChildren = children) {
		if (fun(it)) {
			it[newChildren] = Array.isArray(it[children]) ? tree.filterList(it[children], children, fun, newChildren) : [];
			return it
		}
	},
	//默认生成树
	defTree(list, { id = 'id', pId = 'Parent', child = 'children', top = 0 } = {}) {
		return tree.gen(
			list,
			{
				id, pId, child, top,
				tsList: (list) => {
					//应用于每个列表
					return list.sort((a, b) => a.weigh - b.weigh)
				},
				tsIt: (children) => {
					//应用于子节点
					// const newName = '', allExpand = false;
					// if (newName) children[newName] = children.name;
					if (
						// allExpand || 
						children.deep < 2) children.expand = true;
					return children
				},
			}
		)
	},
	/**
	 * 对象合并
	 * @param {object} it //源对象
	 * @param {object} _it //目标对象
	 * @param {boolean} deep //数组是否深入
	 * @param {boolean} first //数组是否只留首个
	 */
	mergeIt(it, _it, deep = true, first = true) {
		let temp;
		if (isType(it, 'Object')) {
			merge(_it, it, deep);
		} else if (deep && isType(it, 'Array') && it.length) {
			if (first) {
				if (isType(_it, 'Array') && (temp = mergeIt(it[0], _it[0], deep, first))) {
					return [temp];
				};
			} else {
				return list.unique(JSON.parse(JSON.stringify()))
			}
		} else {
			return it;
		}
	},
	/**
	 * 对象合并
	 * @param {object} _this //目标对象
	 * @param {object} merge //源对象
	 * @param {boolean} deep //数组是否深入
	 * @param {boolean} first //数组是否只留首个
	 */
	merge(_this, merge, deep = true, first = true) {
		let temp;
		for (const me in merge) {
			if (merge[me]) {
				if (!_this[me]) {
					_this[me] = {}
				}
				if (temp = mergeIt(merge[me], _this[me], deep, first)) {
					_this[me] = temp
				}
			}
		}
		return _this
	}
};