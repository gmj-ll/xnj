const tempcode =
`var request = require('request');
const Device = require('alibabacloud-iot-device-sdk').device;
var Myempty = require('gmj');

const access_token = '[Your access_token]';
Myempty.device = Device({
  productKey: '[Your productKey]',
  deviceName: '[Your deviceName]',
  deviceSecret: '[Your deviceSecret]'
});

const device = Myempty.device;
var Temperature = 100,Humidity=100;
try{
  device.on('connect', () => {
    console.log('connected!');
  });

}catch(error){
  console.error(error);
  return;
}

function randomNum(minNum,maxNum){ 
  switch(arguments.length){ 
      case 1: 
          return parseInt(Math.random()*minNum+1,10); 
      break; 
      case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
      break; 
          default: 
              return 0; 
          break; 
  } 
} 




function connectMysql(){
  request('http://www.fahzu.com/api/addcat.php?Temperature='+Temperature+'&Humidity='+Humidity, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 打印获取到的数据，这里输出10
    }
  }) 
}

function connectdingTalk(){
  request('http://www.fahzu.com/api/dingTalk.php?Temperature='+Temperature+'&Humidity='+Humidity+'&access_token='+access_token, function (error, response, body) {
    if (!error && response.statusCode == 200 && !JSON.parse(body).errcode) {
      console.log("---上报钉钉群---") 
    }
    else{
      console.error("请输入正确的access_token"); 
    }
  }) 
}


function connectIot(){
  try {
        device.postProps({
          Temperature: Temperature,
          Humidity: Humidity
        }, (res) => {
          //console.log(res);
          console.log("当前温度:"+Temperature)
          console.log("当前湿度:"+Humidity)
          console.log("--------------------------")

        });
} catch (err) {
    console.error('[IoT hub Client] Connect error: ' + err.message);
    return;
}
}



function start(){
  Temperature = randomNum(-100,100);
  Humidity = randomNum(-100,100);
  connectIot();
  //connectMysql();
  connectdingTalk();
}

start();
setInterval(start, 5000);

`
const raw = {
  index: tempcode
}

var code = JSON.parse(JSON.stringify(raw));

const localStoragePrefix = 'rpiSimu';

localStorage.setItem(localStoragePrefix + 'index', tempcode);

codeFactory.getCode = function (name) {
  var value = localStorage.getItem(localStoragePrefix + name);
  if (value) {
    code[name] = value;
  }
  return code[name]
};

codeFactory.resetCode = function (name) {
  console.log(raw[name]);
  codeFactory.changeCode(name, raw[name]);
  return code[name];
}

codeFactory.getRunCode = function (name, replaces, prefix) {
  var result = code[name];

  for (var i = 0; i < replaces.length; i++) {
    var replace = replaces[i];
    result = result.replace(replace.src, 'replaces' + prefix + '.' + replace.dest);
  }
  return result;
}

codeFactory.changeCode = function (name, value) {
  code[name] = value;
  localStorage.setItem(localStoragePrefix + name, value);
}

export default function codeFactory() { };
