import React from 'react';
import { UserContext } from '../providers/userProvider';
import { getUserDocument, getUserQuery } from '../config/firebase';
import { Col, Row, Input, Avatar, Button, Tooltip } from 'antd';
import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import './friends.css';

class Friends extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        value: '',
        userFromQuery: null,
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        this.setState({ user });
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

    render() {

        const {user} = this.state;
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
                                        1
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
                                                    <p>{this.state.userFromQuery[0].username}</p>
                                                </div>
                                                <Tooltip title="Ajouter comme ami">
                                                    <Button
                                                        icon={<UsergroupAddOutlined />}
                                                    />
                                                </Tooltip>
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