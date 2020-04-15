import React from 'react';
import { Tooltip, Button } from 'antd';
import { auth } from '../config/firebase';
import { LogoutOutlined } from '@ant-design/icons';

const User = ({ history }) => {

    const handleSignout = (e) => {
        e.preventDefault();
        auth.signOut();
        history.push('/')
    }

    return (
        <div>
            <Tooltip title="Deconnexion">
                <Button 
                    shape="circle" 
                    type="primary" 
                    icon={<LogoutOutlined />} 
                    onClick={(e) => handleSignout(e)}
                    className="log-out-button"
                    size="large"
                />
            </Tooltip> 
        </div>
    );
}

export default User;