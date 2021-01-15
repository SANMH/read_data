import { LOGIN, LOGOUT } from '../constants/actions';


const initialState = {};

export default ( state = initialState, action ) => {
  switch( action.type ) {
    case LOGIN:
      return {
        ...state,
        uid: action.user
      };

    case LOGOUT:
      return {};

    default:
      return state;
  }
}