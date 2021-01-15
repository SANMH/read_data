import React from 'react';
import { connect } from 'react-redux';
import { startLogout } from '../actions/authActions';
import { Button, Icon } from 'antd';

const LogoutButton = (props) => (
  <Button htmlType='button' onClick={ props.startLogout }>
    <Icon type='logout' /> <span>Cerrar sesión</span>
  </Button>
);


const mapDispatchToProps = ( dispatch ) => ({
  startLogout: () => {
    console.log( 'logout??' );
    dispatch( startLogout() )
  }
});

export default connect( null, mapDispatchToProps )( LogoutButton );