import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { signInWithGoogle } from '../config/firebase';

import './signIn.css';

class SignIn extends React.Component {

    handleFinish = (values) => {
        console.log('form values ', values)
    }

    render() {

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }

        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
          };

        return (
            <div id='sign-in'>
                <div id="sign-in-header">
                    <h1>Bienvenue sur le Risk Counter</h1>
                    <p>Cette application va vous permettre de suivre vos parties de Risk Game of Thrones, gérer vos territoires et vos armées</p>
                </div>
                <div id='sign-in-forms'>
                    <Form
                        {...layout}
                        name="signIn"
                        onFinish={this.handleFinish}
                        // onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            label="email"
                            name="email"
                            style={{ width: '500px' }}
                            rules={[{ required: true, message: "Merci d'entrer votre adresse mail" }]}
                        >
                            <Input 
                                
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mot de passe"
                            style={{ width: '500px' }}
                            name="password"
                            rules={[{ required: true, message: "Merci d'entrer votre mot de passe" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item 
                            {...tailLayout}
                        >
                            <Button type="primary" htmlType="submit">
                            Connexion
                            </Button>
                        </Form.Item>
                    </Form>
                    <p style={{ fontWeight: 'bold' }}>Ou</p>
                    <div className="google-connection-button">
                        <Button onClick={signInWithGoogle}>Connexion avec Google</Button>
                    </div>
                    <div id="no-account">
                        <p>
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