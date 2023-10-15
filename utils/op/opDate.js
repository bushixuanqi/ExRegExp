//时间字符串转时间戳
export function times(str) {
	const dates = str.split(/[^\d]+/).map(it => +it);
	if (dates.length === 1) {
		dates.push(0)
	} else {
		dates[1]--;
	}
	return new Date(...dates)
}

/**
 * 当前时间戳是否为标准客户端时间戳
 */
export function isTimes(times) {
	return times > 9999999999
}

const toDateStrs = (str) => {
	let temp = '';
	const date = {
		n: 0, y: 0, r: 0, s: 0, f: 0, m: 0, h: 0
	};
	for (const it of str) {
		switch (it) {
			case 'n':
				date.n = +temp;
				temp = '';
				break;
			case 'y':
				date.y = +temp;
				temp = '';
				break;
			case 'r':
				date.r = +temp;
				temp = '';
				break;
			case 's':
				date.s = +temp;
				temp = '';
				break;
			case 'f':
				date.f = +temp;
				temp = '';
				break;
			case 'm':
				date.m = +temp;
				temp = '';
				break;
			case 'h':
				date.h = +temp;
				temp = '';
				break;
			default:
				temp += it
		}
	};
	return date;
},
	zeroDate = new Date(0),
	zero = {
		year: zeroDate.getFullYear(),
		month: zeroDate.getMonth()
	},
	to = (type, date) => {
		let temp;
		switch (type) {
			case 'n':
				temp = new Date(date).getFullYear() - zero.year;
			case 'y':
				const dateTemp = new Date(date);
				temp = 12 * (dateTemp.getFullYear() - zero.year) + dateTemp.getMonth() - zero.month;
			case 'r':
				temp = Math.trunc(date / 1000 / 60 / 60 / 24);
			case 's':
				temp = Math.trunc(date / 1000 / 60 / 60);
			case 'f':
				temp = Math.trunc(date / 1000 / 60);
			case 'm':
				temp = Math.trunc(date / 1000);
			default: temp = date
		}
		if (type) {
			return type(temp)
		} else return temp
	},
	dateObj = (date, type = 'h') => {
		switch (type) {
			case 'n':
				return {
					n: date.getFullYear()
				};
			case 'y':
				return {
					n: date.getFullYear(),
					y: date.getMonth() + 1
				};
			case 'r':
				return {
					n: date.getFullYear(),
					y: date.getMonth() + 1,
					r: date.getDate()
				};
			case 's':
				return {
					n: date.getFullYear(),
					y: date.getMonth() + 1,
					r: date.getDate(),
					s: date.getHours()
				};
			case 'f':
				return {
					n: date.getFullYear(),
					y: date.getMonth() + 1,
					r: date.getDate(),
					s: date.getHours(),
					f: date.getMinutes()
				};
			case 'm':
				return {
					n: date.getFullYear(),
					y: date.getMonth() + 1,
					r: date.getDate(),
					s: date.getHours(),
					f: date.getMinutes(),
					m: date.getSeconds()
				};
			case 'h':
				return {
					n: date.getFullYear(),
					y: date.getMonth() + 1,
					r: date.getDate(),
					s: date.getHours(),
					f: date.getMinutes(),
					m: date.getSeconds(),
					h: date.getMilliseconds()
				};
		}
	}

