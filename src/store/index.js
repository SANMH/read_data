import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory as createHistory } from 'history'

import createRootReducer from '../reducers';

export const history = createHistory();

const enhancers = [];
const middleware = [
  thunk,
  routerMiddleware( history )
];

if( process.env.NODE_ENV === 'development' ) {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  if( typeof devToolsExtension === 'function' ) {
    enhancers.push( devToolsExtension() );
  }
}

const composedEnhancers = compose(
  applyMiddleware( ...middleware ),
  ...enhancers
);

export default function configureStore( preloadedState ) {
  return createStore(
    createRootReducer( history ), // root reducer with router state
    preloadedState,
    composedEnhancers
  );
}
