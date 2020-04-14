import React, { useContext } from 'react';
import { Route, Switch} from 'react-router-dom';
import { UserContext } from './providers/userProvider';

import './App.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';


function App() {

  let user = useContext(UserContext);

  if (user) {
    return (
        <div className='App'>
            <Switch>
                <Route exact path='/' component={Home} />
            </Switch>
        </div>
      
    );
  } else {
    return (
        <div className='App'>
            <Switch>
                <Route exact path='/' component={SignIn} />
                <Route path='/sign-up' component={SignUp} />
                <Route path='/password-reset' component={PasswordReset} />
            </Switch>
        </div>
    );
  }
}

export default App;
