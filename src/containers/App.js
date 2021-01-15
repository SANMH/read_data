import React from 'react';
import Navigation from '../components/Navigation';
import AppRouter from '../routers/AppRouter';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { Icon, Layout } from 'antd';
import '../styles/app.css';

const {
  Header, Content, Footer, Sider
} = Layout;

class App extends React.Component {

  state = {
    collapsed: false
  };

  // onCollapse = ( collapsed, type ) => { console.log( collapsed, type ); };

  toggle = () => {
    this.setState( {
      collapsed: !this.state.collapsed
    } );
  };

  componentWillMount() {
    console.log( 'APP MOUNTED' );
  }

  render() {
    return (
      <Layout className='app'>
        <Sider
          trigger={ null }
          breakpoint='lg'
          collapsedWidth='0'
          onBreakpoint={ ( broken ) => { this.setState( { collapsed: broken } ); } }
          collapsed={ this.state.collapsed }
          className='sider'
        >
          <div className='sider__logo' />
          <Navigation />
        </Sider>

        <Layout>

          <Header className="header">
            <Icon
              className='header__trigger'
              type={ this.state.collapsed
                ? 'menu-unfold'
                : 'menu-fold' }
              onClick={ this.toggle }
            />
          </Header>

          <Content className='content'>
            <AppRouter />
          </Content>

          <Footer className='footer'>
            BiciRuta 2020
          
          </Footer>

          </Layout>

      </Layout>

    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  startSetLoginState: ( uid ) => {
    console.log( 'uid', uid );
    dispatch( startSetLoginState( {
      uid
    } ) );
  }
});

export default connect( mapStateToProps, mapDispatchToProps )( App );