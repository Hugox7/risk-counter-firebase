import { combineReducers } from 'redux';
import * as gameTypes from '../types/game';

const gameHasPlayersInitState = {
    players: [],
}

const handlePlayers = (state = gameHasPlayersInitState, action) => {
    switch (action.type) {
        case gameTypes.ADD_PLAYER_TO_GAME:
            return {
                players: [...state.players, action.data],
            };
        case gameTypes.REMOVE_PLAYER_FROM_GAME:
            return {
                players: [...state.players.filter(player => player.id !== action.id)]
            };
        default:
            return state;
    }
}

export default combineReducers({
    handlePlayers,
})