export class $date {
	dateObj = { n: 0, y: 1, r: 1, s: 0, f: 0, m: 0, h: 0 }//年月日时分秒毫秒
	args = [];
	'n'(val) {//增加年数(val为负数时减小年数);
		this.dateObj.n += val
		return this.upDate()
	}
	'y'(val) {//增加月数(val为负数时减小月数);
		this.dateObj.y += val
		return this.upDate()
	}
	'r'(val) {//增加天数(val为负数时减小天数);
		this.dateObj.r += val
		return this.upDate()
	}
	's'(val) {//增加小时数(val为负数时减小小时数);
		this.dateObj.s += val
		return this.upDate()
	}
	'f'(val) {//增加分钟数(val为负数时减小分钟数);
		this.dateObj.f += val
		return this.upDate()
	}
	'm'(val) {//增加秒数(val为负数时减小秒数);
		this.dateObj.m += val
		return this.upDate()
	}
	'h'(val) {//增加毫秒数(val为负数时减小毫秒数);
		this.dateObj.h += val
		return this.upDate()
	}
	"+"(str) {//以字符串的形式增加时间,如 this['+']('1n1y1r') 表示增加1年1月1日
		const strs = toDateStrs(str);
		if (strs.h) {
			this.dateObj.h += strs.h
		}
		if (strs.m) {
			this.dateObj.m += strs.m
		}
		if (strs.f) {
			this.dateObj.f += strs.f
		}
		if (strs.s) {
			this.dateObj.s += strs.s
		}
		if (strs.r) {
			this.dateObj.r += strs.r
		}
		if (strs.y) {
			this.dateObj.y += strs.y
		}
		if (strs.n) {
			this.dateObj.n += strs.n
		}
		return this.upDate()
	}
	"-"(str) {//以字符串的形式减小时间,如 this['+']('1n1y1r') 表示减小1年1月1日
		const strs = toDateStrs(str);
		if (strs.h) {
			this.dateObj.h -= strs.h
		}
		if (strs.m) {
			this.dateObj.m -= strs.m
		}
		if (strs.f) {
			this.dateObj.f -= strs.f
		}
		if (strs.s) {
			this.dateObj.s -= strs.s
		}
		if (strs.r) {
			this.dateObj.r -= strs.r
		}
		if (strs.y) {
			this.dateObj.y -= strs.y
		}
		if (strs.n) {
			this.dateObj.n -= strs.n
		}
		return this.upDate()
	}
	upObj(type) { //内部函数: this.date->this.dateObj
		this.dateObj = dateObj(this.date, type);
		return this
	}
	upDate() {//内部函数: this.dateObj->this.date
		if (this.self) {
			this.date.setFullYear(this.dateObj.n);
			this.date.setMonth(this.dateObj.y - 1);
			this.date.setDate(this.dateObj.r);
			this.date.setHours(this.dateObj.s);
			this.date.setMinutes(this.dateObj.f);
			this.date.setSeconds(this.dateObj.m);
			this.date.setMilliseconds(this.dateObj.h);
		} else {
			this.date = new Date(this.dateObj.n, this.dateObj.y - 1, this.dateObj.r, this.dateObj.s, this.dateObj.f, this.dateObj.m, this.dateObj.h)
		}
		return this
	}
	up(date) {//内部函数: date->this.date
		if (this.self) {
			this.date.setFullYear(date.getFullYear());
			this.date.setMonth(date.getMonth());
			this.date.setDate(date.getDate());
			this.date.setHours(date.getHours());
			this.date.setMinutes(date.getMinutes());
			this.date.setSeconds(date.getSeconds());
			this.date.setMilliseconds(date.getMilliseconds());
		} else {
			this.date = date;
		}
		return this
	}
	set(date, self, opType, ...args) {/*
	date 将字符串\时间戳\Date转为$date类型
		与new Date的区别在于:
		1. 会自动判断时间戳是前端还是后端的,后端时间戳不需要乘1000才能转为时间
		2. 支持类似 '2022年11月12日' 这种标准汉字时间格式	
	self 设置此对象过程总的操作是直接更改 this.date 还是产生新增覆盖 this.date 旧值, 比如外部传入时间对象修改保留对原始对象的给更改时 self:true
	opType 作为this.upObj的参数,指定dateObj需要求那些值
	args 额外参数表,调用this.toString() 函数时,如未传参数则以此作为默认参数
	*/
		if (typeof self === 'string') {
			opType = self;
			self = undefined;
			if (args.length || opType) args.unshift(opType);
		}

		if (date instanceof Date) {
			this.up(date)
				.upObj(opType)
		} else {
			const type = typeof date;
			if (type === 'object') {
				Object.assign(this.dateObj, date);
				this.upDate();
			} else {
				this.up(type === 'number'
					? new Date(date * (isTimes(date) ? 1 : 1000))
					: type === 'string' && /[年/-]/.test(date)
						? times(date)
						: date
							? new Date(date)
							: new Date()
				)
					.upObj(opType)
			}
		}
		if (self) this.self = true;
		if (args.length) this.args = args;
		return this
	}
	constructor(...arg) {//同于set方法
		this.set(...arg);
	}
	run(str) {//以字符串形式连续加减运算后返回this
		let temp = '', flag = true;
		for (const it of str) {
			switch (it) {
				case '+':
					flag = true;
					break;
				case '-':
					flag = false;
					break;
				case 'n':
					this.dateObj.n += flag ? +temp : -temp;
					temp = '';
					break;
				case 'y':
					this.dateObj.y += flag ? +temp : -temp;
					temp = '';
					break;
				case 'r':
					this.dateObj.r += flag ? +temp : -temp;
					temp = '';
					break;
				case 's':
					this.dateObj.s += flag ? +temp : -temp;
					temp = '';
					break;
				case 'f':
					this.dateObj.f += flag ? +temp : -temp;
					temp = '';
					break;
				case 'm':
					this.dateObj.m += flag ? +temp : -temp;
					temp = '';
					break;
				case 'h':
					this.dateObj.h += flag ? +temp : -temp;
					temp = '';
					break;
				default:
					temp += it
			}
		};
		return this.upDate();
	}
	runThis(call) {//执行回调后返回this
		if (typeof call === 'function') {
			call(this);
			return this
		} else {
			return this.run(call)
		}
	}
	runDate(call) {//执行回调后返回Date对象(非$date对象)
		return this.runThis(call).date
	}

