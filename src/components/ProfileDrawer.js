import React from 'react';
import { Drawer, Avatar, Button, Tooltip, icon } from 'antd';
import { Link } from 'react-router-dom';
import { 
    UserOutlined, 
    LogoutOutlined, 
    NotificationOutlined, 
    MessageOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import { auth } from '../config/firebase';

import './profileDrawer.css';

const ProfileDrawer = ({ user, onClose, visible }) => {

    const profilePic = user && user.picture ? user.picture : <UserOutlined />;
    
    return (
        <Drawer
            visible={visible}
            onClose={onClose}
            width={350}
        >   
            <div id="drawer-header">
                <Avatar className="avatar" size={64} icon={profilePic} />
                <h2>{user.username}</h2>
            </div>
            <hr style={{ marginTop: '25px' }} />
            <div id="drawer-links">
                <div>
                    <NotificationOutlined className='menu-icon' />
                    <Link><p>Notifications</p></Link>
                </div>
                <div>
                    <MessageOutlined className='menu-icon' />
                    <Link><p>Messages</p></Link>
                </div>
                <div>
                    <UserOutlined className='menu-icon' />
                    <Link to="/my-friends"><p>Mes amis</p></Link>
                </div>
                <div>
                    <ProfileOutlined className='menu-icon' />
                    <Link to={`/user/${user.id}`}><p>Modifier mon profil</p></Link>
                </div>
                
                
            </div>
            <Tooltip title="Se déconnecter">
                <Button 
                    icon={<LogoutOutlined />} 
                    type="primary" 
                    shape="circle"
                    onClick={() => auth.signOut()}
                    style={{ marginTop: '25px' }}
                    className='signout-button'
                />
            </Tooltip>
            
            
        </Drawer>
    );
    
}

export default ProfileDrawer;