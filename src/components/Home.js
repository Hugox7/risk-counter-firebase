import React from 'react';
import { auth, getUserDocument, getUserGames, getUsers } from '../config/firebase';
import { UserContext } from '../providers/userProvider';
import { LoadingOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { Spin, Button, Row, Col, Tooltip, Avatar } from 'antd';
import { Link } from 'react-router-dom';

import './home.css';
import NewGameModal from './NewGameModal';

class Home extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        games: [],
        users: [],
        showDrawer: false,
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const games = await getUserGames(userId);
        const users = await getUsers();
        this.setState({ user, games, users });
        console.log(this.state);
    } 

    handleShowDrawer = () => {
        this.setState({ showDrawer: true });
    }

    handleHideDrawer = () => {
        this.setState({ showDrawer: false });
    }
    
    render() {

        const { user, games, users } = this.state;
        const antIcon = <LoadingOutlined style={{ fontSize: 90 }} spin />;
        const profilePic = user && user.picture ? user.picture : <UserOutlined />;

        if (user) {
            return (
                <div id="home">
                    <Row>
                        <Col span={22} offset={1}>
                            <div id="home-header">
                                <h2>{`Welcome ${user.username}`}</h2>
                                <div>
                                    <Tooltip title="Mon profil">
                                        <Link to={`/user/${user.id}`}>
                                            <Avatar className="avatar" size={64} icon={profilePic} />
                                        </Link>
                                    </Tooltip>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={1}>
                            <Button 
                                icon={<PlusOutlined />} 
                                className="new-game-button" 
                                type="primary"
                                onClick={this.handleShowDrawer}
                            >
                                Nouvelle partie
                            </Button>
                            <NewGameModal 
                                visible={this.state.showDrawer}
                                onClose={this.handleHideDrawer}
                                users={users}
                            />
                        </Col>
                    </Row>
                    <Row gutter={32}>
                        <Col 
                            xl={{ span: 11, offset: 1 }}
                            lg={{ span: 11, offset: 1 }}
                            md={{ span: 22, offset: 1 }}
                            sm={{ span: 22, offset: 1 }}
                            xs={{ span: 22, offset: 1 }}
                        >
                            <div className="games">
                                <div className="current-games-header">
                                    <h3>Mes parties en cours</h3>
                                </div>
                                <div id="current-games-content">
                                    {!games.length ?
                                        <p>Vous n'avez aucune partie en cours</p>
                                        : <div>Games</div>
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col 
                            xl={{ span: 11, offset: 0 }}
                            lg={{ span: 11, offset: 0 }}
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