import { Icon, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../styles/navigation.css';
import { ABOUT } from '../constants/routes';

import { RUTAS } from '../constants/routes';
import { MAPAJS } from '../constants/routes';
import { INICIO } from '../constants/routes';
import { ADMIN } from '../constants/routes';

import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';

// Iniciar firebase si aún no está inicializado
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();

const SubMenu = Menu.SubMenu;

class Navigation extends React.Component {
	rootSubmenuKeys = ['sub1', 'sub2'];

	state = {
		current: 'home',
		collapsed: false,
		openKeys: [],
		user: firebaseAuth.currentUser,
		isAdmin: localStorage.getItem('isAdmin'),
	};

	onOpenChange = (openKeys) => {
		const latestOpenKey = openKeys.find(
			(key) => this.state.openKeys.indexOf(key) === -1,
		);
		if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			this.setState({ openKeys });
		} else {
			this.setState({
				openKeys: latestOpenKey ? [latestOpenKey] : [],
			});
		}
	};

	handleClick = (e) => {
		console.log('click ', e);
		this.setState({
			current: e.key,
		});
	};

	render() {
		return this.props.isAuthenticated ? (
			<Menu
				onClick={this.handleClick}
				openKeys={this.state.openKeys}
				mode="inline"
				theme="light"
				inlineCollapsed={this.state.collapsed}
				onOpenChange={this.onOpenChange}
				className="menu"
			>
				<Menu.Item key="home">
					<Link to="/">
						<Icon type="home" /> <span>Inicio</span>
					</Link>
				</Menu.Item>

				<Menu.Item key="rutas">
					<span>
						<Icon type="environment" />
						<span>
							<Link to={RUTAS}>Rutas ciclistas</Link>
						</span>
					</span>
				</Menu.Item>


				{this.state.isAdmin === 'true' && (
					<Menu.Item key="admin">
						<span>
							<Icon type="eye" />
							<span>
								<Link to={ADMIN}>BiciRutas</Link>
							</span>
						</span>
					</Menu.Item>
				)}

				{/* Mostrar opciones solo si es administrador */}
				{this.state.isAdmin === 'true' && (
					<Menu.Item key="mapa">
						<span>
							<Icon type="edit" />
							<span>
								<Link to={MAPAJS}>Creacion de BiciRutas</Link>
							</span>
						</span>
					</Menu.Item>
				)}

				

				{this.state.isAdmin === 'true' && (
					<Menu.Item key="inicio">
						<span>
							<Icon type="team" />
							<span>
								<Link to={INICIO}>Usuarios CituOnBike</Link>
							</span>
						</span>
					</Menu.Item>
				)}

				<Menu.Item key="about">
					<span>
						<Icon type="idcard" />
						<span>
							<Link to={ABOUT}>Acerca de la página</Link>
						</span>
					</span>
				</Menu.Item>
				<Menu.Item key="logout">
					<LogoutButton />
				</Menu.Item>
			</Menu>
		) : null;
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: !!state.auth.uid,
});

export default connect(mapStateToProps)(Navigation);