	add(date, type) {
		//当前时间加传入时间戳,返回值取决于type, type=='n'返回相差年数,type=='y'返回相差月数,依次类推
		//type有值时此操作不影响this.date ,type无值时此操作设置新this.date值
		if (type === undefined) {
			return to((temp) => {
				return this.set(temp);
			}, +this.date + date)
		} else {
			return to(type, +this.date + date)
		}
	}
	sub(date, type) {
		//当前时间减传入时间戳,返回值取决于type, type=='n'返回相差年数,type=='y'返回相差月数,依次类推
		//type有值时此操作不影响this.date ,type无值时此操作设置新this.date值
		if (type === undefined) {
			return to((temp) => {
				return this.set(temp);
			}, +this.date - date)
		} else {
			return to(type, +this.date - date)
		}
	}
	addObj(date, type) {//当前时间加传入时间(非$date对象会先转为$date对象),返回值取决于type, type=='n'返回相差年数,type=='y'返回相差月数,依次类推
		switch (type) {
			case 'n':
				return this.dateObj.n + new $date(date, type).dateObj.n;
			case 'y':
				const obj = new $date(date, type).dateObj;
				return 12 * (this.dateObj.n + obj.n) + (this.dateObj.y + obj.y);
			default:
				switch (type) {
					case 'r':
						return (+this.trimDate('nyr') + +new $date(date).trimDate('nyr')) / 86400000;
					case 's':
						return (+this.trimDate('nyrs') + +new $date(date).trimDate('nyr')) / 3600000;
					case 'f':
						return (+this.trimDate('nyrsf') + +new $date(date).trimDate('nyr')) / 60000;
					case 'm':
						return (+this.trimDate('nyrsfm') + +new $date(date).trimDate('nyr')) / 1000;
					default:
						return +this.trimDate('nyrsfm') + +new $date(date).trimDate('nyr');
				}
		}
	}
	subObj(date, type) {//当前时间减传入时间(非$date对象会先转为$date对象),返回值取决于type, type=='n'返回相差年数,type=='y'返回相差月数,依次类推
		switch (type) {
			case 'n':
				return this.dateObj.n - new $date(date, type).dateObj.n;
			case 'y':
				const obj = new $date(date, type).dateObj;
				return 12 * (this.dateObj.n - obj.n) + (this.dateObj.y - obj.y);
			default:
				switch (type) {
					case 'r':
						return (+this.trimDate('nyr') - +new $date(date).trimDate('nyr')) / 86400000;
					case 's':
						return (+this.trimDate('nyrs') - +new $date(date).trimDate('nyr')) / 3600000;
					case 'f':
						return (+this.trimDate('nyrsf') - +new $date(date).trimDate('nyr')) / 60000;
					case 'm':
						return (+this.trimDate('nyrsfm') - +new $date(date).trimDate('nyr')) / 1000;
					default:
						return +this.trimDate('nyrsfm') - +new $date(date).trimDate('nyr');
				}
		}
	}
	times(mul = 1000) {//返回时间戳,参数决定返回的时间戳除以几,默认除以1000
		return Math.trunc(this.date / mul)
	}

