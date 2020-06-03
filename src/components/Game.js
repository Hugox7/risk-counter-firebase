import React from 'react';
import { Spin, Button, Select, Checkbox, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getUserDocument, getCurrentGame, firestore, getCheckBoxArray, getGamePlayers } from '../config/firebase';
import { UserContext } from '../providers/userProvider';

import './game.css';
import GameIsNotReady from './GameIsNotReady';
import GameIsOn from './GameIsOn';
import game from '../store/reducers/game';

class Game extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        game: null,
        loading: true,
        loadingSubmit: false,
        players: [],
    }

    componentDidMount = async () => {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const game = await getCurrentGame(this.props.match.params.id);
        const players = await getGamePlayers(this.props.match.params.id);
        this.setState({ user, game, players });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.user !== this.state.user) {        
            this.setState({ loading: false });
        }
        
    }

    renderGame() {

        const { game, user, players } = this.state;

        if (this.state.loading && !this.state.user) {
            const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
            return <div id='game-loading'><Spin indicator={antIcon} /></div>
        } else {
            if (!game) {
                    return (
                        <div className='no-game'>
                            <h1>Cette partie n'existe pas ou plus</h1>
                            <Button type="primary" onClick={() => this.props.history.push('/new-game')}>
                                Retour à la création de partie
                            </Button>
                        </div>
                    ); 
            } else {

                const isInvited = game.guests.find(guest => guest === user.id);

                if (game.creator != user.id && !isInvited) {
                        return (
                            <div className='no-game'>
                                <h1>Vous n'êtes pas autorisé à participer à cette partie</h1>
                                <Button type="primary" onClick={() => this.props.history.push('/new-game')}>
                                    Retour à la création de partie
                                </Button>
                            </div>
                        );
                } else if (!game.isReady && game.creator === user.id) {
                    return (
                        <GameIsNotReady 
                            game={game} 
                            players={players} 
                            user={user}
                        />
                    ); 
                } else if (!game.isReady && isInvited) {
                    return (
                        <div className='no-game'>
                            <h1>La partie n'est pas encore lancée</h1>
                            <Button type="primary" onClick={() => this.props.history.push('/')}>
                                Retour à l'accueil
                            </Button>
                        </div>
                    ); 
                } else if (game.isReady) {
                    return (
                        <GameIsOn 
                            user={user}
                        />
                    );
                } else {
                    return null;
                }
            } 
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