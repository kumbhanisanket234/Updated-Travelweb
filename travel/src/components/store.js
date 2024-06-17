import { createStore } from 'redux';

const initialState = {
    user: {},
};

const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const clearUser = () => ({
    type: CLEAR_USER,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case CLEAR_USER:
            return {
                ...state,
                user: {},
            };
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;