	eq(date, option) {//先将date转为$date对象,然后判断当前对象时间是否等于传入的时间
		//option为比较程度, 如option='n'时只比较年,option='y'时只比较年月,option='r'时只比较年月日,依次类推
		if (!(date instanceof $date)) {
			date = new $date(date)
		}
		const type = typeof option;
		if (type === 'string') {
			for (const op of option) {
				switch (op) {
					case 'n':
						if (this.dateObj.n === date.dateObj.n) break;
						else return false;
					case 'y':
						if (this.dateObj.y === date.dateObj.y) break;
						else return false;
					case 'r':
						if (this.dateObj.r === date.dateObj.r) break;
						else return false;
					case 's':
						if (this.dateObj.s === date.dateObj.s) break;
						else return false;
					case 'f':
						if (this.dateObj.f === date.dateObj.f) break;
						else return false;
					case 'm':
						if (this.dateObj.m === date.dateObj.m) break;
						else return false;
					case 'h':
						if (this.dateObj.h === date.dateObj.h) break;
						else return false;
				}
			}
			return true;
		} if (type === 'number') {
			return this.times(option) === date.times(option)
		} else {
			return +this.date === +date.date
		}
	}
	gt(date, option) {//先将date转为$date对象,然后判断当前对象时间是否大于传入的时间
		//option为比较程度, 如option='n'时只比较年,option='y'时只比较年月,option='r'时只比较年月日,依次类推
		if (!(date instanceof $date)) {
			date = new $date(date)
		}
		const type = typeof option;
		if (type === 'string') {
			for (const op of option) {
				switch (op) {
					case 'n':
						if (this.dateObj.n > date.dateObj.n) {
							return true;
						} else if (this.dateObj.n === date.dateObj.n) {
							break;
						} else return false;
					case 'y':
						if (this.dateObj.y > date.dateObj.y) {
							return true;
						} else if (this.dateObj.y === date.dateObj.y) {
							break;
						} else return false;
					case 'r':
						if (this.dateObj.r > date.dateObj.r) {
							return true;
						} else if (this.dateObj.r === date.dateObj.r) {
							break;
						} else return false;
					case 's':
						if (this.dateObj.s > date.dateObj.s) {
							return true;
						} else if (this.dateObj.s === date.dateObj.s) {
							break;
						} else return false;
					case 'f':
						if (this.dateObj.f > date.dateObj.f) {
							return true;
						} else if (this.dateObj.f === date.dateObj.f) {
							break;
						} else return false;
					case 'm':
						if (this.dateObj.m > date.dateObj.m) {
							return true;
						} else if (this.dateObj.m === date.dateObj.m) {
							break;
						} else return false;
					case 'h':
						if (this.dateObj.h > date.dateObj.h) {
							return true;
						} else if (this.dateObj.h === date.dateObj.h) {
							return false;
						} else return false;
				}
			}
			return false;
		} if (type === 'number') {
			return this.times(option) > date.times(option)
		} else {
			return +this.date > +date.date
		}
	}
	lt(date, option) {//先将date转为$date对象,然后判断当前对象时间是否小于传入的时间
		//option为比较程度, 如option='n'时只比较年,option='y'时只比较年月,option='r'时只比较年月日,依次类推
		if (!(date instanceof $date)) {
			date = new $date(date)
		}
		const type = typeof option;
		if (type === 'string') {
			for (const op of option) {
				switch (op) {
					case 'n':
						if (this.dateObj.n < date.dateObj.n) {
							return true;
						} else if (this.dateObj.n === date.dateObj.n) {
							break;
						} else return false;
					case 'y':
						if (this.dateObj.y < date.dateObj.y) {
							return true;
						} else if (this.dateObj.y === date.dateObj.y) {
							break;
						} else return false;
					case 'r':
						if (this.dateObj.r < date.dateObj.r) {
							return true;
						} else if (this.dateObj.r === date.dateObj.r) {
							break;
						} else return false;
					case 's':
						if (this.dateObj.s < date.dateObj.s) {
							return true;
						} else if (this.dateObj.s === date.dateObj.s) {
							break;
						} else return false;
					case 'f':
						if (this.dateObj.f < date.dateObj.f) {
							return true;
						} else if (this.dateObj.f === date.dateObj.f) {
							break;
						} else return false;
					case 'm':
						if (this.dateObj.m < date.dateObj.m) {
							return true;
						} else if (this.dateObj.m === date.dateObj.m) {
							break;
						} else return false;
					case 'h':
						if (this.dateObj.h < date.dateObj.h) {
							return true;
						} else if (this.dateObj.h === date.dateObj.h) {
							return false;
						} else return false;
				}
			}
			return false;
		} if (type === 'number') {
			return this.times(option) < date.times(option)
		} else {
			return +this.date < +date.date
		}
	}
	static eq(date, option) {//先将date转为$date对象,然后判断当前系统时间是否等于传入的时间
		return new $date().eq(date, option)
	}
	static gt(date, option) {//先将date转为$date对象,然后判断当前系统时间是否大于传入的时间
		return new $date().gt(date, option)
	}
	static lt(date, option) {//先将date转为$date对象,然后判断当前系统时间是否小于传入的时间
		return new $date().lt(date, option)
	}

