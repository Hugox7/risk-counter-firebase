import React, { createContext } from 'react';
import { auth }  from '../config/firebase';

export const UserContext = createContext({ user: null });

class userProvider extends React.Component {

    state = {
        user: null,
    }

    componentDidMount() {
        auth.onAuthStateChanged(userAuth => {
            this.setState({ user: userAuth });
        })
    }

    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }

}

export default userProvider;