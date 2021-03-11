import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './store';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import './styles/index.css';
import { LocaleProvider } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import 'moment/locale/es';
import { listenAuthState } from './firebase';
import { startSetLoginState } from './actions/authActions';
import 'leaflet/dist/leaflet.css';


const store = configureStore(/* proporcionar el estado inicial si lo hay */ );

const target = document.querySelector( '#root' );

listenAuthState( authUser => {
  if( authUser ) {
    store.dispatch( startSetLoginState( authUser.uid ) );
    renderApp();
  } else {
    store.dispatch( startSetLoginState( null ) );
    renderApp();
  }
} );

const renderApp = () => render(
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <LocaleProvider locale={ esES }>
        <App />
      </LocaleProvider>
    </ConnectedRouter>
  </Provider>,
  target
);

// Si desea que su aplicación funcione sin conexión y se cargue más rápido, puede cambiar
// anular el registro () para registrar () a continuación. Tenga en cuenta que esto conlleva algunas dificultades.
// Obtenga más información sobre los trabajadores del servicio: http://bit.ly/CRA-PWA
serviceWorker.unregister();