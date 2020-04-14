import React, { useContext } from 'react';
import { auth, getUserDocument } from '../config/firebase';
import { UserContext } from '../providers/userProvider';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import './home.css';

class Home extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        this.setState({ user });
        console.log(this.state.user);
    } 
    
    render() {

        const { user } = this.state;
        const antIcon = <LoadingOutlined style={{ fontSize: 90 }} spin />;

        if (user) {
            return (
                <div id="home">
                    <h3 style={{ color: 'white' }}>{'Welcome ' + this.state.user.username}</h3>
                    <button onClick={() => auth.signOut()}>signOut</button>
    
                </div>
            );
        } else {
            return (
                <div id="home-loading">
                    <Spin indicator={antIcon} />;
                </div>
            );
        }

        
    }
}

export default Home;