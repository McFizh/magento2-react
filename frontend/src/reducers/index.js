import { combineReducers } from 'redux';

import CategoryReducer from './reducer_categories';

const rootReducer = combineReducers({
    categories: CategoryReducer,
});


export default rootReducer;
