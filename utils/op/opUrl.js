/**
 * @param {string} url
 * @param {Boolean} decode 是否解码
 * @returns {Object} 获取url参数对象
 */
export function getParam(url, decode) {
    if (!url) url = window.location.href;
    let search = url.split('?')[1];
    if (!search) {
        return {}
    }
    return Object.fromEntries(search.split('&').map(
        decode ?
            it => {
                const list = it.split('=');
                return [list[0], decodeURIComponent(list[1])]
            }
            : it => it.split('=')
    ))
}

/**
 * @param {Array} json
 * @returns {String} 编码url参数
 */
export function setParam(json) {
    if (!json) return ''
    return Object.entries(json).map(it => it.map(it2 => encodeURIComponent(it2)).join('=')).join('&')
}

//webSocket
let
    reInter = 2000,//断开后2秒重连，为0就不重连
    reInterTimer,
    active,
    ws;
export function webSocketInit(url) {
    // if (!("WebSocket" in window)) {
    //     return alert("您的浏览器不支持 WebSocket!")
    // }
    return new Promise((re, rj) => {
        if (active) active.close()
        function creatWebSocket() {
            ws = active = new WebSocket(url)
        }
        creatWebSocket()
        ws.onopen = (imei) => {
            const obj = {
                auth: sessionStorage.getItem("auth"),
                imei
            }
            const str = JSON.stringify(obj)
            ws.send(str);
        };

        // 接收服务端数据时触发事件
        ws.onmessage = (evt) => {
            re && re(JSON.parse(evt))
        };
        //发生错误时
        ws.onerror = () => {
            if (reInter) {
                reInterTimer && clearTimeout(reInterTimer)
                reInterTimer = setTimeout(() => {
                    if (ws.readyState == 3 || ws.readyState == 2) creatWebSocket()
                }, reInter)
            }
        }
        // 断开 web socket 连接成功触发事件
        ws.onclose = (e) => {
            if (reInter) {
                reInterTimer && clearTimeout(reInterTimer)
                reInterTimer = setTimeout(() => {
                    if (ws.readyState == 3 || ws.readyState == 2) creatWebSocket()
                }, reInter)
            }
        };
    })
}