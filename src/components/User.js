import React from 'react';
import { Tooltip, Button, Upload, message, Avatar, Input } from 'antd';
import { getUserDocument, auth } from '../config/firebase';
import {  UploadOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from '../providers/userProvider';

import './user.css';

class User extends React.Component {
    static contextType = UserContext;
    

    state = {
        user: null,
        userValue: '',
    }

    async componentDidMount() {
        let userId = this.context.uid;
        console.log('context ', this.context);
        const user = await getUserDocument(userId);
        this.setState({
            user, userValue: user.username,
        });
    }

    uploadProfilePic = () => {
        // let updated = await auth.currentUser.updateProfile({

        // })
    }

    
    render() {

        const { user } = this.state;

        const props = {
            name: 'file',
            action: this.uploadProfilePic,
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        

        if (user) {

            const profilePic = user.picture ? user.picture : <UserOutlined />;

            return (
                <div id="user">
                    <div id="update-profile">
                        <h2>Modifiez votre profil</h2>
                        <div id='update-profile-pic'>
                            <Upload {...props}>
                                <Button>
                                    <UploadOutlined /> Click to Upload
                                </Button>
                            </Upload>
                            <Avatar size={120} icon={profilePic} style={{ marginLeft: '10px' }} />
                        </div>
                        <div id='update-username'>
                            <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                <div>
                                    <label>Modifiez votre nom d'utilisateur</label>
                                    <Input 
                                        width={300}
                                        style={{ marginTop: '5px' }}
                                        value={this.state.userValue}
                                    />
                                </div>
                                <Button type="primary">Modifier</Button>
                            </form> 
                        </div>
                    </div>
                </div>
            );
        } else {
            return <p>Loading</p>
        }
        
    }    
}

export default User;