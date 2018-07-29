import { FETCH_CATEGORIES } from '../actions/index.js';

export default function(state = [], action) {
    switch(action.type) {
        case FETCH_CATEGORIES:
            return action.payload.data;
        default:
            return state;
    }
}
