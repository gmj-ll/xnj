// import { Client, Message } from 'azure-iot-device'
import { traceEvent } from './telemetry.js';
// import Protocol from './mqtt.js';


import iot from 'alibabacloud-iot-device-sdk';

import codeFactory from '../data/codeFactory.js';

import axios from 'axios'

import request from 'request'
// import BME280 from './bme280.js';





class Sample {
    constructor() {
        this.runningFunction = null;
        if (!window.oldSetTimeout) {
            window.timeoutList = new Array();
            window.intervalList = new Array();

            window.oldSetTimeout = window.setTimeout;
            window.oldSetInterval = window.setInterval;
            window.oldClearTimeout = window.clearTimeout;
            window.oldClearInterval = window.clearInterval;

            window.setTimeout = function (code, delay) {
                var retval = window.oldSetTimeout(code, delay);
                window.timeoutList.push(retval);
                return retval;
            };
            window.clearTimeout = function (id) {
                var ind = window.timeoutList.indexOf(id);
                if (ind >= 0) {
                    window.timeoutList.splice(ind, 1);
                }
                var retval = window.oldClearTimeout(id);
                return retval;
            };
            window.setInterval = function (code, delay) {
                var retval = window.oldSetInterval(code, delay);
                window.intervalList.push(retval);
                return retval;
            };
            window.clearInterval = function (id) {
                var ind = window.intervalList.indexOf(id);
                if (ind >= 0) {
                    window.intervalList.splice(ind, 1);
                }
                var retval = window.oldClearInterval(id);
                return retval;
            };
            window.clearAllTimeouts = function () {
                for (var i in window.timeoutList) {
                    window.oldClearTimeout(window.timeoutList[i]);
                }
                window.timeoutList = new Array();
            };
            window.clearAllIntervals = function () {
                for (var i in window.intervalList) {
                    window.oldClearInterval(window.intervalList[i]);
                }
                window.intervalList = new Array();
            };
        }
        this.actualClient = null;
    }

    stop(option) {
        window.clearAllIntervals();
        window.clearAllTimeouts();
        window.device.end();
        option.ledSwitch(false)

    }

    run(option) {

        const Device = iot.device;

        let Myempty={}; 
        Myempty.device = "888";

        // const device = Device({
        //     productKey: 'a14nuw8EkLh',
        //     deviceName: 'alt1CjJ8OFPvn97vSAYt',
        //     deviceSecret: 'waUsaVuIRr8RwfpiPX8OypI3ii1v8m84'
        // });

        // a prefix of UUID to avoid name conflict, here just use a fix one
        const prefix = '76f98350';
        var replaces = [
            //     {
            //         src: /require\('wiring-pi'\)/g,
            //         dest: 'wpi'
            //     }, {
            //         src: /require\('azure-iot-device'\)\.Client/g,
            //         dest: 'Client'
            //     }, {
            //         src: /require\('azure-iot-device'\)\.Message/g,
            //         dest: 'Message'
            //     }, {
            //         src: /require\('azure-iot-device-mqtt'\)\.Mqtt/g,
            //         dest: 'Protocol'
            //     }, {
            //         src: /require\('bme280-sensor'\)/g,
            //         dest: 'BME280'
            //     }, {
            //         src: /console\.log/g,
            //         dest: 'msgCb'
            //     }, {
            //         src: /console\.error/g,
            //         dest: 'errCb'
            //     }
            {
                src: /require\('alibabacloud-iot-device-sdk'\)\.device/g,
                dest: 'Device'
            },
            {
                src: /require\('axios'\)/g,
                dest: 'axios'
            },
            {
                src: /console\.log/g,
                dest: 'msgCb'
            },
            {
                src: /console\.error/g,
                dest: 'errCb'
            },
            {
                src: /require\('request'\)/g,
                dest: 'request'
            },
            {
                src: /require\('gmj'\)/g,
                dest: 'device'
            },
            {
                src: /require\('wiring-pi'\)/g,
                dest: 'wpi'
            },
        ];
        //wpi.setFunc(option.ledSwitch);
        try {
            traceEvent('run-sample');
            var src = codeFactory.getRunCode('index', replaces, prefix);
            // this.runningFunction = new Function('replaces' + prefix, src);
            this.runningFunction = new Function('replaces' + prefix, src);
            this.runningFunction(
                {
                    Device:Device,
                    axios: axios,
                    device: Myempty,
                    request: request,
                    msgCb: option.onMessage,
                    errCb: option.onError,
                }
                //     {
                //     wpi: wpi,
                //     Client: ClientWrapper,
                //     Message: Message,
                //     Protocol: Protocol,
                //     BME280: BME280,
                //     msgCb: option.onMessage,
                //     errCb: option.onError
                // }
            );
            // if (src.search(/^((?!\/\/).)*setInterval/gm) < 0) {
            //     option.onFinish();
            // }
        } catch (err) {
            traceEvent('run-error', { error: err });
            option.onError(err.message || JSON.stringify(err));
            option.onFinish();
        }

        window.device = Myempty.device;

        option.ledSwitch(true)
    }
}

export default Sample;