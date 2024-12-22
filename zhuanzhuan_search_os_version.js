/**
 * 转转查询 iOS 系统版本是 15.4.1 的机器
 * 
 * @auther 徐荣坤
 * @version 3.0.0-beta
 */

// 系统版本，要求 15.4.1
const limit = 165;
// 匹配形如 "iOS 15.6.1" 或 "iOS 15.6" 的字符串
const regex = /iOS (\d+\.\d+(\.\d+)?)/;

// 获取商品列表中的 infoId
const productList = JSON.parse($response.body);

const infos = productList.respData.infos ?? productList.respData.datas;

if (infos[0].infoId === "undefined") {
    // 返回响应数据
    $done({ body: productList });
}

const method = `GET`;
const headers = {
    'Accept': `application/json, text/plain, */*`,
    'Origin': `http://m.zhuanzhuan.com`,
    'Connection': `keep-alive`,
    'Cookie': `PPU="TT=062cd6a382867a5ac6ea22f5302db5ca89d44029&UID=1651429357415411328&CT=1682746113249&SF=ZHUANZHUAN&SCT=1682749713249&V=2&ET=1685338113249&AP=16"; Safe-PPU="TT=062cd6a382867a5ac6ea22f5302db5ca89d44029&UID=1651429357415411328&CT=1682746113249&SF=ZHUANZHUAN&SCT=1682749713249&V=2&ET=1685338113249&AP=16"; Version=1; Domain=zhuanzhuan.com; Max-Age=2592000; Expires=Mon, 29-May-2023 06:00:03 GMT;; app-apn=4G; app-clientip=2409:8929:568:2798:1c73:d087:a74f:df9f; app-os=iOS; app-osv=16.3.1; app-resolution=1170x2532; brand=Apple; brandUpgradeAB=0; isoffline=1; lat=30.32596201332769; lon=120.34330204555684; model=iPhone13%2C2; t=16; tk=a3607113726d8730ae0c0fb1dc4db5fd5959d780; uid=1651429357415411328; v=10.10.0; zz_t=16; id58=CigAAmRMsmNRRj/oBn7xAg==; expires=1682834313145; from=2^E1007^128^4^%E5%95%86%E5%93%81; referrerObj={"refpagetype":"T2974","refpagequery":"infoId=1634894584261448706&metric=XMHvUFuLEJmbMxLuVzIGUA14299cn&needHideShare=1&quickStart=1","refsubpageID":"","refsectionId":"","refsortId":""}; zpm=2^E1007^128^4^%E5%95%86%E5%93%81; zzreferer=http%3A%2F%2Fm.zhuanzhuan.com%2Fu%2Fstreamline_detail%2Fnew-goods-detail; zzVisitStack=[{"type":"load","href":"m.zhuanzhuan.com%2Fu%2Fnode_ssr_bm%2Fhome","time":1682746117944},{"type":"load","href":"m.zhuanzhuan.com%2Fu%2Fnode_ssr_bm%2Fpublish","time":1682746118818}]; h5checkin_channel=h5plpages_h5checkin_zzapp; zlj_group_id=13; idzz=CigADGRJxJ8YcT/+Fqu3Ag==`,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Host': `app.zhuanzhuan.com`,
    'Csrf-Token': `062cd6a382867a5ac6ea22f5302db5ca89d44029`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 zzVersion/10.10.0 zzT/16 zzDevice/1_141.0_3.0 zzApp/58ZhuanZhuan`,
    'Referer': `http://m.zhuanzhuan.com/`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    'Accept-Encoding': `gzip, deflate, br`
};

const body = ``;

Promise.all(infos.map(info => {
    
    const url = `https://app.zhuanzhuan.com/zzopen/waresshow/moreInfo?infoId=${info.infoId}&orderId=&requestType=1&searchFrom=&quickStart=1&version=&t=&ip=&uid=`;
    const myRequest = {
        url: url,
        method: method,
        headers: headers,
        body: body
    };
    return $task.fetch(myRequest).then(res => {
        var params = JSON.parse(res.body).respData.report.params;
        if (typeof params !== "undefined") {
            params.forEach(param => {
                if (param.key === "系统版本") {
                    var version = param.value;
                    const matchResult = version.split(" ");
                    const versionStr = matchResult[1];
                    var versionNum = parseFloat(versionStr.replace(/\./g, ''));



                    if (String(versionNum).length === 3) {
                        versionNum *= 10;
                    }

                    if (versionNum <= limit) {
                        // 发送通知
                        // $notify("转转中查找可越狱设备", "存在系统版本<= 15.4.1 的机子", `系统版本为：${versionStr}，标题为：${info.title}`);
                        // 修改标题
                        info.title = `【${versionStr}】${info.title}`;
                        // 收藏
                        console.log(`存在系统版本<= 15.4.1 的机子，系统版本为：${version}，标题为：${info.title}`);
                    } else {
                        // info.title = `${version} ${info.title}`;
                        info.title = "";
                    }
                }
            });
        }
        return info;
    });
})).then(updatedInfos => {
    // 更新商品列表中的信息
    productList.respData.infos = updatedInfos;
    // 返回响应数据
    $done({ body: JSON.stringify(productList) });
}).catch(reason => {
    console.log(reason.error);
});

setTimeout(() => {
    // $notify("转转查 15.4.1 转转中查找可越狱设备", "查询结束", `共查询 ${infos.length} 件`);
    console.log(`查询结束，共查询 ${infos.length} 件`);

    // 返回响应数据
    $done({ body: productList });
}, 5000);
