import React, { useState, useEffect } from 'react';

import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import { history } from '../store';

// Iniciar firebase si aún no está inicializado
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();

const HomePage = () => {
	const [user, setUser] = useState(firebaseAuth.currentUser);

	useEffect(() => {
		// redirect to home page if user is not admin
		if (user && user.email && localStorage.getItem('isAdmin') === 'false') {
			history.push('/');
		}
	}, [user]);

	return (
		<div>
			<h1>Usuarios Registrados</h1>
			<p>
				Todos los usuarios que se hayan registrado apareceran aqui
			</p>
		</div>
	);
};

export default HomePage;
