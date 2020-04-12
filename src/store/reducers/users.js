import { combineReducers } from 'redux';
import * as userTypes from '../types/users';

const getUsersInitState = {
    users: [],
    error: null,
    loading: false,
}

const getUserInitState = {
    user: {},
    error: null,
    loading: false,
}

const addUserInitState = {
    user: {},
    error: null,
    loading: false,
}

const modifyUserInitState = {
    user: {},
    error: null,
    loading: false,
}

const deleteUserInitState = {
    error: null,
    loading: false,
    data: null,
}

const getUsers = (state = getUsersInitState, action) => {
    switch (action.type) {
        case userTypes.GET_USERS:
            return {
                ...getUsersInitState,
                loading: true,
            };
        case userTypes.GET_USERS_SUCCESS:
            return  {
                ...getUsersInitState,
                loading: false,
                users: action.data,
            };
        case userTypes.GET_USERS_FAIL:
            return  {
                ...getUsersInitState,
                loading: false,
                error: action.data,
            };
        default:
            return state;
    }
}

const getUser = (state = getUserInitState, action) => {
    switch (action.type) {
        case userTypes.GET_USER:
            return {
                ...getUserInitState,
                loading: true,
            };
        case userTypes.GET_USER_SUCCESS:
            return  {
                ...getUserInitState,
                loading: false,
                user: action.data,
            };
        case userTypes.GET_USER_FAIL:
            return  {
                ...getUserInitState,
                loading: false,
                error: action.data,
            };
        default:
            return state;
    }
}

const addUser = (state = addUserInitState, action) => {
    switch (action.type) {
        case userTypes.ADD_USER:
            return {
                ...addUserInitState,
                loading: true,
            };
        case userTypes.ADD_USER_SUCCESS:
            return  {
                ...addUserInitState,
                loading: false,
                user: action.data,
            };
        case userTypes.ADD_USER_FAIL:
            return  {
                ...addUserInitState,
                loading: false,
                error: action.data,
            };
        default:
            return state;
    }
}

const modifyUser = (state = modifyUserInitState, action) => {
    switch (action.type) {
        case userTypes.MODIFY_USER:
            return {
                ...modifyUserInitState,
                loading: true,
            };
        case userTypes.MODIFY_USER_SUCCESS:
            return  {
                ...modifyUserInitState,
                loading: false,
                user: action.data,
            };
        case userTypes.MODIFY_USER_FAIL:
            return  {
                ...modifyUserInitState,
                loading: false,
                error: action.data,
            };
        default:
            return state;
    }
}

const deleteUser = (state = deleteUserInitState, action) => {
    switch (action.type) {
        case userTypes.DELETE_USER:
            return {
                ...modifyUserInitState,
                loading: true,
            };
        case userTypes.DELETE_USER_SUCCESS:
            return  {
                ...modifyUserInitState,
                loading: false,
                user: action.data,
            };
        case userTypes.DELETE_USER_FAIL:
            return  {
                ...modifyUserInitState,
                loading: false,
                error: action.data,
            };
        default:
            return state;
    }
}

export default combineReducers({
    getUsers,
    getUser,
    addUser,
    modifyUser,
    deleteUser,
})