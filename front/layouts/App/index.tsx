import React from 'react';
import loadable from '@loadable/component'; // code splitting
import { Switch, Route, Redirect } from 'react-router-dom';

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;

// Redirect는 다른 페이지로 돌려주는 역할. 즉, 주소가 /(path)로 끝나면 login(to)로 옮겨줌
