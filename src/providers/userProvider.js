import React, { createContext } from 'react';
import { auth }  from '../config/firebase';
import { generateUserDocument } from '../config/firebase';

export const UserContext = createContext({ user: null });

class userProvider extends React.Component {

    state = {
        user: null,
    }

    componentDidMount = async () => {
        auth.onAuthStateChanged(async userAuth => {
            this.setState({ user: userAuth }, () => console.log(this.state.user))
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