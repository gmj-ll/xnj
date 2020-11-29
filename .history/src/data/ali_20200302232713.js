// const iot = require('alibabacloud-iot-device-sdk');
// const device = iot.device({
//   productKey: '<productKey>', //将<productKey>修改为实际产品的ProductKey
//   deviceName: '<deviceName>',//将<deviceName>修改为实际设备的DeviceName
//   deviceSecret: '<deviceSecret>',//将<deviceSecret>修改为实际设备的DeviceSecret
// });

// device.on('connect', () => {
//   //将<productKey> <deviceName>修改为实际值
//   console.log('connect successfully!');
// });


// var request = require("request");

// request('https://www.limumu.top/php/test.php?Temperature=10&Humidity=10', function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         console.log(body) // 打印获取到的数据，这里输出10
//       }
//     }) 


//https://oapi.dingtalk.com/robot/send?access_token=8f5d6d8d8111b87549e10cbf76d4faf79b6419cd9cf9f119e719481dbe265cfa


//const ChatBot = require('dingtalk-robot-sender');
// // 直接使用 webhook
// const robot = new ChatBot({
//   webhook: 'https://oapi.dingtalk.com/robot/send?access_token=8f5d6d8d8111b87549e10cbf76d4faf79b6419cd9cf9f119e719481dbe265cfa'
// });

// 组合 baseUrl 和 accessToken 如果采用加签方式的安全设置，同时填写secret
// const robot = new ChatBot({
//   baseUrl: 'https://oapi.dingtalk.com/robot/send',
//   accessToken: '8f5d6d8d8111b87549e10cbf76d4faf79b6419cd9cf9f119e719481dbe265cfa',
//   secret: 'SEC8a70c38346354a05431fb30f90cbc5c970638026c287dbbb6d6abd56b1daf872',
// });

// // 自定义 httpclient
// // const robot = new ChatBot({
// //   baseUrl: 'https://oapi.dingtalk.com/robot/send',
// //   accessToken: 'xxxxxxxxx',
// //   secret: 'xxxxxxxx',
// //   httpclient: require('urllib')
// // });


// let textContent = {
//   "msgtype": "markdown",
//   "markdown": {
//     "title": "温湿度传感器",
//     "text": "#### 温湿度传感器上报\n" +
//         "> 实时温度：" + 100 + "℃\n\n" +
//         "> 相对湿度：" + 100 + "%\n\n" +
//         "> ###### " + new Date() + " 发布  by [物联网套件](https://www.aliyun.com/product/iot) \n"
// },
//   "at": {
//     "isAtAll": false
//   }
// }
// robot.send(textContent)
//   .then((res) => {
//     // TODO
//   });




// request('http://47.111.177.25/api/dingTalk.php?Temperature=10&Humidity=10', function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         console.log(body) // 打印获取到的数据，这里输出10
//       }
//       else{
//         console.log(response.statusCode)
//       }
//     }) 



var request = require("request");

var url = 'http://47.111.177.25/api/login.php'
request({
  url: url,
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: {
    username: "test",
    password: "test",
  }
}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
  else {
    console.log(error)
  }
});




