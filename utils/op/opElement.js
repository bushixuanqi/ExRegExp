import { range } from "./opNumber.js";

//颜色计算
//参数中num中最高为1(100%)
export const colors = {
	mul(color, num = [1, 1, 1], rgba) {
		if (!Array.isArray(num)) {
			num = [num, num, num]
		};
		const data = colors.parse(color);
		num.forEach((it, ix) => data[ix] * it);
		return colors.get(data, rgba)
	},
	div(color, num = [1, 1, 1], rgba) {
		if (!Array.isArray(num)) {
			num = [num, num, num]
		};
		const data = colors.parse(color);
		num.forEach((it, ix) => data[ix] / it);
		return colors.get(data, rgba)
	},
	sub(color, num = [1, 1, 1], rgba) {
		if (!Array.isArray(num)) {
			num = [num, num, num]
		};
		const data = colors.parse(color);
		num.forEach((it, ix) => data[ix] - it);
		return colors.get(data, rgba)
	},
	add(color, num = [1, 1, 1], rgba) {
		if (!Array.isArray(num)) {
			num = [num, num, num]
		};
		const data = colors.parse(color);
		num.forEach((it, ix) => data[ix] + it);
		return colors.get(data, rgba)
	},
	//透明度转换
	opacity(color, num, rgba) {
		const data = colors.parse(color);
		data[3] * num;
		return colors.get(data, rgba)
	},
	/**
	 * 颜色转化,支持六种格式: #xxx #xxxx #xxxxxx #xxxxxxxx rgb(x,x,x) rgba(x,x,x)
	 * @param {string} color 被转化的颜色
	 * @param {boolean} rgba 转为 rgba(x,x,x,x) 还是 #xxxxxxxx 格式
	 */
	trans(color, rgba) {
		return colors.get(colors.parse(color), rgba)
	},
	//将颜色统一转化为数组
	parse(color) {
		let text;
		color = color.trim();
		//hex
		if (color[0] === '#') {
			switch (color.length) {
				//#xxx
				case 4:
					text = [+`0x${color[1]}` * 16, +`0x${color[2]}` * 16, +`0x${color[3]}` * 16, 256];
					break;
				//#xxxx
				case 5:
					text = [+`0x${color[1]}` * 16, +`0x${color[2]}` * 16, +`0x${color[3]}` * 16, +`0x${color[3]}` * 16];
					break;
				//#xxxxxx
				case 7:
					text = [+`0x${color.substring(1, 3)}`, +`0x${color.substring(3, 5)}`, +`0x${color.substring(5, 7)}`, 256];
					break;
				//#xxxxxxxx
				case 9:
					text = [+`0x${color.substring(1, 3)}`, +`0x${color.substring(3, 5)}`, +`0x${color.substring(5, 7)}`, +`0x${color.substring(7, 9)}`];
					break;
			};
			//#rgba
		} else if (color[3] === 'a') {
			text = color.slice(5, -1).split(',');
			text[3] = +text[3] * 256;
			//#rgb
		} else {
			text = color.slice(4, -1).split(',');
			text[3] = 256;
		}
		return text
	},
	//将数组还原成颜色
	get(text, rgba) {
		if (rgba) {
			if (text[3] === 256) text.pop();
			return `#${text.map(it => (+it).toString(16).split('.')[0]).join('')}`
		} else {
			return `${(text[3] === 256 ? (text.pop(), 'rgb') : (text[3] = text[3] / 256, 'rgba'))}(${text.join(',')})`
		}
	}
};

