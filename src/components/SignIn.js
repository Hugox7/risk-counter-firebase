import React from 'react';
import { Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../config/firebase';
import riskLogo from '../assets/risk-logo.jpg';

import './signIn.css';

class SignIn extends React.Component {

    state = {
        error: null,
        email: '',
        password: '',
        loading: false,
    }


    handleSubmit = (e, email, password) => {
        e.preventDefault();
        this.setState({ loading: true })
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                this.setState({ error, loading: false });
                console.error("Error signing in with password and email", error);
            });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        const { email, password, loading } = this.state;

        return (
            <div id='sign-in'>
                <div id='sign-in-content'>
                    <img style={{ width: '300px' }} src={riskLogo} alt="risk logo" />
                    <p style={{ margin: 0 }}>Pour l'édition Game of thrones Westeros</p>
                    <div id='sign-in-forms'>
                        {this.state.error ?
                            <Alert
                                style={{ marginBottom: '20px', width: '320px' }}
                                message="Erreur de connexion"
                                description="L'utilisateur n'existe pas ou le mot de passe est incorrect"
                                type="error"
                                closable
                                onClose={() => this.setState({ error: null })}
                                
                            /> : null
                        }
                        <form className='signin-form' onSubmit={(e) => this.handleSubmit(e, email, password)}>
                            <Input 
                                placeholder="Entrez votre email"
                                prefix={<MailOutlined className="site-form-item-icon" />}
                                style={{ margin: '10px', width: '320px' }}
                                onChange={this.handleChange}
                                name="email"
                                value={this.state.email}
                            />
                            <Input
                                placeholder="Entrez votre mot de passe"
                                width={ 150 }
                                type="password"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                style={{ margin: '10px', width: '320px' }}
                                onChange={this.handleChange}
                                name="password"
                                value={this.state.password}
                            />
                            <Button loading={this.state.loading} type="primary" htmlType="submit">Connexion</Button>
                        </form>
                    </div>
                    <div id="no-account">
                        <p style={{ textAlign: 'center' }}>
                            Vous n'avez pas de compte ? <Link to="/sign-up">Créez votre compte ici</Link>
                            <br />
                            <Link to="/password-reset">Mot de passe oublié?</Link>
                        </p>
                    </div>  
                </div>
            </div>
        );
    }
}

export default SignIn;