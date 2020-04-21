import React from 'react';
import { Drawer, Avatar, Button, Tooltip, icon, Badge } from 'antd';
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

const ProfileDrawer = ({ user, onClose, visible, notifs }) => {

    const profilePic = user.picture 
        ? <Avatar size={100} src={user.picture} style={{ marginLeft: '10px' }} />
        : <Avatar size={100} icon={<UserOutlined />} style={{ marginLeft: '10px' }} />;

    const count = notifs.filter(notif => notif.isRead === false).length;
    
    return (
        <Drawer
            visible={visible}
            onClose={onClose}
            width={350}
        >   
            <div id="drawer-header">
                {profilePic}
                <h2>{user.username}</h2>
            </div>
            <hr style={{ marginTop: '25px' }} />
            <div id="drawer-links">
                <div>
                    <Badge dot count={count}>
                        <NotificationOutlined className='menu-icon' />
                    </Badge>
                    <Link to="/"><p>Notifications</p></Link>
                </div>
                <div>
                    <MessageOutlined className='menu-icon' />
                    <Link to="/"><p>Messages</p></Link>
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