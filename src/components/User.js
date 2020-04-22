import React from 'react';
import { Tooltip, Button, message, Avatar, Input } from 'antd';
import { getUserDocument, storage, updateProfilePic } from '../config/firebase';
import {  UploadOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from '../providers/userProvider';

import './user.css';

class User extends React.Component {
    static contextType = UserContext;
    

    state = {
        user: null,
        userValue: '',
        image: null,
        url: '',
        error: null,
    }

    async componentDidMount() {
        let userId = this.context.uid;
        console.log('context ', this.context);
        const user = await getUserDocument(userId);
        this.setState({
            user, userValue: user.username,
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.url !== this.state.url) {
            await updateProfilePic(this.state.url);
            this.setState({ user: await getUserDocument(this.state.user.id) });
        }
    }

    handleProfilePicUpload = () => {
        const { image, user } = this.state;
        if (image) {
            const uploadTask = storage.ref(`/profilePics/${user.id}/${image.name}`).put(image);
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // progress function

                }, 
                (error) => {
                    // error function
                    console.log(error);
                    this.setState({ error });
                }, 
                (complete) => {
                    // complete function
                    storage.ref(`profilePics/${user.id}/${image.name}`).getDownloadURL().then(url => {
                        console.log(url);
                        this.setState({ url });
                        message.info('Votre photo de profil a été correctement modifiée');
                    })
                    // .then(async () => {
                    //     let picturesToDelete = await storage.ref(`profilePics/${user.id}`).listAll();
                    //     picturesToDelete.items.slice(1).forEach(item => {
                    //         storage.ref(item.location.path).delete();
                    //     });
                        
                    // })
                },
            );
        } else {
            return;
        }
    }

    handleChange = (e) => {
        const image = e.target.files[0];
        if (image) {
            this.setState({ image });
        }
        
       
    }

    
    render() {

        const { user } = this.state;

        if (user) {

            const profilePic = user.picture 
                ? <Avatar size={120} src={user.picture} style={{ marginLeft: '10px' }} />
                : <Avatar size={120} icon={<UserOutlined />} style={{ marginLeft: '10px' }} />;
           

            return (
                <div id="user">
                    <div id="update-profile">
                        <div id='update-profile-header'>
                            <h2>Modifiez votre profil</h2>
                            <Button
                                onClick={() => this.props.history.push('/')}
                            >
                                Retour
                            </Button>
                        </div>
                        <div id='update-profile-pic'>
                            <form>
                                <input 
                                    type="file" 
                                    onChange={this.handleChange}
                                />
                                <Button
                                    onClick={this.handleProfilePicUpload}
                                    style={{ marginTop: '10px' }}
                                    type="primary"
                                    icon={<UploadOutlined />}
                                    disabled={!this.state.image}
                                >
                                    Modifier
                                </Button>
                            </form>
                            {profilePic}
                        </div>
                        <hr style={{ margin: '20px 20px' }} />
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