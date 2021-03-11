import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import { history } from '../store';
import styles from './usuarios_app.module.css';
import { Button, Modal } from 'antd';
import ShowUserRoutes from './ShowUserRoutes';

// Iniciar firebase si aún no está inicializado
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();
let firebaseDatabase = firebase.database();

const HomePage = () => {
	const [user, setUser] = useState(firebaseAuth.currentUser);
	const [userInfos, setUserInfos] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);
	const [showRoutesOfUser, setShowRoutesOfUser] = useState(null);

	useEffect(() => {
		// Almacenar el contenido de 'users' de la base de datos en la variable de estado 'userInfos'
		let ref = firebaseDatabase.ref('users');
		ref.on('value', (snapshot) => {
			const userInfosObject = snapshot.val();

			const userInfosList = Object.keys(userInfosObject).map((key) => ({
				...userInfosObject[key],
			}));

			setUserInfos(userInfosList);
		});
	}, []);

	useEffect(() => {
		//redirigir a la página de inicio si el usuario no es administrador
		if (user && user.email && localStorage.getItem('isAdmin') === 'false') {
			history.push('/');
		}
	}, [user]);

	// El componente UserCard muestra información y botones de"rutas" y "borrar" para cada usuario
	const UserCard = (userInfo) => {
		const { imagen, email, name, uid, register_at } = userInfo.userInfo;

		return (
			<div className={styles.UserCard}>
				<div className={styles.UserCard__upper}>
					<img
						className={styles.UserCard__photo}
						src={imagen}
						alt=""
					/>
					<div>
						<p>Nombre: {name}</p>
						<p>Email: {email}</p>
						<p>Día de Registro:{' '}
							{new Date(register_at).toLocaleDateString()}
						</p>
						<small>UID: {uid}</small>
					</div>
				</div>
				<div className={styles.UserCard__lower}>
					<Button type="primary"
						// Al hacer clic en el botón "Rutas" cargara el archivo ShowUserRoutes.js para mostrar todas las rutas para ese usuario
						onClick={() => setShowRoutesOfUser(userInfo.userInfo)}
						className={
							styles.UserCard__lowerItem +
							' ' +
							styles.userCard__btn
						}
					>
						<h3 style={{ color: 'white' }} >RUTAS</h3>
					</Button>

					<Button type="danger"
						onClick={() => {
							setUserToDelete({ uid, name, email });
							setIsModalVisible(true);
						}}
						className={
							styles.UserCard__lowerItem +
							' ' +
							styles.userCard__btn1
						}
					>
						<h3 style={{ color: 'white' }}>BORRAR</h3>
					</Button>
				</div>
			</div>
		);
	};

	return showRoutesOfUser ? (
		<ShowUserRoutes
			userInfo={showRoutesOfUser}
			hideUserRoutes={() => setShowRoutesOfUser(null)}
		/>
	) : (
			<div>
				<h1>Usuarios Registrados</h1>
				<p>Todos los usuarios que se hayan registrado apareceran aqui</p>
				<div className={styles.userCardContainer}>
					{userInfos.map((userInfo) => (
						<UserCard userInfo={userInfo} key={userInfo.uid} />
					))}
				</div>
				{userToDelete && (
					<Modal
						title={`Delete ${userToDelete.uid}?`}
						visible={isModalVisible}
						onOk={() => {
							setConfirmLoading(true);
							let ref = firebaseDatabase.ref(
								'users/' + userToDelete.uid,
							);
							// eliminar usuario de la colección "users" en la base de datos
							ref.remove();

							let ref1 = firebaseDatabase.ref('routes');
							ref1.on('value', (snapshot) => {
								const routesObject = snapshot.val();

								const userRoutes = Object.fromEntries(
									Object.entries(routesObject).filter(
										([key, value]) =>
											value.user === userToDelete.uid,
									),
								);

								// buscar todas las rutas que el usuario ha creado y eliminarlas una por una
								for (let route of Object.keys(userRoutes)) {
									let thisRouteRef = firebaseDatabase.ref(
										'routes/' + route,
									);
									thisRouteRef.remove();
								}
							});
							window.location.reload();
						}}
						confirmLoading={confirmLoading}
						onCancel={() => setIsModalVisible(false)}
					>
						<p>
							¿Estás seguro de que quieres eliminar al usuario y las rutas que ha registrado?{' '}<br />
						Name: {userToDelete.name} <br />
						UID: {userToDelete.uid} <br />
						email: {userToDelete.email}?
					</p>
					</Modal>
				)}
			</div>
		);
};

export default HomePage;
