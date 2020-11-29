import React, { Component } from 'react';
import { Router, Route, Link, hashHistory } from 'react-router'
import './css/style.css';
import xiaohui from '../../img/xiaohui.png';
import huizhang from './images/huizhang.jpg';
var request = require("request");

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      password: null,
    };
  }

  handelChangeUser(e) {
    this.setState({
      user: e.target.value
    })
  }
  handelChangePass(e) {
    this.setState({
      password: e.target.value
    })
  }

  componentDidMount() {
    document.querySelector('.content').classList.toggle('s--signup')
  }

  submitReg() {
    let url = 'http://47.111.177.25/api/registered.php'
    request({
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: {
        username: this.state.user,
        password: this.state.password,
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        if (body == 1) {
          var r = confirm("注册成功！");
          if (r == true) {
            document.querySelector('.content').classList.toggle('s--signup')
          }
          else {
            document.querySelector('.content').classList.toggle('s--signup')
          }
        }
        if (body == 0) {
          alert("此用户名已注册！");
        }
      }
      else {
        console.log(error)
      }
    });
  }


  submitLogin() {
    let url = 'http://47.111.177.25/api/login.php'
    request({
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: {
        username: this.state.user,
        password: this.state.password,
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        if (body == 1) {
          let url = window.location.href;
          window.location.href = url + "data?lang=zh-CN";
          localStorage.setItem("islogin", "true");
        }
        else {
          alert("账号或密码错误！");
        }
      }
      else {
        console.log(error)
      }
    });
  }
  render() {
    localStorage.setItem("islogin", "false");
    return (
      <div className="bg">
        <div className='content'>
          <div className="form  sign-in">
            <div className=""><h2>基于树莓派的云端物联网虚拟仿真实验平台</h2></div>
            <div className="gmj">
              <h3>欢迎回来</h3>
              <label>
                <span>账号</span>
                <input type="text" onChange={this.handelChangeUser.bind(this)} defaultValue={this.state.user} />
              </label>
              <label>
                <span>密码</span>
                <input type="password" onChange={this.handelChangePass.bind(this)} defaultValue={this.state.password} />
              </label>

              <div className="gmjbtn">
                <button type="button" className="submit" onClick={this.submitLogin.bind(this)}>登 录</button>
              </div>
            </div>
            {/* <div className="xiaohui">
              <img src={xiaohui}></img>
            </div> */}
          </div>
          <div className="sub-cont">
            <div className="img">
              <div className="img__text m--up">
                <h2>还未注册？</h2>
                <p>立即注册，进入虚拟平台！</p>
              </div>
              <div className="img__text m--in">
                <h2>已有帐号？</h2>
                <p>有帐号就登录吧，好久不见了！</p>
              </div>
              <div className="img__btn" onClick={this.componentDidMount}>
                <span className="m--up" >注 册</span>
                <span className="m--in" >登 录</span>
              </div>
            </div>
            <div className="form sign-up">
              <div className=""><h2>基于树莓派的云端物联网虚拟仿真实验平台</h2></div>
              <div className="gmj">
                <h3>立即注册</h3>

                <label>
                  <span>账号</span>
                  <input type="text" onChange={this.handelChangeUser.bind(this)} defaultValue={this.state.user} />
                </label>


                <label>
                  <span>密码</span>
                  <input type="password" onChange={this.handelChangePass.bind(this)} defaultValue={this.state.password} />
                </label>

                <div className="gmjbtn">
                  <button type="button" className="submit" >注 册</button>
                </div>
              </div>
              {/* <div className="xiaohui">
                <img src={xiaohui}></img>
              </div> */}
            </div>
          </div>
        </div>
        <div className="foot">
          <p>Copyright © 2019-2020  xjf@zufe.edu.cn All Rights Reserved.</p>
          <p>
            <a target="_blank" href="http://www.beian.miit.gov.cn/" className="myahref"><p className="myp">浙ICP备20002306号-1</p ></a >
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011802001970" className="myahref">< img src={huizhang} className="myimg" /><p className="myp">浙公网安备 33011802001970号</p ></a >
          </p>
          {/* <div className="mydiv">
            <a target="_blank" href=" " className="myahref">< img src={huizhang} className="myimg" /><p className="myp">浙公网安备 33011802001970号</p ></a >
          </div> */}
        </div>
      </div>
    );
  }
}


export default Login;
