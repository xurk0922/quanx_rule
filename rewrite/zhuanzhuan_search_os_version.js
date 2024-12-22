/**
 * 转转查询 iOS 系统版本是 15.4.1 的机器
 * 
 * @auther 徐荣坤
 * @version 3.0.0-beta
 * @use 
 * step1:
 * 在圈x配置文件中添加：
 * [rewrite_local]
 * https://app.zhuanzhuan.com/zz/transfer/search url script-response-body https://raw.githubusercontent.com/xurk0922/quanx_rule/refs/heads/main/zhuanzhuan_search_os_version.js
 * 
 * step2:
 * 修改 Cookie
 */
const limit = 1650;
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
    'Cookie': `referrerObj=%7B%22refpagetype%22%3A%22T2974%22%2C%22refpagequery%22%3A%22infoId%3D1784429970161210368%26metric%3D1JSKZv2YBoS48fydrKlAug16021ly3%26needHideShare%3D1%26quickStart%3D1%22%2C%22refsubpageID%22%3A%22%22%2C%22refsectionId%22%3A%22%22%2C%22refsortId%22%3A%22%22%7D; t=16; tk=a3607113726d8730ae0c0fb1dc4db5fd5959d780; zz_t=16; zzreferer=https%3A%2F%2Fm.zhuanzhuan.com%2Fu%2Fstreamline_detail%2Fnew-goods-detail; id58=CigAD2ZcSe5+py0zShl3Ag==; channel=; fromChannel=; PPU="TT=79b3aae38d96a12276fd0cdd273b997912955b12&UID=1651429357415411328&CT=1717324191934&SF=ZHUANZHUAN&SCT=1717327791934&V=2&ET=1719916191934&AP=16"; Version=1; Domain=zhuanzhuan.com; Max-Age=2592000; Expires=Tue, 02-Jul-2024 10:29:51 GMT;; Safe-PPU="TT=79b3aae38d96a12276fd0cdd273b997912955b12&UID=1651429357415411328&CT=1717324191934&SF=ZHUANZHUAN&SCT=1717327791934&V=2&ET=1719916191934&AP=16"; Version=1; Domain=zhuanzhuan.com; Max-Age=2592000; Expires=Tue, 02-Jul-2024 10:29:51 GMT;; app-apn=WIFI; app-clientip=2409:8929:b71:a3e4:8bb:ba06:2fcb:f74f; app-os=iOS; app-osv=16.5; app-resolution=1170x2532; brand=Apple; brandUpgradeAB=0; isoffline=0; lat=30.192878; lon=120.178687; model=iPhone13%2C2; officialVerifyUnifyAB=C; request_remove_latlon=0; uid=1651429357415411328; v=10.37.0; ZZ_SHOP_CHANNEL_ID=2001; h5checkin_channel=h5plpages_h5checkin_zzapp; zzVisitStack=%5B%7B%22type%22%3A%22onShow%22%2C%22href%22%3A%22m.zhuanzhuan.com%2Fu%2Fstreamline_detail%2Fnew-goods-detail%22%2C%22time%22%3A1717318090670%7D%2C%7B%22type%22%3A%22onShow%22%2C%22href%22%3A%22m.zhuanzhuan.com%252Fu%252Fb2c_list_page%252Flist%22%2C%22time%22%3A1717318093384%7D%5D; refsectionId=2004; refsortId=0; idzz=CigAD2ZLazgnwxk4CsstAg==`,
    'Content-Type': `application/x-www-form-urlencoded; charset=utf-8`,
    'Host': `app.zhuanzhuan.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 zzVersion/10.37.0 zzT/16 zzDevice/1_141.0_3.0 zzApp/58ZhuanZhuan`,
    'Referer': `http://m.zhuanzhuan.com/`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Sec-Fetch-Dest': `empty`,
    'Sec-Fetch-Site': `same-site`,
    'Sec-Fetch-Mode': `cros`
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const body = ``;

Promise.all(infos.map(async info => {
    await delay(3000);
    
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
                        info.title = `【😍${versionStr}】${info.title}`;
                    } else {
                        info.title = `【${versionStr}】${info.title}`;
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
    // 返回响应数据
    $done({ body: productList });
}, 5000);
