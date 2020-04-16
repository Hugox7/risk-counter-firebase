import React from 'react';
import { UserContext } from '../providers/userProvider';
import { 
    getUserDocument, 
    getUserQuery, 
    sendFriendRequest,
    getUserFriends,
    getUserNotifications,
    firestore 
} from '../config/firebase';
import { Col, Row, Input, Avatar, Button, Tooltip, Popconfirm, message } from 'antd';
import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import './friends.css';

class Friends extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        value: '',
        userFromQuery: null,
        error: null,
        notifSentCheck: false,
        notifReceivedCheck: false,
        friends: [],
        notifs: [],
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const notifs = await getUserNotifications(userId);
        const friends = await getUserFriends(userId);

        this.setState({ user, friends, notifs }, () => console.log(this.state));
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.userFromQuery !== this.state.userFromQuery) {
            this.setState({ 
                notifSentCheck: await this.checkIfNotificationHasBeenSent(),
                notifReceivedCheck: await this.checkIfNotificationHasBeenReceived(),
            }, () => console.log(this.state));
        }
    }

    handleChange = async (e) => {        
        await this.setState({ value: e.target.value });
        if (this.state.value.length > 0) {

            let response = await getUserQuery(this.state.value);
            if (response && response.length) {
                this.setState({ userFromQuery: response });
            } else {
                this.setState({ userFromQuery: null });
            }
        } else {
            this.setState({ userFromQuery: null });
        }   
    }

    handleAddFriend = async (e) => {
        e.preventDefault();
        const { userFromQuery, user } = this.state;
        try {
            await sendFriendRequest(userFromQuery[0].id, {
                title: "Nouvelle demande d'ami",
                description: `Acceptez vous la demande d'ami de ${user.username} ?`,
                isRead: false,
                idAsker: user.id,
                friend: true,
            });
            this.setState({ userFromQuery: null, value: '' });
            message.info(`La demande a bien été envoyée à ${userFromQuery[0].username}`)
        } catch (error) {
            console.log(error);
            this.setState({ error });
        }
    }

    checkIfNotificationHasBeenSent = async () => {
        const { user, userFromQuery } = this.state;
        if (userFromQuery) {
            let snapshot = await firestore.collection('users')
            .doc(userFromQuery[0].id)
            .collection('notifications')
            .where('idAsker', '==', user.id)
            .get()

            if (snapshot.docs.length) {
                return true;
            } else {
                return false;
            }  

        }
        else {
            return false;
        }
    }

    checkIfNotificationHasBeenReceived = async () => {
        const { user, userFromQuery, notifs } = this.state;
        if (userFromQuery) {
            let check = notifs.find(notif => notif.idAsker === userFromQuery[0].id);
            if (check) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    render() {

        const {user, userFromQuery} = this.state;
        const profilePic = user && user.picture ? user.picture : <UserOutlined />;

        return (
            <div id="my-friends">
                <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '30px' }}>Mes amis</h1>
                <Row>
                    <Col
                        xl={{ span: 20, offset: 2 }}
                        lg={{ span: 20, offset: 2 }}
                        md={{ span: 22, offset: 1 }}
                        sm={{ span: 22, offset: 1 }}
                        xs={{ span: 22, offset: 1 }}
                    >
                        <div id='my-friends-content'>
                            <Row gutter={16} style={{ minHeight: '600px' }}>
                                <Col
                                    xl={{ span: 16, offset: 0 }}
                                    lg={{ span: 16, offset: 0 }}
                                    md={{ span: 24, offset: 0 }}
                                    sm={{ span: 24, offset: 0 }}
                                    xs={{ span: 24, offset: 0 }}
                                >
                                    <div id="current-friends">
                                        {!this.state.friends.length && 
                                            <p>Vous n'avez pas encore d'amis</p>
                                        }
                                    </div>
                                </Col>
                                <Col
                                    xl={{ span: 8, offset: 0 }}
                                    lg={{ span: 8, offset: 0 }}
                                    md={{ span: 24, offset: 0 }}
                                    sm={{ span: 24, offset: 0 }}
                                    xs={{ span: 24, offset: 0 }}
                                >
                                    <div id="search-users">
                                        <h2>Cherchez des amis à ajouter</h2>
                                        <Input 
                                            width='100%'
                                            placeholder="Tapez le nom de l'utilisateur que vous recherchez"
                                            value={this.state.value}
                                            onChange={this.handleChange}
                                        />
                                        {this.state.userFromQuery &&
                                            
                                            <div id='response-card'>
                                                <div>
                                                    <Avatar className="avatar" size={32} icon={profilePic} />
                                                    <p>{userFromQuery[0].username}</p>
                                                </div>
                                                {!this.state.notifSentCheck && userFromQuery[0].id !== user.id ?
                                                    <Popconfirm 
                                                    title={`Voulez-vous ajouter ${userFromQuery[0].username} comme ami ?`}
                                                    onConfirm={this.handleAddFriend}
                                                    okText="Oui"
                                                    cancelText="Non"
                                                    >
                                                        <Button
                                                            icon={<UsergroupAddOutlined />}
                                                        />
                                                    </Popconfirm>
                                                    : 
                                                    <Tooltip title="Vous êtes déjà amis, une notification a déjà été envoyée, ou c'est votre propre compte">
                                                        <Button
                                                            icon={<UsergroupAddOutlined />}
                                                            disabled
                                                        />
                                                    </Tooltip>
                                                }                                           
                                                
                                            </div>  
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                
            </div>
        );
    }
}

export default Friends;