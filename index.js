import exReg from "./utils/public/ExReg";
//示例：
const obj = exReg({
  reg: /ersd[[reg:(ka)+]].*ef(fa){[[reg]]}.*sas/g, //可选，创建时未传入则生成后需要通过 obj.reg 设置后调用方法才有效。
  fns: {
    reg([$0, $1]) {
      const range0 = range($0.length / $1.length, 1, true);
      range0.reg = range0.map(it => new Array(it).fill($1).join(''));
      return range0
    }
  },
  str: 'bvgvgersdkakakaeffafaeffafafasaskuyfu' //可选，创建时未传入则生成后需要通过 obj.str 设置后调用方法才有效。
});
console.log('match1:', {
  match: obj.match(),//执行match方法
  reg: obj.reg
});
//match1: ['ersdkakakaeffafaeffafafasas', 'fa', index: 5, input: 'bvgvgersdkakakaeffafaeffafafasaskuyfu', groups: undefined]
obj.reg = /[[reg:(ka)+]]ef(fa){[[reg]]}/g; //动态更改增强正则表达式
console.log('match2:', {
  match: obj.match(),
  reg: obj.reg
});
//match2: ['kakaeffafa']