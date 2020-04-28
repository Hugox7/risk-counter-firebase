import React from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import { firestore } from '../config/firebase';

import './gameCard.css';

moment.locale('fr');

const GameCard = ({ game, history }) => {

    const date = moment(new Date(game.creation)).format('Do MMMM YYYY, HH[h]mm');
    const statut = game.isReady ? 'En cours' : 'En cours de création'

    const handleRedirect = () => {
        history.push(`/game/${game.id}`);
    }

    return (
        <div 
            id='game-card'
            onClick={handleRedirect}
        >
            <h3>{date}</h3>
            <p>{`Créé par : ${game.creatorName}`}</p>
            <p>{`Statut : ${statut}`}</p>
            <p>{`Nombre de joueurs : ${game.guests.length + 1}`}</p>
        </div>
    )
}

export default GameCard;