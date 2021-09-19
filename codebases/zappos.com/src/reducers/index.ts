import { combineReducers } from 'redux';

import addAbReducer from 'reducers/abReducer';
import commonReducers from 'reducers/commonReducers';

const reducers = (extraReducers = {}) => combineReducers(addAbReducer({ ...commonReducers, ...extraReducers }));

export default reducers;