//class样式类名管理
export const classes = {
	/**
	 * @param {HTMLElement} element
	 * @param {string} 切换class
	 */
	toggle(element, className) {
		if (!element || !className) return;
		if (!element.className) {
			return element.className = className;
		}
		let classString = element.className;
		const nameIndex = classString.indexOf(className)
		if (nameIndex === -1) {
			classString += " " + className
		} else if (nameIndex === 0) {
			classString = classString.substring(nameIndex + 1 + className.length)
		} else {
			classString =
				classString.substring(0, nameIndex - 1) +
				classString.substring(nameIndex + className.length)
		}
		element.className = classString
	},
	/**
	 * 选择有某个class的元素
	 * @param {HTMLElement} elm
	 * @param {string} cls
	 * @returns {boolean} 是否具有cls类
	 */
	has(ele, cls) {
		return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
	},
	/**
	 * 添加类到元素
	 * @param {HTMLElement} elm
	 * @param {string} cls
	 */
	add(ele, cls) {
		if (!hasClass(ele, cls)) ele.className += ' ' + cls
	},
	/**
	 * 移除类
	 * @param {HTMLElement} elm
	 * @param {string} cls
	 */
	remove(ele, cls) {
		if (hasClass(ele, cls)) {
			const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
			ele.className = ele.className.replace(reg, ' ')
		}
	}
}

export const elementFind = {
	/**
	 * 返回上层元素
	 * @param {HTMLElement} el 元素
	 * @returns 主体或父级元素
	 */
	getParentOrHost(el) {
		return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
	},
	/**
	 * 向上查找最近元素(不含CTX)
	 * @param {HTMLElement} el 
	 * @param {String} selector 
	 * @param {HTMLElement} ctx 
	 * @returns 
	 */
	closest(el, selector, ctx) {
		if (el && selector) {
			if (!ctx) ctx = document;
			if (selector[0] === '>') {
				do {
					if (el === ctx) break;
					if (matches(el, selector.substring(1), ctx)) return el;
				} while (el = getParentOrHost(el));
			} else {
				do {
					if (el === ctx) break;
					if (matches(el, selector)) return el;
				} while (el = getParentOrHost(el));
			}
		}
	},
	/**
	 * 元素查找，可回调处理
	 * @param {HTMLElement} ctx 
	 * @param {String} query 
	 * @param {Object} iterator 
	 * @returns {Array<HTMLElement>}
	 */
	find(ctx, query, iterator) {
		if (ctx) {
			let list = ctx.querySelectorAll(query),
				n = list.length;
			if (iterator) {
				for (let i = 0; i < n; i++) {
					iterator(list[i], i);
				}
			}
			return list;
		}
		return [];
	},
	/**
	 * 获取 el 的 childNum 号子元素，忽略隐藏元素、可排序元素（不忽略拖动产生的副本）和不可拖动的元素
	 * @param  {HTMLElement} el 父元素
	 * @param  {Number} childNum 子元素索引,可为负数
	 * @param  {Function} find 判断函数
	 * @param  {Boolean} findIndex 是否只对判断函数查找的元素计算索引
	 * @return {HTMLElement|undefined} 查到的子元素
	 */
	getChild(el, childNum, find = () => true, findIndex = true) {
		let currentChild = 0, children = el.children;
		if (childNum < 0) {
			if (findIndex) {
				for (let i = children.length - 1; i >= 0; i--) {
					if (find(children[i], i)) {
						currentChild--;
						if (currentChild === childNum) {
							return children[i];
						}
					}
				}
			} else {
				for (let i = - 1; children.length + i >= 0; i--) {
					currentChild = children.length + i;
					if (find(children[currentChild], currentChild) && i === childNum) {
						return children[currentChild];
					}
				}
			}
		} else {
			if (findIndex) {
				for (let i = 0; i < children.length; i++) {
					if (find(children[i], i)) {
						if (currentChild === childNum) {
							return children[i];
						}
						currentChild++;
					}
				}
			} else {
				for (let i = 0; i < children.length; i++) {
					if (find(children[i], i) && i === childNum) {
						return children[i];
					}
				}
			}
		}
	},
	/**
	 * 元素在父元素中的索引
	 * @param  {HTMLElement} el
	 * @param  {selector} selector 函数判断哪些不作数
	 * @return {number}
	 */
	index(el, selector = (el) => !/^TEMPLATE$/i.test(el.nodeName)) {
		if (!el || !el.parentNode) {
			return -1;
		}
		let index = 0;
		if (selector) {
			while (el = el.previousElementSibling) {
				if (selector(el)) index++;
			}
		} else {
			while (el = el.previousElementSibling) {
				index++;
			}
		}
		return index;
	},
	/**
	 * 元素是否与元素查询表达式匹配
	 * @param {HTMLElement} el 
	 * @param {String} selector
	 * @param {HTMLElement} selector
	 * @returns {boolean}
	 */
	matches(el, selector, parent) {
		if (el && selector) {
			if (parent) {
				if (el.parentNode !== parent) return;
			} else if (selector[0] === '>') selector = selector.substring(1);
			return el.matches(selector);
		}
	}
}

