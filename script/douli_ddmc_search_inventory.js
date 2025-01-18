/**
 * @fileoverview Template to compose HTTP reqeuest.
 *
 * 兜礼叮咚买菜代金券库存查询
 * 
 * 1. MitM 添加 api.doooly.com
 * 2. 将此脚本添加到重写规则中，类型选择“script-response-body”、URL填写“https://api.doooly.com/pro_doooly/jersey/selfProduct/detail”，并开启此规则
 * 3. 打开“大华移动办公”->“福利平台”->“卡券专区”，选择“叮咚买菜100元卡券”进入详情
 * 4. 在重写规则中禁用此脚本
 * 5. 将此脚本添加到定时任务中
 * 
 * @version 2.0
 *
 * 2025/01/12 加强对请求失败的处理防止JS阻塞；增加更多的日志用于排查问题
 * 2025/01/19 2.0 动态获取认证信息
 * 
 */

const key = "douliDingdong";

if (typeof $request !== "undefined") {
    if ($request.headers) {
        $prefs.setValueForKey($request.headers, key);
        $notify("兜礼查询叮咚买菜卡券库存", "获取 Headers: 成功, 请禁用该脚本", "");
    }

    $done({ body: JSON.parse($response.body) });
} else {
    // 获取保存的 cookie
    const headersValueString = $prefs.valueForKey(key);
    const headersValue = JSON.parse(headersValueString);

    if (headersValue) {
        const timestamp = new Date().getTime();
        const url = `https://api.doooly.com/pro_doooly/jersey/selfProduct/detail?timestamp=${timestamp}`;
        const method = `POST`;
        const body = `{"productId":"1124","activityName":"","userId":"1063390"}`;
        const headers = {
            'Connection' : `keep-alive`,
            'Accept-Encoding' : `gzip, deflate, br`,
            'channel' : `h5`,
            'Content-Type' : `application/json;charset=utf-8`,
            'thirdPartyChannel' : `dahua`,
            'Origin' : `https://reach-life.com`,
            'User-Agent' : `${headersValue["User-Agent"]}`,
            'token' : `${headersValue["token"]}`,
            'Host' : `api.doooly.com`,
            'Referer' : `https://reach-life.com/`,
            'groupId' : `${headersValue["groupId"]}`,
            'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
            'Accept' : `application/json, text/plain, */*`
            };

        const myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: body,
            timeout: 30,
        };

        $task.fetch(myRequest).then(
            (response) => {
                let statusCode = response.statusCode;
                if (statusCode / 100 == 2) {
                    if (JSON.parse(response.body).code === "1000") {
                        const inventory = JSON.parse(response.body).data.skuList[0].inventory;
                        if (inventory > 0) {
                            $notify("查询兜礼叮咚买菜卡券库存", `剩余: ${inventory} 件`, "");
                        }
                    } else {
                        console.log(response.body);
                    }
                } else {
                    console.log(JSON.parse(response));
                }

                $done();
            },
            (reason) => {
                console.log(reason.error);
                $done();
            }
        );
    } else {
        $notify("查询兜礼叮咚买菜卡券库存", "获取 Headers: 失败, 请现在重写开启该脚本", "");
    }
}