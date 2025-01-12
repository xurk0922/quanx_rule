
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 * 兜礼叮咚买菜代金券库存查询
 * 
 * 2025/01/12 加强对请求失败的处理防止JS阻塞；增加更多的日志用于排查问题
 */

const token = "20d5fd089e78aa63225cb8326db3eb0f";
const timestamp = new Date().getTime()

const url = `https://api.doooly.com/pro_doooly/jersey/selfProduct/detail?timestamp=${timestamp}`;

console.log(`请求地址：${url}`)

const method = `POST`;
const headers = {
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'channel' : `h5`,
'Content-Type' : `application/json;charset=utf-8`,
'thirdPartyChannel' : `dahua`,
'Origin' : `https://reach-life.com`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
'token' : `${token}`,
'Host' : `api.doooly.com`,
'Referer' : `https://reach-life.com/`,
'groupId' : `542`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'Accept' : `application/json, text/plain, */*`
};
const body = `{"productId":"1124","activityName":"","userId":"1063390"}`;

console.log(`请求内容：${body}`);

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body,
    timeout: 30
};

$task.fetch(myRequest).then(response => {
    let statusCode = response.statusCode;
    if ( statusCode / 100 == 2) {
        if (JSON.parse(response.body).code === "1000") {
            const inventory = JSON.parse(response.body).data.skuList[0].inventory;
            if (inventory > 0) {
                $notify("兜礼叮咚买菜卡券", "有库存", `剩余: ${inventory} 件`);
            }
        } else {
            console.log(response.body);
        }
    } else {
        console.log(JSON.parse(response));
    }

    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
