import React from 'react';
import { Button, Card, Modal, Tooltip } from 'antd';
import { StepForwardOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { UserContext } from '../providers/userProvider';
import { getUserDocument } from '../config/firebase';
import * as gameTypes from '../store/types/game';

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
                name: 'Stark',
                color: 'grey',
                pic: stark,
            },{
                name: 'Lannister',
                color: 'yellow',
                pic: lannister,
            },{
                name: 'Baratheon',
                color: 'black',
                pic: baratheon,
            },{
                name: 'Tyrell',
                color: 'green',
                pic: tyrell,
            },{
                name: 'Martell',
                color: 'brown',
                pic: martell,
            }
        ],
        visible: false,
        user: null,
        factionClicked: {},
    }

    async componentDidMount() {
        const userId = this.context.uid;
        const user = await getUserDocument(userId);
        this.setState({ user });
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
            name: user.username,
            faction: factionClicked.name
        }
        this.props.addPlayer(player);
        this.setState({ 
            remainingFactions: [...this.state.remainingFactions.filter(faction => faction.name !== factionClicked.name)],
        });
        this.handleHideModal();
    }

    
    render() {

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
                        >
                            Répartissez les régions
                        </Button>
                        <div id="new-game-header">
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
                                {this.state.remainingFactions.map(faction => {
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
                                        <div>
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
                                        </div> : null
                                    }
                                </Modal>
                            </div>
                            {!userHasFaction ? <h2 style={{ textAlign: 'center' }}>Choisissez votre faction</h2> : null}
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