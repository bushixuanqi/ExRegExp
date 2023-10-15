/**
 * 规则生成器
 * @param {object} data 转化前规则对象
 * data:{
        it1:'请输入字符串',
        it2:{
          trigger: ["blur", 'change'],
          required: true
        },
        it3:['请输入字符串', ["blur", 'change'], /\d+/, true],
        it4:['请输入字符串', ["blur"], 'includes', true],
        it5:['请输入字符串', function validator() { }, true],
        it6:['请输入字符串', 5, true]
 }
 * @param {object} formData 表单初始化对象，用于获取type设置type
 * @param {array<string>|string} trigger 触发方式
 * @returns {array} 转化后规则对象
 */
function genRule(data, formData, trigger = ["blur", 'change']) {
  for (let ix in data) {
    const obj = {
      required: true,
      trigger
    };

    //获取并设置类型
    obj.type = formData[ix] === null
      ? 'object'
      : formData[ix] === undefined
        ? 'number'
        : Array.isArray(formData[ix])
          ? 'array'
          : typeof formData[ix];

    //如果是字符串，则将其设置为提示信息
    if (typeof data[ix] === "string") {
      obj.message = data[ix];

      //如果是数组
    } else if (Array.isArray(data[ix])) {
      //则将数组第一项设置为提示信息
      obj.message = data[ix][0];
      let it = data[ix][1], required;
      //数组第二项如果是数组，则将其设置为触发方式数组
      if (Array.isArray(it)) {
        obj.trigger = it;
        it = data[ix][2];
        required = data[ix][3];
      } else {
        required = data[ix][2];
      }
      if (typeof required === 'boolean') obj.required = required;
      //剩下的项做如下处理
      if (it) {
        switch (it.constructor.name) {
          case 'RegExp':
            obj.pattern = it;
            break;
          case 'Function':
          case 'AsyncFunction':
            obj.validator = it; //validator(rule, value, callback)
            break;
          case 'Number':
            switch (obj.type) {
              case 'number':
                obj.validator = (rule, value) => value <= it;
                break;
              case 'array':
              case 'string':
                obj.validator = (rule, value) => value.length <= it;
                break;
              default:
                obj.validator = (rule, value) => value.length ? value.length <= it : value <= it; //validator(rule, value, callback)
            }
            break;
          case 'String':
            obj.validator = (rule, value) => value.includes(it)
            break;
        }
      }
      //否则将对象纸直接合并
    } else {
      Object.assign(obj, data[ix]);
    }
    data[ix] = obj;
  }
  return data;
}