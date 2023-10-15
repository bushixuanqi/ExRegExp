
/**
 * 一定范围内的随机数,默认0到100
 * @param {number} start 
 * @param {number} end 
 * @param {boolean} trunc 是否取整
 */
 export function random(start = 0, end = 100, trunc = true) {
	const num = start + Math.random() * (end - start)
	return trunc ? Math.round(num) : num;
}

/*
 * 防抖函数
 */
export function debounce(func /*函数*/, wait /*间隔时间*/, immediate /*及时执行*/) {
	let timeout, args, timestamp, result
	//true
	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp
		const step = last > 0 ? wait - last : 0; //据间隔时间结束还有多少时间
		timeout = step > 0 ? setTimeout(later, step) /*间隔时间未结束时调用函数*/ : (immediate || (result = func(args)), null) /*间隔时间结束时清空*/;
	}
	return function (...args) {
		timestamp = +new Date()
		// 如果延时不存在，重新设定延时
		if (!timeout) {
			timeout = setTimeout(later, wait)
			if (immediate) result = func(args);
		}
		return result
	}
}

/**
 * @returns {string} 创建特殊字符串
 */
export function createUniqueString() {
	const timestamp = [+new Date()]
	const randomNum = [Math.ceil((1 + Math.random()) * 65536)]
	return (+(randomNum + timestamp)).toString(32)
}


/**
 * 缓存调用结果（出入固定）
 */
export function cached(fn) {
	const cache = new Map();
	return function cachedFn(str) {
		let hit;
		return cache.get(str) || (hit = fn(str), cache.set(str, hit), hit)
	};
}


/**
 * 生成阀值控制器
 */
export function genThrottle() {
	//函数执行超时阈值,和最后一次调用
	let throttleTimeout, lastTimeout;
	/**
	 * 设置函数执行超时阈值，在函数调用过程中禁止再被调用
	 * @param {Function} callback 
	 * @param {number} ms 
	 * @returns 
	 */
	return [
		(callback, ms) => {
			return (...args) => {
				if (throttleTimeout) {
					lastTimeout = setTimeout(() => {
						//暂存最后一次调用,如果没有新的主动调用则自动调用最后的函数缓存，保证数据最新
						if (lastTimeout) {
							callback(...args)
						}
					}, ms);
				} else {
					callback(...args);
					lastTimeout = undefined;
					throttleTimeout = setTimeout(() => {
						throttleTimeout = undefined;
					}, ms);
				}
			};
		},
		() => {
			clearTimeout(throttleTimeout);
			clearTimeout(lastTimeout);
			throttleTimeout = undefined;
			lastTimeout = undefined;
		}
	]
}

/**
 * 将函数延迟到依赖创建完后执行
 * @param {{ exist, list, max,index, fn }}  
 * exist:依赖对象
 * list:依赖对象上的递归访问键数组
 * max: 最大等待时间
 * index: 指定注入回调函数的值属于那个递归访问键的结果,不指定则为exist
 * fn: 回调函数
 * @returns
 */
export function toHas({ exist, list, index = -1, max = 1000, fn }) {
	if (max > 0) {
		max -= 10;
		let _this = exist, _thisx = [_this];
		if (_this && (list && list.length ? list.every(it => (_thisx.push(_this = _this[it]), _this)) : true)) {
			return fn(_thisx[index + 1]);
		} else setTimeout(() => {
			this.toHas({ exist, list, max, fn });
		}, 10);
	} else throw new Error('加载超时!')
};