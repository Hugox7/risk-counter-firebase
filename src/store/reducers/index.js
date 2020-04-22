import { combineReducers } from 'redux';
import game from './game';

const mainReducer = combineReducers({
    game,
})

export default mainReducer;