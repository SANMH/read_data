import React, { Component } from 'react';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd';
import { doSignInWithEmailAndPassword } from '../firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';

const hasErrors = ( fieldsError ) => {
  return Object.keys( fieldsError ).some( field => fieldsError[ field ] );
};

class LoginForm extends Component {

  initialState = {
    email: '',
    password: ''
  };

  constructor( props ) {
    super( props );
    this.state = this.initialState;
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = ( e ) => {
    e.preventDefault();
    this.props.form.validateFields( ( err, values ) => {
      if( !err ) {
        console.log( 'Received values of form: ', values );
        const { email, password } = values;

        doSignInWithEmailAndPassword( email, password )
          .then( authUser => {
            this.props.startSetLoginState( authUser.uid );
            window.location.reload();
          } )
          .catch( error => {
            console.log( 'error', error );
            message.error( translateMessage( error.code ) );
          } );
      }
    } );
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const emailError = isFieldTouched( 'email' ) && getFieldError( 'email' );
    const passwordError = isFieldTouched( 'password' ) && getFieldError( 'password' );

    return (
      <Form onSubmit={ this.handleSubmit } className='login-form'>
        <Form.Item validateStatus={ emailError
          ? 'error'
          : '' }
                   help={ emailError || '' }>
          { getFieldDecorator( 'email', {
            rules: [
              {
                type: 'email',
                message: 'Ingresa un correo electrónico válido'
              },
              {
                required: true,
                message: 'Ingresa el correo electrónico'
              }
            ]
          } )(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                   placeholder='Correo'
                   autoComplete="email"
            />
          ) }
        </Form.Item>
        <Form.Item validateStatus={ passwordError
          ? 'error'
          : '' }
                   help={ passwordError || '' }>
          { getFieldDecorator( 'password', {
            rules: [
              {
                required: true,
                message: 'Ingresa la clave'
              }
            ]
          } )(
            <Input prefix={ <Icon type='lock' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                   type='password'
                   placeholder='Clave'
                   autoComplete="password" />
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'remember', {
            valuePropName: 'checked',
            initialValue: true
          } )(
            <Checkbox>Recordarme</Checkbox>
          ) }
          <Button type='primary'
                  htmlType='submit'
                  className='login-form-button'
                  disabled={ hasErrors( getFieldsError() ) }>
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetLoginState: ( uid ) => dispatch( startSetLoginState( uid ) )
});

export default compose(
  withRouter,
  Form.create( { name: 'login_form' } ),
  connect( null, mapDispatchToProps )
)( LoginForm );