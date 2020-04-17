import React from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import {  auth, generateUserDocument } from '../config/firebase';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import './signUp.css';

class SignUp extends React.Component {

    state = {
        error: null,
        displayName: '',
        email: '',
        password: '',
        loading: false,
    }

    createUserWithEmailAndPasswordHandler = async (e, email, password, displayName) => {
        e.preventDefault();
        this.setState({ loading: true });
        auth.createUserWithEmailAndPassword(email, password)
            .then((user) => generateUserDocument({user}, displayName))
            .then(() => this.props.history.push('/'))
            .catch((error) => {
                console.log(error);
                this.setState({ error, loading: false });
            })

        this.setState({ 
            username: '',
            email: '',
            password: '',
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        const { displayName, email, password } = this.state;

        return (
            <div id="sign-up">
                <div id="sign-up-content">
                    <h3>Créez votre compte rapidement...</h3>
                    <form id="sign-up-form" onSubmit={(e) => this.createUserWithEmailAndPasswordHandler(e, email, password, displayName)}>
                        <Input 
                            placeholder="Entrez votre nom d'utilisateur"
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            style={{ margin: '10px', width: '320px' }}
                            onChange={this.handleChange}
                            name="displayName"
                            value={this.state.username}
                        />
                        <Input 
                            placeholder="Entrez votre adresse email"
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            style={{ margin: '10px', width: '320px' }}
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                        />
                        <Input 
                            placeholder="Entrez votre mot de passe"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            style={{ margin: '10px', width: '320px' }}
                            onChange={this.handleChange}
                            name="password"
                            type="password"
                            value={this.state.password}
                        />
                        <Button loading={this.state.loading} type="primary" htmlType="submit">Créez votre compte</Button>
                    </form>
                        
                    
                    <p style={{ marginTop: '30px' }}>Vous avez déjà un compte ? <Link to='/'>Connectez-vous ici</Link></p>
                </div>
            </div>
        );
    }
}

export default SignUp;