# ExRegExp
支持在正则表达式中插入函数和引用函数的增强正则表达式

## 示例

```javascript
const obj = exReg({
  reg: /ersd[[m=reg:(ka)+]].*ef(fa){[[m]]}.*sas/g, //可选，创建时未传入则生成后需要通过 obj.reg 设置后调用方法才有效。
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
```

## 插入正则函数

### 标记与函数不同名

语法: `[[mark=func:regExp]]`
描述: 插入到正则中的格式,可捕获正则匹配相应部分的结果,返回值以标记作为键名存入到标记值库
示例：顶部js中, `options.reg`里的`[[m=reg:(ka)+]]`就是标记与函数不同名的正则函数, 他以`(ka)+`的匹配结果作为参数调用`options.fns.reg`结果存入标记库的`m`键上

### 标记与函数同名

语法: `[[func:regExp]]`
描述: 插入到正则中的格式,可捕获正则匹配相应部分的结果,返回值以标记作为键名存入到标记值库
示例：顶部js中, `obj.reg`里的`[[reg:(ka)+]]`就是标记与函数同名的正则函数, 他以`(ka)+`的匹配结果作为参数调用`options.fns.reg`结果存入标记库的`reg`键上

## 插入函数结果

语法: `[[mark]]`
描述: 可从标记值库中读取相应值插入到其所在位置代替占位标记,若标记值库中没有结果,而fns中有相应函数则无参调用这个函数返回值替换,未存在于fns的函数的键,采用默认标记函数
示例：顶部js中, `options.reg`里的`[[m]]`是向正则中插入标记库的`m`键上的值,`obj.reg`里的`[[reg]]`是向正则中插入标记库的`reg`键上的值