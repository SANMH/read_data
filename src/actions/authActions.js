import { LOGIN } from '../constants/routes';
import { doLogout } from '../firebase';
import { history } from '../store';
import { LOGIN as LOGIN_ACTION, LOGOUT } from '../constants/actions';

export const startSetLoginState = ( user ) => {
  return dispatch => {
    console.log( 'uid', user );
    dispatch( loginAction( user ) );
  };
};

export const loginAction = ( user ) => {
  return {
    type: LOGIN_ACTION,
    user
  };
};

export const startLogout = () => {
  return dispatch => {
    doLogout()
      .then( () => {
        dispatch( logoutAction() );
        history.push( LOGIN );
        window.location.reload();
      } )
      .catch();

  };
};

export const logoutAction = () => ({
  type: LOGOUT
});