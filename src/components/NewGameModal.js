import React, { useContext } from 'react';
import { Modal } from 'antd';

import { UserContext } from '../providers/userProvider';

const NewGameDrawer = (props) => {

        //const user = useContext(UserContext);

        return (
            <Modal
                title="Créer une nouvelle partie"
                placement="right"
                closable={true}
                onCancel={props.onClose}
                visible={props.visible}
                width={400}
                footer={null}
            >

            </Modal>
        );
    
}

export default NewGameDrawer;