	format(...args) { //设置toString的默认参数
		this.args = args;
		return this
	}
	toString(...args) { //格式化当前对象时间为指定字符串,其中'nyrsfmh'分别表示'年月日时分秒毫秒',大写则表示始终填充为两位, 如 'n-Y-r s:f:M' 会产生 '2022-01-1 1:1:01'这样的字符串
		if (Array.isArray(args[0])) {
			return timeStr(this.date, String.raw(...args))
		} else return timeStr(this.date, ...(args.length ? args : this.args))
	}
	static toString(...args) {//格式化当前系统时间为指定字符串,其中'nyrsfmh'分别表示'年月日时分秒毫秒',大写则表示始终填充为两位, 如 'n-Y-r s:f:M' 会产生 '2022-01-1 1:1:01'这样的字符串
		return new $date().toString(...args)
	}

	trimDate(...args) {/**
	修剪时间,以'nyrsfmh'指定保存当前对象时间的'年月日时分秒毫秒'那些保留那些初始化那些设置成其他值
	如: trimDate('nyr12s') 表示年月日不变, 小时设置为12时, 分秒毫秒设置为0 (无前缀'!'设置之后指定的保留)
	如: trimDate('!12s') 表示年月日分秒毫秒不变, 小时设置为12时 (前缀'!'之后未指定的保留)

	字符串可连写加减操作,如 trimDate('!12s+2r1s') 表示小时设置为12时之后,加2日1时 

	第二参数可指定返回值, 传入数值则用于调用 this.times 返回时间戳;传入字符串则用于调用 this.toString 返回格式化字符串
	*/
		let option, toStr, isNum, temp = "", options, flag;
		if (Array.isArray(args[0])) {
			option = String.raw(...args);
		} else {
			[option, toStr] = args;
			isNum = typeof toStr === 'number';
		}

		const date = { n: undefined, y: undefined, r: undefined, s: undefined, f: undefined, m: undefined, h: undefined };
		let opIndex;
		label: for (const index in option) {
			const it = option[index];
			switch (it) {
				case '!':
					flag = true;
					break;
				case '+':
				case '-':
					opIndex = index;
					options = option.slice(index);
					break label;
				case 'n':
				case 'N':
					date.n = +temp || (temp ? 0 : this.date.getFullYear());
					temp = '';
					break;
				case 'y':
				case 'Y':
					date.y = +temp || (temp ? 0 : this.date.getMonth() + 1);
					temp = '';
					break;
				case 'r':
				case 'R':
					date.r = +temp || (temp ? 0 : this.date.getDate());
					temp = '';
					break;
				case 's':
				case 'S':
					date.s = +temp || (temp ? 0 : this.date.getHours());
					temp = '';
					break;
				case 'f':
				case 'F':
					date.f = +temp || (temp ? 0 : this.date.getMinutes());
					temp = '';
					break;
				case 'm':
				case 'M':
					date.m = +temp || (temp ? 0 : this.date.getSeconds());
					temp = '';
					break;
				case 'h':
				case 'H':
					date.h = +temp || (temp ? 0 : this.date.getMilliseconds());
					temp = '';
					break;
				default:
					temp += it
			}
		};
		if (opIndex === '0') {
			return isNum
				? this.run(options).times(toStr)
				: toStr
					? this.run(options).toString(toStr)
					: this.run(options).date
		} else if (flag) {//部分设置
			if (date.n === undefined) date.n = this.date.getFullYear();
			if (date.y === undefined) date.y = this.date.getMonth() + 1;
			if (date.r === undefined) date.r = this.date.getDate();
			if (date.s === undefined) date.s = this.date.getHours();
			if (date.f === undefined) date.f = this.date.getMinutes();
			if (date.m === undefined) date.m = this.date.getSeconds();
			if (date.h === undefined) date.h = this.date.getMilliseconds();
		} else {//重新设置
			if (date.n === undefined) date.n = 0;
			if (date.y === undefined) date.y = 1;
			if (date.r === undefined) date.r = 1;
			if (date.s === undefined) date.s = 0;
			if (date.f === undefined) date.f = 0;
			if (date.m === undefined) date.m = 0;
			if (date.h === undefined) date.h = 0;
		}
		return options
			? isNum
				? this.set(date).run(options).times(toStr)
				: toStr
					? this.set(date).run(options).toString(toStr)
					: this.set(date).run(options).date
			: isNum
				? this.set(date).times(toStr)
				: this.set(date).date
	}
	static trimDate(...args) {//修剪当前系统时间
		return new $date().trimDate(...args)
	}
	static times(mul) {//返回当前系统时间戳
		return new $date().times(mul)
	}

