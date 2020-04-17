import React from 'react';
import { UserContext } from '../providers/userProvider';
import { 
    getUserDocument, 
    getUserQuery, 
    sendFriendRequest,
    acceptFriendRequest,
    getUserFriends,
    getUserNotifications,
    deleteNotification,
    firestore 
} from '../config/firebase';
import { Col, Row, Input, Avatar, Button, Tooltip, Popconfirm, message, Divider } from 'antd';
import { UserOutlined, UsergroupAddOutlined, RollbackOutlined } from '@ant-design/icons';

import './friends.css';
import FriendCard from './FriendCard';

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
        if (!prevState.loading && this.state.loading) {
            this.setState({
                notifs: getUserNotifications(this.state.user.id),
                friends: getUserFriends(this.state.user.id),
            });
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

    handleAcceptFriend = async (e, userId, notif) => {
        e.preventDefault(); 
        try {
            await acceptFriendRequest(userId, notif.idAsker, this.state.user);
            await deleteNotification(userId, notif.id);
            this.setState({ 
                notifs: await getUserNotifications(userId),
                friends: await getUserFriends(userId),
             });
        } catch (error) {
            console.log('error : ', error);
            this.setState({ error });
            message.info("Erreur lors de l'acceptation de la demande");
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
                picture: user.picture ? user.picture : null,
                username: user.username,
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

    renderResultCard() {
        const { user, userFromQuery, notifReceivedCheck, notifSentCheck, notifs, friends } = this.state;
        const alreadyFriend = friends.find(friend => friend.id === userFromQuery[0].id);

        if (alreadyFriend) {
            return <p style={{ margin: 0, fontSize: '12px', color: 'red' }}>déjà amis</p>;
        } else if (!notifSentCheck && userFromQuery[0].id !== user.id && !notifReceivedCheck) {
            return (
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
            );
        } else if (notifReceivedCheck) {
            return (
                <div style={{ display: 'flex' }}>
                    En attente
                </div>
                
            );
        } else {
            return (
                <Tooltip title="Une notification a déjà été envoyée, ou c'est votre propre compte">
                    <Button
                        icon={<UsergroupAddOutlined />}
                        disabled
                    />
                </Tooltip>
            );
        }
    }

    render() {

        const {user, userFromQuery, notifs} = this.state;
        const profilePic = user && user.picture ? user.picture : <UserOutlined />;
        let friendsNotifs = notifs.filter(notif => notif.friend === true);

        return (
            <div id="my-friends">
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
                                                {this.renderResultCard()}
                                                
                                            </div>  
                                        }
                                        {friendsNotifs.length ?
                                            <div id="friends-awaiting">
                                                <h3>Ils vous demandent en ami</h3>
                                                {friendsNotifs.map((notif, index) => {

                                                    let friendProfilePic = notif.picture ?
                                                        notif.picture : <UserOutlined />

                                                    return (
                                                        <div id="card-user" key={index}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar size={32} icon={friendProfilePic} />
                                                                <p>{notif.username}</p>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button 
                                                                    style={{ marginRight: '3px' }}
                                                                    onClick={(e) => this.handleAcceptFriend(e, user.id, notif)}
                                                                >
                                                                    Oui
                                                                </Button>
                                                                <Button>Non</Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        : null
                                        }
                                    </div>
                                </Col>
                                <Col
                                    xl={{ span: 16, offset: 0 }}
                                    lg={{ span: 16, offset: 0 }}
                                    md={{ span: 24, offset: 0 }}
                                    sm={{ span: 24, offset: 0 }}
                                    xs={{ span: 24, offset: 0 }}
                                >
                                    <div id="current-friends">
                                        <div id="current-friends-header">
                                            <h2>Mes amis</h2>
                                            <Button 
                                                icon={<RollbackOutlined />}
                                                onClick={() => this.props.history.push('/')}
                                            >
                                                Retour
                                            </Button>
                                        </div>
                                        <div id="current-friends-content">
                                            {this.state.friends.length ?
                                                this.state.friends.map(friend => {
                                                    return <FriendCard key={friend.id} friend={friend} pic={profilePic} />
                                                })
                                                : null
                                            }
                                        </div>
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