import React from 'react';
import { Spin, Button, Select, Checkbox, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getUserDocument, getCurrentGame, firestore, getCheckBoxArray, getGamePlayers } from '../config/firebase';
import { UserContext } from '../providers/userProvider';

import './game.css';
import game from '../store/reducers/game';

class Game extends React.Component {
    static contextType = UserContext;

    state = {
        user: null,
        game: null,
        loading: true,
        checkedItems: [],
        currentPlayer: null,
        loadingSubmit: false,
        checkboxArray: [],
        players: [],
    }

    componentDidMount = async () => {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const game = await getCurrentGame(this.props.match.params.id);
        const checkboxArray = await getCheckBoxArray(userId, this.props.match.params.id);
        const players = await getGamePlayers(this.props.match.params.id);
        this.setState({ user, game, checkboxArray, players }, () => console.log(this.state));
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.user !== this.state.user) {        
            this.setState({ loading: false });
        }
        
    }

    handleChangeBox = (checkedItems) => {
        this.setState({ checkedItems }, () => console.log(this.state));
    }

    handleChangePlayer = (value) => {
        this.setState({ currentPlayer: value });
    }

    handleSubmitRegions = async (e) => {
        e.preventDefault();
        this.setState({ loadingSubmit: true });
        const { user, currentPlayer } = this.state;
        const gameId = this.props.match.params.id;
        const regionsRef = firestore.collection(`users/${user.id}/games/${gameId}/regions`);
        const playerRef = firestore.collection(`users`).doc(user.id).collection('games').doc(gameId).collection('players').doc(currentPlayer);
        

        try {
            this.state.checkedItems.forEach(async item => {
                const currentRegion = await regionsRef.doc(item).get();
                await playerRef.collection('regions').doc(item).set(currentRegion.data())
                await regionsRef.doc(item).delete()
                    .then(() => console.log('DELETED : region correctement supprimée'))
                    .catch(error => console.log(error));
                await this.setState({ 
                    loadingSubmit: false, 
                    checkboxArray: await getCheckBoxArray(user.id, gameId),
                    checkedItems: [],
                });
            })
        } catch (error) {
            console.log(error);
            this.setState({ loadingSubmit: false });
        }
        
    
    }

    renderGame() {

        const { game, user } = this.state;

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
                    console.log(2)
                } else if (!game.isReady && isInvited) {
                    console.log(3)
                } else if (game.isReady) {
                    console.log(4)
                } else {
                    return null;
                }
            } 
        }

        // if (this.state.loading) {
        //     const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
        //     return <div id='game-loading'><Spin indicator={antIcon} /></div>
        // } else if (!this.state.game) {
        //     return (
        //         <div className='no-game'>
        //             <h1>Cette partie n'existe pas ou plus</h1>
        //             <Button type="primary" onClick={() => this.props.history.push('/new-game')}>
        //                 Retour à la création de partie
        //             </Button>
        //         </div>
        //     ); 
        // } else if (this.state.game.creator !== this.state.user.id) {
        //     return (
        //         <div className='no-game'>
        //             <h1>Vous n'êtes pas autorisé à participer à cette partie</h1>
        //             <Button type="primary" onClick={() => this.props.history.push('/new-game')}>
        //                 Retour à la création de partie
        //             </Button>
        //         </div>
        //     );
        // } else if (!this.state.game.isReady) {

        //     return (
        //         <div className="game-not-ready"> 
        //             <div style={{ textAlign: 'center' }}>
        //                 <h2 style={{ marginBottom: '5px' }}>La partie va bientôt pouvoir commencer. Vous devez d'abord attribuer les régions aux différents joueurs</h2>
        //                 <p>N'oubliez pas que si vous jouez à deux, vous devez attribuer 18 régions à chaque joueur, les 12 restantes étant attribuées à un joueur neutre.</p>
        //                 <div id="select-part">
        //                     <h3>Sélectionnez un joueur...</h3>
        //                     <Select
        //                         placeholder="Sélectionnez un joueur"
        //                         onChange={this.handleChangePlayer}
        //                         value={this.state.currentPlayer}
        //                     >
        //                         {this.state.players.map(player => {
        //                             return <Select.Option key={player.id} value={player.id}>{player.name}</Select.Option>
        //                         })}
        //                     </Select>
        //                 </div>
        //                 <div id="checkbox-part">
        //                     <h3>...et attribuez lui des régions</h3>
        //                     <p style={{ textAlign: 'start' }}>{`Régions sélectionnées : ${this.state.checkedItems.length}`}</p>
        //                     <Checkbox.Group
        //                         disabled={!this.state.currentPlayer}
        //                         options={this.state.checkboxArray}
        //                         onChange={this.handleChangeBox}
        //                     />
        //                     <Button
        //                         style={{ marginTop: '25px' }}
        //                         type="primary"
        //                         onClick={this.handleSubmitRegions}
        //                         disabled={!this.state.currentPlayer || !this.state.checkedItems.length}
        //                     >
        //                         Attribuer les régions sélectionnées
        //                     </Button>
        //                 </div>
                        
        //             </div>
                    
        //         </div>
        //     ); 
        // } else {
        //     return <div className="game-ready">game ready !!!</div>
        // }
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