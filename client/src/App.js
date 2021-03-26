import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Container } from 'semantic-ui-react'



import 'semantic-ui-css/semantic.min.css';
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import MenuBar from './Components/MenuBar'
import SinglePost from './Pages/SinglePost'
import {AuthProvider} from './context/auth'
import AuthRoute from './util/AuthRoute';

function App() {
  return (
    <Container>
            <AuthProvider>
      <Router>
          <MenuBar/>
          <AuthRoute exact path='/login' component={Login}/>
          <AuthRoute exact path='/register' component={Register}/>
          <Route exact path='/' component={Home}/>  
          <Route exact path='/posts/:postId' component={SinglePost}/>
      </Router>
      </AuthProvider>
    </Container>

   
      );
}

export default App;
