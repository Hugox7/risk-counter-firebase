import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getUserDocument, getCurrentGame } from '../config/firebase';
import { UserContext } from '../providers/userProvider';

import './game.css';

class Game extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        game: null,
        loading: true,
    }

    componentDidMount = async () => {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const game = await getCurrentGame(userId, this.props.match.params.id);
        this.setState({ user, game }, () => console.log(this.state));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.user !== this.state.user) {
            this.setState({ loading: false });
        }
    }

    renderGame() {
        if (this.state.loading) {
            const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
            return <div id='game-loading'><Spin indicator={antIcon} /></div>
        } else {
            return <div>Gameessssss</div>
        }
    }


    render() {
        return (
            <div id='game'>
                <div id='game-content'>
                    {this.renderGame()}
                </div>
            </div>
        );
    }
}

export default Game;