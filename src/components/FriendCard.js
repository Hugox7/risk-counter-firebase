import React, {useState, useEffect} from 'react';
import { Avatar, Button, Popconfirm } from 'antd';
import { firestore } from '../config/firebase';
import { MessageOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

import './friendCard.css';

const FriendCard = ({ id }) => {

    const [friend, setFriend] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            let friend = await firestore.collection('users').doc(id).get();
            setFriend(friend.data());
        }
        fetchData();
    }, []);


    const pic = friend.picture 
        ? <Avatar size={80} src={friend.picture} /> 
        : <Avatar size={80} icon={<UserOutlined />} />;

    return (
        <div id='friend-card'>
            <div id="friend-card-header">
                {pic}
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