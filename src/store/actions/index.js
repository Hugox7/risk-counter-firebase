import * as gameTypes from '../types/game';

export const addPlayerToGame = (data) => ({
    type: gameTypes.ADD_PLAYER_TO_GAME,
    data,
});

export const removePlayerFromGame = (id) => ({
    type: gameTypes.REMOVE_PLAYER_FROM_GAME,
    id,
});