import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { message } from 'antd';
import { translateMessage } from '../helpers/translateMessage';
import { LOGIN } from '../constants/routes';

const PrivateRoute = ( {
  isAuthenticated,
  component: Component,
  redirectTo,
  ...rest
} ) => {
  const getComponent = ( props ) => {
    if( isAuthenticated ) {
      return <Component { ...props } />;
    } else {
      message.info( translateMessage( 'auth/requires-login' ), 5 );
      return (
        <Redirect to={ {
          pathname: redirectTo || LOGIN,
          state: { from: props.location }
        } } />
      );
    }
  };

  return <Route { ...rest } component={ getComponent } />;
};

const mapStateToProps = ( state ) => ({
  isAuthenticated: !!state.auth.uid
});

export default connect( mapStateToProps )( PrivateRoute );