	*[Symbol.iterator]() {//服务于展开操作
		yield this.dateObj.n;
		yield this.dateObj.y;
		yield this.dateObj.r;
		yield this.dateObj.s;
		yield this.dateObj.f;
		yield this.dateObj.m;
		yield this.dateObj.h;
	}
	[Symbol.toPrimitive](hint) {//触发自动转原始值时调用
		switch (hint) {
			case 'number':
				return +this.date;
			case 'default':
			case 'string':
				return this.toString();
		}
	}
	match(Rexg, ...args) {//匹配当前时间字符串
		return this.toString(...args).match(Rexg)
	}
	split(string, ...args) {//切分当前时间字符串
		return this.toString(...args).split(string)
	}
	search(string, ...args) {//搜索当前时间字符串
		return this.toString(...args).search(string);
	}
}
// console.log(new $date().trimDate('nyr12S0F0M+1s1f1m', 'n-y-r s:f:m'))
//2022-11-7 13:1:1

/**
 * 将时间戳转为时间对象
 * @param {*} date 时间戳或时间对象
 * @param {*} smul 附加配置对象
 * 	smul为数字时:
 * 		表示前后端时间戳倍数,若参数d为时间对象则此变量无用,否则优先取传入值,默认则判断传入的时间戳大写自动设置为1或1000
 * 	smul为数组时:
 * 		数组第一项为左边附加字符串	
 * 		数组第二项为右边附加字符串
 * 		数组第三项为前后端时间戳倍数,与smul为数字时描述一致
 * 		数组首项其为true时,则将数组第一项附加到结果左边,将数组第二项附加到结果右边
 * @param {*} callback 回调对象
 * @param {*} options 配置对象
 * 	其格式如 "n年y月r日s时f分m秒"
 * 	  以拼音首字母关联时间单位,首字母后的字符作为其单位
 * 		字母大写时表示数值始终填充为两位,字母小写时数值原样放置在单位前
 * @returns { {con:boolean, left?:string, right?:string, d:Date} }
 */
function parseDate(date, smul, callback, options) {
	const notDate = !(date instanceof Date);
	let con, left, right;
	if (Array.isArray(smul)) {
		({ left='', right='' } = smul);
		con = smul[0] || smul[1];
		if (notDate) {
			date = new Date(date * (smul[2] || (isTimes(date) ? 1 : 1000)))
		}
	} else if (notDate) {
		date = new Date(date * (smul || (isTimes(date) ? 1 : 1000)))
	};
	return callback({ options, con, left, right, date })
}

/**
 * 时间回调
 * @param {*} date 时间戳或时间对象
 * @param {*} text 时间为空时显示的文字
 * @param {*} callback 回调函数
 * @param  {...any} args 回调函数参数
 * @returns 
 */
export function dateTran(date, text, callback, ...args) {
	return date ? callback(date, ...args) : text || ""
}

/**
 * 时间格式化(内置版)
 * @param {{ options:string,con:boolean, left?:string, right?:string, date:Date }} param0 
 * { 
 * options:格式如 "n年y月r日s时f分m秒", 以拼音首字母关联时间单位, 首字母后的字符作为其单位,字母大写时表示数值始终填充为两位,字母小写时数值原样放置在单位前
 * con:是否有附加字符串, 
 * left:左边附加字符串, 
 * right:右边附加字符串, 
 * date:时间对象
 * }
* @returns {string} 时间字符串 
 */
