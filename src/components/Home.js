import React from 'react';
import { getUserDocument, getUserGames, getUserNotifications } from '../config/firebase';
import { UserContext } from '../providers/userProvider';
import { LoadingOutlined, UserOutlined, PlusOutlined, MenuOutlined } from '@ant-design/icons';
import { Spin, Button, Row, Col, Tooltip, Avatar, Badge } from 'antd';
import { Link } from 'react-router-dom';

import './home.css';
import ProfileDrawer from './ProfileDrawer';
import GameCard from './GameCard';
import risk from '../assets/risk2.png';

class Home extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        games: [],
        showDrawer: false,
        notifs: [],
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const games = await getUserGames(userId);
        const notifs = await getUserNotifications(userId);
        this.setState({ user, games, notifs });
        console.log(this.state);
    } 

    handleShowDrawer = () => {
        this.setState({ showDrawer: true });
    }

    handleHideDrawer = () => {
        this.setState({ showDrawer: false });
    }
    
    render() {

        const { user, games, notifs } = this.state;
        const antIcon = <LoadingOutlined style={{ fontSize: 90 }} spin />;

        if (user) {

            const count = this.state.notifs.filter(notif => notif.isRead === false).length;

            return (
                <div id="home">
                    <Row>
                        <Col span={22} offset={1}>
                            <div id="home-header"> 
                                <h2>{`Welcome ${user.username}`}</h2>
                                <div id="home-logo-wrapper">
                                    <img src={risk} alt="risk-logo" />
                                </div>
                                <div>
                                    <Badge count={count}>
                                        <Button  
                                            type="primary"
                                            shape="circle"
                                            icon={<MenuOutlined />}
                                            className="menu-button"
                                            onClick={this.handleShowDrawer}
                                            style={{ marginRight: '20px' }}
                                        />
                                    </Badge>
                                    <ProfileDrawer 
                                        onClose={this.handleHideDrawer}
                                        visible={this.state.showDrawer}
                                        user={user}
                                        notifs={notifs}
                                    />
                                    <Button 
                                        className="new-game-button" 
                                        type="primary"
                                        onClick={() => this.props.history.push('/new-game')}
                                        shape="round"
                                        size="large"
                                    >Nouvelle partie</Button>      
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={32}>
                        <Col 
                            xl={{ span: 15, offset: 1 }}
                            lg={{ span: 15, offset: 1 }}
                            md={{ span: 22, offset: 1 }}
                            sm={{ span: 22, offset: 1 }}
                            xs={{ span: 22, offset: 1 }}
                        >
                            <div className="games">
                                <div className="current-games-header">
                                    <h3>Mes parties en cours</h3>
                                </div>
                                <div id="current-games-content">
                                    {!games.length 
                                        ?
                                        <p>Vous n'avez aucune partie en cours</p>
                                        : 
                                        <div>
                                            {games.map(game => {
                                                return <GameCard key={game.id} game={game} history={this.props.history} />
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col 
                            xl={{ span: 7, offset: 0 }}
                            lg={{ span: 7, offset: 0 }}
                            md={{ span: 22, offset: 1 }}
                            sm={{ span: 22, offset: 1 }}
                            xs={{ span: 22, offset: 1 }}
                        >
                            <div className="games">
                                <h3>Mes parties terminées</h3>
                                
                            </div>
                        </Col>
                    </Row>
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