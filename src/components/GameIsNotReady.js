import React from 'react';
import { getCheckBoxArray, firestore } from '../config/firebase';
import { Select, Checkbox, Button } from 'antd';

import PlayerHasRegions from './PlayerHasRegions';

class GameIsNotReady extends React.Component {

    state = {
        checkBoxArray: [{}],
        currentPlayer: null,
        checkedItems: [],
        loadingSubmit: false,
        isReady: false,
    }

    async componentDidMount() {
        const { game, user } = this.props;
        const checkBoxArray = await getCheckBoxArray(game.id);
        this.setState({ checkBoxArray }, () => console.log(this.state));
        console.log(this.props);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.players.length === 2 && this.state.checkBoxArray.length === 12 && prevState.checkBoxArray.length !== 12) {
            this.setState({ isReady: true });
        }
        if (this.props.players.length === 2 && this.state.checkBoxArray.length !== 12 && prevState.checkBoxArray.length === 12) {
            this.setState({ isReady: false });
        }
        if (this.props.players.length > 2 && !this.state.checkBoxArray.length && prevState.checkBoxArray.length !== 0) {
            this.setState({ isReady: true });
        }
        if (this.props.players.length > 2 && this.state.checkBoxArray.length && !prevState.checkBoxArray.length) {
            this.setState({ isReady: false });
        }

    }

    handleChangeBox = (checkedItems) => {
        this.setState({ checkedItems });
    }

    handleChangePlayer = (value) => {
        this.setState({ currentPlayer: value }, () => console.log(this.state.currentPlayer));
    }

    handleSubmitRegions = async (e) => {
        e.preventDefault();
        this.setState({ loadingSubmit: true });
        const { currentPlayer } = this.state;
        const { user, game } = this.props;
        const regionsRef = firestore.collection('games').doc(game.id).collection('regions');
        const playerRef = firestore.collection('games').doc(game.id).collection('players');
        

        try {
            this.state.checkedItems.forEach(async item => {
                const currentRegion = await regionsRef.doc(item).get();
                await playerRef.doc(currentPlayer).collection('regions').doc(item).set(currentRegion.data());
                await regionsRef.doc(item).delete();
                await this.setState({ 
                    loadingSubmit: false,
                    checkBoxArray: await getCheckBoxArray(game.id),
                    checkedItems: [],
                    currentPlayer: null,
                });
            });
        } catch (error) {
            console.log(error);
            this.setState({ loadingSubmit: false });
        }
    }

    updateCheckboxArray = async (id) => {
        this.setState({ checkBoxArray: await getCheckBoxArray(id), checkedItems: [] })
    }

    handleGameIsReady = async (e) => {
        e.preventDefault();
        const gameRef = firestore.collection('games').doc(this.props.game.id);
        try {
            await gameRef.update({
                isReady: true,
            })
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        
        return (
            <div className="game-not-ready">
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '5px' }}>La partie va bientôt pouvoir commencer. Vous devez d'abord attribuer les régions aux différents joueurs</h2>
                    <p>N'oubliez pas que si vous jouez à deux, vous devez attribuer 18 régions à chaque joueur, les 12 restantes étant attribuées à un joueur neutre.</p>
                    
                        {!this.state.isReady ? 
                            <div id="select-part">
                                <h3>Sélectionnez un joueur...</h3>
                                <Select
                                    placeholder="Sélectionnez un joueur"
                                    onChange={this.handleChangePlayer}
                                    value={this.state.currentPlayer}
                                >
                                    {this.props.players.map(player => {
                                        return <Select.Option key={player.id} value={player.id}>{player.name}</Select.Option>
                                    })}
                                </Select> 
                            </div>
                        : <div id="select-part">
                            <Button onClick={this.handleGameIsReady} id="launch-isReady">C'est parti !</Button>
                            </div>
                        }
                    
                    <div id="checkbox-part">
                        <h3>...et attribuez lui des régions</h3>
                        <p style={{ textAlign: 'start' }}>{`Régions sélectionnées : ${this.state.checkedItems.length}`}</p>
                        {this.state.checkBoxArray.length > 1 && Object.entries(this.state.checkBoxArray[0]).length > 0 ?
                        <Checkbox.Group
                            disabled={!this.state.currentPlayer}
                            options={this.state.checkBoxArray}
                            onChange={this.handleChangeBox}
                        /> 
                        : null}
                    </div>
                    <Button
                        style={{ marginBottom: '25px' }}
                        type="primary"
                        onClick={this.handleSubmitRegions}
                        disabled={!this.state.currentPlayer || !this.state.checkedItems.length}
                        loading={this.state.loadingSubmit}
                    >
                        Attribuer les régions sélectionnées
                    </Button>
                    <div id="players-have-regions">
                        {this.props.players.map(player => {

                            return (
                                <div id="player-has-regions" key={player.id}>
                                    <div id='player-has-regions-header'>
                                        <h3>{player.name}</h3>
                                    </div>
                                    <div id="has-regions">
                                        <PlayerHasRegions 
                                            player={player} 
                                            game={this.props.game} 
                                            loading={this.state.loadingSubmit}
                                            updateCheckbox={this.updateCheckboxArray}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div> 
                </div>
            </div>
        ); 
    }
}

export default GameIsNotReady;