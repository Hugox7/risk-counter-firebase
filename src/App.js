import React, { useContext } from 'react';
import { Route, Switch} from 'react-router-dom';
import { UserContext } from './providers/userProvider';

import './App.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';
import User from './components/User';
import Game from './components/Game';
import Friends from './components/Friends';
import NewGame from './components/NewGame';


function App() {

  let user = useContext(UserContext);

  if (user) {
    return (
        <div className='App'>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/user/:id' component={User} />
                <Route path='/game/:id' component={Game} />
                <Route path='/my-friends' component={Friends} />
                <Route path='/new-game' component={NewGame} />
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
