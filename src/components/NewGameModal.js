import React from 'react';
import { Modal, Input } from 'antd';

import { getUserQuery } from '../config/firebase'



class NewGameDrawer extends React.Component {

    state = {
        remainingFactions: [
            {
                id: 1,
                name: 'Stark'
            },
            {
                id: 2,
                name: 'Lannister'
            },
            {
                id: 3,
                name: 'Baratheon'
            },
            {
                id: 4,
                name: 'Tyrell'
            },
            {
                id: 5,
                name: 'Martell'
            },
        ],
        value: '',
        userFromQuery: null,
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

        const { user, onClose, visible } = this.props;
        
        return (
            <Modal
                title="Créer une nouvelle partie"
                placement="right"
                closable={true}
                onCancel={onClose}
                visible={visible}
                width={500}
                footer={null}
            >   
               <Input 
                width={'100%'}
                placeholder="Cherchez un joueur à ajouter"
                value={this.state.value}
                onChange={this.handleChange}
               /> 
               {this.state.userFromQuery && this.state.userFromQuery[0].username}
                
            </Modal>
        );
    }  
}

export default NewGameDrawer;