import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from '../containers/NotFoundPage';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import {
	ABOUT,
	HOME,
	INICIO,
	LOGIN,
	MAPAJS,
	RUTAS,
	ADMIN,
} from '../constants/routes';

const AsyncLogin = Loadable({
	loader: () => import('../containers/LoginPage'),
	loading: Loading,
});

const AsyncHome = Loadable({
	loader: () => import('../containers/HomePage'),
	loading: Loading,
});

const AsyncRutas = Loadable({
	loader: () => import('../containers/Rutas'),
	loading: Loading,
});

const AsyncAbout = Loadable({
	loader: () => import('../containers/AboutPage'),
	loading: Loading,
});

const AsyncMapajs = Loadable({
	loader: () => import('../Creacion_BiciRutas/index'),
	loading: Loading,
});

const AsyncInicio = Loadable({
	loader: () => import('../usuarios_app/index'),
	loading: Loading,
});

const AsyncAdmin = Loadable({
	loader: () => import('../BiciRutas/index'),
	loading: Loading,
});

const AppRouter = () => {
	return (
		<Switch>
			<PrivateRoute exact={true} path={HOME} component={AsyncHome} />

			<PrivateRoute exact={true} path={RUTAS} component={AsyncRutas} />
			<PrivateRoute exact={true} path={MAPAJS} component={AsyncMapajs} />
			<PrivateRoute exact={true} path={INICIO} component={AsyncInicio} />
			<PrivateRoute exact={true} path={ADMIN} component={AsyncAdmin} />

			<PublicRoute path={LOGIN} component={AsyncLogin} />
			<PublicRoute path={ABOUT} component={AsyncAbout} />

			<Route component={NotFoundPage} />
		</Switch>
	);
};

export default AppRouter;
