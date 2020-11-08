import React from 'react';
import { Layout, Menu } from 'antd';
import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';
import MentorshipForm from './components/MentorshipForm';
import Login from './components/Login';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">
              <NavLink to="/signup-form">Signup Form</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/login">Login</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Switch>
            <Route exact path="/signup-form" component={MentorshipForm} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          MentorMatch ©2020 Created by UBCO students
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
