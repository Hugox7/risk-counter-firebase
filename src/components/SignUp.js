import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { signInWithGoogle, auth, generateUserDocument } from '../config/firebase';

import './signUp.css';

class SignUp extends React.Component {

    state = {
        error: null,
    }

    createUserWithEmailAndPasswordHandler = async (e, values) => {
        e.preventDefault();
        try {
            const { user } = await auth.createUserWithEmailAndPassword(values.email, values.password);
            generateUserDocument(user, {username: values.username});
        } catch (error) {
            this.setState({ error });
        }
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
            <div id="sign-up">
                <div id="sign-up-header">
                    <h1>Créez votre compte</h1>
                </div>
                <div id="sign-up-form">
                    <Form
                        {...layout}
                        name="signUp"
                        onFinish={this.createUserWithEmailAndPasswordHandler}
                        // onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            label="Nom d'utilisateur"
                            style={{ width: '500px' }}
                            name="username"
                            rules={[{ required: true, message: "Merci d'entrer un nom d'utilisateur" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            style={{ width: '500px' }}
                            name="email"
                            rules={[{ required: true, message: "Merci d'entrer une adresse mail" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mot de passe"
                            style={{ width: '500px' }}
                            name="password"
                            rules={[{ required: true, message: "Merci d'entrer un mot de passe" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                            Connexion
                            </Button>
                        </Form.Item>
                    </Form>
                    <p>Ou</p>
                    <div className="google-connection-button">
                        <Button onClick={signInWithGoogle}>Connexion avec Google</Button>
                    </div>
                    <p style={{ marginTop: '30px' }}>Vous avez déjà un compte ? <Link to='/'>Connectez-vous ici</Link></p>
                </div>
            </div>
        );
    }
}

export default SignUp;