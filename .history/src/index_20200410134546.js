import React, { component } from 'react';
import ReactDOM from 'react-dom';
import login from './component/login/Login';
import Index from './index1';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';



ReactDOM.render(
    <Router history={browserHistory} >
        <Route path="/data" component={Index} />
        <Route path="/" component={login} />
    </Router>, document.getElementById('root')
);