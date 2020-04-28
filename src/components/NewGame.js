import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Card, Modal, Input } from 'antd';
import { StepForwardOutlined, RollbackOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { UserContext } from '../providers/userProvider';
import { getUserDocument, getUserFriends, firestore } from '../config/firebase';
import * as gameTypes from '../store/types/game';
import { regions as regionsArray } from '../regions/regions';

import './newGame.css';

import lannister from '../assets/lannister.jpg';
const stark = require('../assets/stark.jpg');
const baratheon = require('../assets/baratheon.jpg');
const tyrell = require('../assets/tyrell.jpg');
const martell = require('../assets/martell.jpeg');

class NewGame extends React.Component {
    static contextType = UserContext;

    state = {
        remainingFactions: [
            {   
                id: 1,
                name: 'Stark',
                color: '#8B847D',
                pic: stark,
            },{
                id: 2,
                name: 'Lannister',
                color: '#EEC244',
                pic: lannister,
            },{
                id: 3,
                name: 'Baratheon',
                color: 'black',
                pic: baratheon,
            },{
                id: 4,
                name: 'Tyrell',
                color: '#AFD98C',
                pic: tyrell,
            },
            {
                id: 5,
                name: 'Martell',
                color: '#B15F3E',
                pic: martell,
            }
        ],
        visible: false,
        user: null,
        factionClicked: {},
        value: '',
        friends: [],
        friendsWithInfos: [],
        friendFromQuery: null,
        loading: false,
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        const friends = await getUserFriends(userId);
        this.setState({ user, friends });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.friends !== this.state.friends) {
            let friendsWithInfos = [];
            this.state.friends.forEach(async friend => {
                const user = await firestore.collection('users').doc(friend.id).get();
                friendsWithInfos.push(user.data());
            });
            this.setState({ friendsWithInfos }, () => console.log(this.state));
        }
    }

    componentWillUnmount() {
        this.props.game.forEach(player => {
            this.props.removePlayer(player.id);
        })
    }

    handleShowModal = (faction) => {
        this.setState({ visible: true, factionClicked: faction });
    }

    handleHideModal = () => {
        this.setState({ visible: false });
    }

    handleAddPlayer = () => {
        const { factionClicked, user } = this.state;
        const player = {
            id: user.id,
            idFaction: factionClicked.id,
            name: user.username,
            faction: factionClicked.name,
            color: factionClicked.color,
            pic: factionClicked.pic,
        }
        this.props.addPlayer(player);
        this.setState({ 
            remainingFactions: [...this.state.remainingFactions.filter(faction => faction.name !== factionClicked.name)],
        });
        this.handleHideModal();
    }

    handleAddFriend = () => {
        const {factionClicked, friendFromQuery} = this.state;
        const friend = {
            id: friendFromQuery.id,
            idFaction: factionClicked.id,
            name: friendFromQuery.username,
            faction: factionClicked.name,
            color: factionClicked.color,
            pic: factionClicked.pic,
        }
        this.props.addPlayer(friend);
        this.setState({
            remainingFactions: [...this.state.remainingFactions.filter(faction => faction.name !== factionClicked.name)],
            friendFromQuery: null,
            value: '',
        });
        this.handleHideModal();
    }

    handleRemovePlayer = (player) => {
        const { remainingFactions } = this.state;
        this.props.removePlayer(player.id);
        const factionReturned = {
            id: player.idFaction,
            name: player.faction,
            color: player.color,
            pic: player.pic,
        }
        this.setState({
            remainingFactions: [...remainingFactions, factionReturned],
        });
    }

    handleChange = async (e) => {
        await this.setState({ [e.target.name]: e.target.value });
        if (this.state.value.length) {
            let friendFromQuery = await this.state.friendsWithInfos.find(friend => friend.username === this.state.value);
            if (friendFromQuery) {
                await this.setState({ friendFromQuery });
            } else {
                await this.setState({ friendFromQuery: null });
            }
        } else {
            await this.setState({ friendFromQuery: null });
        }
    }

    handleLaunchGame = async () => {
        let guests = [];
        const uuid = uuidv4();
        const gameRef =  firestore.collection('games').doc(uuid);
        await this.setState({ loading: true });
        await gameRef.set({
                id: uuid,
                creation: Date.now(),
                creator: this.state.user.id,
                creatorName: this.state.user.username,
                isReady: false,
                
            });
        await this.props.game.forEach(async elem => {
            await gameRef.collection('players').doc(elem.id).set(elem);
        });
        await regionsArray.forEach(async item => {
            await gameRef.collection('regions').doc(item.name).set(item);
        });
        await this.props.game.forEach(async elem => {
            if (elem.id !== this.state.user.id) {
                guests.push(elem.id);
            } 
        });
        await gameRef.update({
            guests
        });
        await this.props.history.push(`/game/${uuid}`);
    }

    
    render() {

        const sortByFactionId = (a, b) => {
            if (a.id > b.id) return 1;
            if (b.id > a.id) return -1;
            return 0;
        }

        const { Meta } = Card;
        const { user } = this.state;
        const { game } = this.props;
        

        if (!user) {
            return <div>Loading...</div>
        } else {

            const userHasFaction = this.props.game.find(player => player.id === user.id)

            return (
                <div id="new-game">
                    <div id="new-game-content"> 
                        <Button 
                            icon={<StepForwardOutlined />} 
                            type="primary" 
                            id="next-page-button"
                            disabled={game.length < 2}
                            onClick={this.handleLaunchGame}
                            loading={this.state.loading}
                        >
                            Commencer la partie !
                        </Button>
                        <div loading={this.state.loading} id="new-game-header">
                            <h2>Lancer une nouvelle partie</h2>
                            <Button
                                onClick={() => this.props.history.push('/')}
                                icon={<RollbackOutlined />}
                            >
                                Retour
                            </Button>
                        </div>
                        <div id="new-game-form">
                            <p style={{ textAlign: 'center', fontSize: '16px' }}>
                                Choisissez votre famille et combattez pour le trône de fer. 
                                Vous avez le choix entre les Stark, les Baratheon, les Lannister, les Tyrell et les Martell.
                                De 2 à 5 joueurs.<br />Invitez vos amis pour des parties épiques.
                            </p>
                            <div id="houses">
                                {this.state.remainingFactions.sort(sortByFactionId).map(faction => {
                                    return (
                                        <Card
                                            key={faction.name}
                                            hoverable
                                            style={{ width: 170, margin: '10px'}}
                                            cover={<img alt="example" src={faction.pic} />}
                                            onClick={() => this.handleShowModal(faction)}
                                        >
                                            <Meta title={faction.name} />
                                        </Card>
                                    );
                                })}
                                <Modal
                                    visible={this.state.visible}
                                    onCancel={this.handleHideModal}
                                    footer={null}
                                    >
                                    {!userHasFaction ?
                                        <div style={{ height: '100%' }}>
                                            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                {`Etes-vous sur de vouloir jouer la maison ${this.state.factionClicked.name} ?`}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button 
                                                    style={{ marginRight: '5px' }}
                                                    onClick={this.handleAddPlayer}
                                                >
                                                    Oui
                                                </Button>
                                                <Button 
                                                    style={{ marginLeft: '5px' }}
                                                    onClick={this.handleHideModal}
                                                >
                                                    Non
                                                </Button>
                                            </div>
                                        </div> : 
                                        <div id="add-friend-to-game">
                                            <h3>{`Choisir un ami pour jouer la maison ${this.state.factionClicked.name}`}</h3>
                                            <Input 
                                                width='100%' 
                                                style={{ marginTop: '10px' }}
                                                placeholder="Ajoutez vos amis à la partie"
                                                name="value"
                                                onChange={this.handleChange}
                                                value={this.state.value}
                                            />
                                            {this.state.friendFromQuery 
                                                ? <div onClick={this.handleAddFriend} id='query-result'>
                                                    {this.state.friendFromQuery.username}
                                                </div> : null
                                            }
                                        </div>
                                    }
                                </Modal>
                            </div>
                            {!userHasFaction ? 
                                <h2 style={{ textAlign: 'center' }}>Choisissez votre maison</h2> 
                                : <h2 style={{ textAlign: 'center' }}>Ajoutez d'autres joueurs</h2>
                        
                            }
                            <div id="game-current-players">
                                {this.props.game.map(player => {
                                    return (
                                        <div key={player.id} id="current-player-card" style={{ border: `2px solid ${player.color}` }}>
                                            <h2>{`${player.name}`}</h2>
                                            <p>{`maison ${player.faction}`}</p>
                                            <Button 
                                                icon={<DeleteOutlined />}
                                                style={{ position: 'absolute', top: -15, right: -15 }}
                                                shape="circle"
                                                onClick={() => this.handleRemovePlayer(player)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>  
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    game: state.game.handlePlayers.players,
  });

  const mapDispatchToProps = (dispatch) => ({
      addPlayer: (data) => {
          dispatch({ type: gameTypes.ADD_PLAYER_TO_GAME, data })
      },
      removePlayer: (id) => {
        dispatch({ type: gameTypes.REMOVE_PLAYER_FROM_GAME, id })
      },
  });

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);