/**
 * 获取计算后的样式
 * @param {HTMLElement} el 
 * @param {String|undefined} prop 
 * @param {*} val 
 * @returns {String|undefined}
 */
export function css(el, prop, val) {
	let style = el && el.style;
	if (style) {
		if (val) {
			if (!(prop in style) && !prop.includes('webkit')) {
				prop = '-webkit-' + prop;
			}
			style[prop] = typeof val === 'string' ? val : val + 'px';
		} else {
			val = window.getComputedStyle(el, '');
			return prop ? val[prop] : val;
		}
	}
}

export const opRect = {
	/**
	 * 设置元素矩形框
	 * @param {HTMLElement} el 
	 * @param {object} rect 
	 */
	setRect(el, rect) {
		css(el, 'position', 'absolute');
		css(el, 'top', rect.top);
		css(el, 'left', rect.left);
		css(el, 'width', rect.width);
		css(el, 'height', rect.height);
	},

	/**
	 * 清空元素矩形框
	 * @param {HTMLElement} el 
	 */
	unsetRect(el) {
		css(el, 'position', '');
		css(el, 'top', '');
		css(el, 'left', '');
		css(el, 'width', '');
		css(el, 'height', '');
	},

	/**
	 * 矩形相等
	 * @param {object} rect1 
	 * @param {object} rect2 
	 * @returns {boolean}
	 */
	isRectEqual(rect1, rect2) {
		return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
	},

	/**
	 * 实时计算所需时间
	 * @param {object} animatingRect 动画矩形
	 * @param {*} fromRect 来源矩形
	 * @param {*} toRect 目标矩形
	 * @param {*} options 配置
	 * @returns 
	 */
	calculateRealTime(animatingRect, fromRect, toRect, options) {
		return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
	}
}

/**
* @param {string} val
* @returns {string} 实体字符恢复
*/
export function html2Text(val) {
	const div = document.createElement('div')
	div.innerHTML = val
	return div.textContent || div.innerText
}

/**
 * 复制内容到截切版
 * @param {*} text 
 * @returns 
 */
export function copy(text) {
	if (!navigator.clipboard) {
		return fallbackCopyTextToClipboard(text);
	}
	return navigator.clipboard.writeText(text)
}
function fallbackCopyTextToClipboard(text) {
	return new Promise((re, rj) => {
		// 1.创键一个可选中元素
		let textArea = document.createElement("textarea");
		textArea.value = text;
		// 2.使用定位，阻止页面滚动
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			const successful = document.execCommand('copy');
			if (successful) {
				re(text)
			} else {
				rj('复制失败')
			}
		} catch (err) {
			rj(err)
		}
		// 3.移除元素
		document.body.removeChild(textArea);
	})
}

/**
 * 执行元素滚动
 * @param {HTMLElement} el 
 * @param {number} x 
 * @param {number} y 
 */
export function scrollBy(el, x, y) {
	el.scrollLeft += x;
	el.scrollTop += y;
}

/**
 * 弹窗不超出父级窗口算法
 * @param {HTMLElement|Number} el 元素/元素宽度
 * @param {*} cellPx 格子大小
 * @param {*} modalPx 弹窗大小/数据条数
 * @param {*} index 当前索引
 * @returns 
 */
export function left(el, cellPx, modalPx, index) {
	if (!el) return;
	const max = Math.trunc((Number.isFinite(el) ? el : el.clientWidth) / cellPx); //每行格数
	if (index === undefined) {
		return range(modalPx ? modalPx % max : max - 1, new Date)
	} else {
		const list = [], ci = index % max, mod = max - 1 - ci;
		for (let start = cellPx; start < modalPx; start += cellPx) {
			list.push(`-${modalPx - start}px`);
		}
		return mod < ci && `left:${list[mod]}`;
	}
}