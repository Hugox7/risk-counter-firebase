import React from 'react';
import { Avatar, Button, Popconfirm } from 'antd';
import { MessageOutlined, DeleteOutlined } from '@ant-design/icons';

import './friendCard.css';

const FriendCard = ({ friend, pic }) => {
    return (
        <div id='friend-card'>
            <div id="friend-card-header">
                <Avatar size={80} icon={pic} />
                <div>
                    <h3>{friend.username}</h3>
                    <p>{friend.email}</p>
                </div>
            </div>
            <div id='friend-card-options'>
                <Button icon={<MessageOutlined />} />
                <Popconfirm
                    title={`Etes-vous sur de vouloir retirer ${friend.username} de vos amis ?`}
                    okText="Oui"
                    cancelText="Non"
                >
                    <Button icon={<DeleteOutlined />}/>
                </Popconfirm>
            </div>
        </div>
    )
}

export default FriendCard;