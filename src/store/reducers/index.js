import { combineReducers } from 'redux';
import users from './users';

const mainReducer = combineReducers({
    users,
})

export default mainReducer;