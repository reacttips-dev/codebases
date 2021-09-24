import React, {useReducer, useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import composerReducer, {init as composerInit} from './reducers';
import {COMPOSER_POST_CHANGE} from './actions';
import {PostType} from '../types';
import debug from 'debug';

const logger = debug('composer');

export const logDispatch = func => (state, action) => {
  logger('dispatch');
  logger(`before`, state);
  logger(`action`, action);
  const newState = func(state, action);
  logger(`after`, newState);
  return newState;
};

export const logInit = func => props => {
  const state = func(props);
  logger(`initial state`, state);
  return state;
};

export const DispatchContext = React.createContext();
export const StateContext = React.createContext();

const Provider = ({
  children,
  reducer = composerReducer,
  init = composerInit,
  debug = false,
  ...props
}) => {
  const [state, dispatchFunc] = useReducer(
    useMemo(() => (debug ? logDispatch(reducer) : reducer), []),
    props,
    useMemo(() => (debug ? logInit(init) : init), [])
  );

  useEffect(() => {
    dispatch({type: COMPOSER_POST_CHANGE, post: props.post});
  }, [props.post]);

  // Keeping this code to check the redux calls
  const dispatch = props => {
    // console.log('dispatch -> props', props);
    dispatchFunc({...props});
  };
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
  reducer: PropTypes.func,
  init: PropTypes.func,
  debug: PropTypes.bool,
  post: PostType
};

export default Provider;
