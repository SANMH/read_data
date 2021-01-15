import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { history } from '../store';
import { HOME, LOGIN } from '../constants/routes';

const PublicRoute = ( {
  isAuthenticated,
  component: Component,
  ...rest
} ) => (
  <Route { ...rest } component={ ( props ) => (
    isAuthenticated
      &&
      (
        history.location.pathname === LOGIN
        // history.location.pathname === LOGIN_TEACHER ||
        // history.location.pathname === REGISTRATION_TEACHER ||
        // history.location.pathname === REGISTRATION_STUDENT
      )
      ? <Redirect to={ ( history.location.state && history.location.state.from.pathname ) || HOME } />
      : <Component { ...props } />
  ) }
  />
);

const mapStateToProps = ( state ) => ({
  isAuthenticated: !!state.auth.uid
});

export default connect( mapStateToProps )( PublicRoute );