export function dateToStr({ options, con, left, right, date }) {
	const dateTemp = [];
	let temp;
	for (const it of options) {
		switch (it) {
			case 's':
				dateTemp.push(date.getHours());
				break;
			case 'f':
				dateTemp.push(date.getMinutes());
				break;
			case 'm':
				dateTemp.push(date.getSeconds());
				break;
			case 'n':
				dateTemp.push(date.getFullYear());
				break;
			case 'y':
				dateTemp.push(date.getMonth() + 1);
				break;
			case 'r':
				dateTemp.push(date.getDate());
				break;

			case 'S':
				temp = date.getHours();
				if (temp < 10) temp = '0' + temp;
				dateTemp.push(temp);
				break;
			case 'F':
				temp = date.getMinutes();
				if (temp < 10) temp = '0' + temp;
				dateTemp.push(temp);
				break;
			case 'M':
				temp = date.getSeconds();
				if (temp < 10) temp = '0' + temp;
				dateTemp.push(temp);
				break;
			case 'N':
				temp = date.getFullYear();
				dateTemp.push(temp);
				break;
			case 'Y':
				temp = date.getMonth() + 1;
				if (temp < 10) temp = '0' + temp;
				dateTemp.push(temp);
				break;
			case 'R':
				temp = date.getDate();
				if (temp < 10) temp = '0' + temp;
				dateTemp.push(temp);
				break;
			default:
				dateTemp.push(it);//当作单位直接追加到后面
		}
	};
	const datestr = dateTemp.join('');
	return con ? left + datestr + right : datestr;
}

/**
 * 时间格式化
 * @param {*} date 时间戳或时间对象
 * @param {*} text 时间为空时显示的文字
 * @param {*} options 配置对象
 * 	其格式如 "n年y月r日s时f分m秒"
 * 	  以拼音首字母关联时间单位,首字母后的字符作为其单位
 * 		字母大写时表示数值始终填充为两位,字母小写时数值原样放置在单位前
 * @param {*} smul 附加配置对象
 * 	smul为数字时:
 * 		表示前后端时间戳倍数,若参数d为时间对象则此变量无用,否则优先取传入值,默认则判断传入的时间戳大写自动设置为1或1000
 * 	smul为数组时:
 * 		数组第一项为左边附加字符串	
 * 		数组第二项为右边附加字符串
 * 		数组第三项为前后端时间戳倍数,与smul为数字时描述一致
 * 		数组首项其为true时,则将数组第一项附加到结果左边,将数组第二项附加到结果右边
 * @returns {string} 时间字符串
 */
export function formatDate(date, text, options, smul) {
	return dateTran(date, text, parseDate, smul, dateToStr, options)
}

/**
 * 时间美化
 * @param {*} date 时间戳或时间对象
 * @param {*} text 时间为空时显示的文字
 * @param {*} options 配置对象
 * 	其格式如 "n年y月r日s时f分m秒"
 * 	  以拼音首字母关联时间单位,首字母后的字符作为其单位
 * 		字母大写时表示数值始终填充为两位,字母小写时数值原样放置在单位前
 * @param {*} smul 附加配置对象
 * 	smul为数字时:
 * 		表示前后端时间戳倍数,若参数d为时间对象则此变量无用,否则优先取传入值,默认则判断传入的时间戳大写自动设置为1或1000
 * 	smul为数组时:
 * 		数组第一项为左边附加字符串	
 * 		数组第二项为右边附加字符串
 * 		数组第三项为前后端时间戳倍数,与smul为数字时描述一致
 * 		数组首项其为true时,则将数组第一项附加到结果左边,将数组第二项附加到结果右边
 * @returns {string} 月日时分
 */
export function formatTime(date, text, options = 'Y月R日S时F分', smul) {
	return dateTran(date, text, parseDate, smul, ({ con, left, right, date }) => {
		const diff = (date - Date.now()) / 1000;
		if (diff < 30) {
			return '刚刚'
		}
		if (diff < 3600) {
			return Math.ceil(diff / 60) + '分钟前'
		}
		if (diff < 3600 * 24) {
			return Math.ceil(diff / 3600) + '小时前'
		}
		if (diff < 3600 * 24 * 2) {
			return '1天前'
		}
		return dateToStr({ options, con, left, right, date })
	})
}