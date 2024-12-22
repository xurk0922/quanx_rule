
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 * 兜礼叮咚买菜代金券库存查询
 */

const url = `https://api.doooly.com/pro_doooly/jersey/selfProduct/detail?timestamp=1705931040032`;
const method = `POST`;
const headers = {
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'channel' : `h5`,
'Content-Type' : `application/json;charset=utf-8`,
'thirdPartyChannel' : `dahua`,
'Origin' : `https://reach-life.com`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
'token' : `b7513171b73f9e85ea41413cd42d075a`,
'Host' : `api.doooly.com`,
'Referer' : `https://reach-life.com/`,
'groupId' : `542`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'Accept' : `application/json, text/plain, */*`
};
const body = `{"productId":"1124","activityName":"","userId":"1063390"}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body,
    timeout: 30
};

$task.fetch(myRequest).then(response => {
    // console.log(response.statusCode + "\n\n" + response.body);
    // console.log(typeof response.body);
    const inventory = JSON.parse(response.body).data.skuList[0].inventory;
    if (inventory > 0) {
        $notify("兜礼叮咚买菜卡券", "有库存", `剩余: ${inventory} 件`);
    }
    

    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
