import React, { useState, useEffect } from 'react';

import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import styles from './usuarios_app.module.css';
import { Map, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { Modal, Button } from 'antd';

// Iniciar firebase si aún no está inicializado
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseDatabase = firebase.database();

const ShowUserRoutes = (props) => {
	const { name, imagen, register_at, email, uid } = props.userInfo;
	const [allCoords, setAllCoords] = useState([]);

	useEffect(() => {
		let ref = firebaseDatabase.ref('routes');
		ref.on('value', (snapshot) => {
			const routesObject = snapshot.val();

			const routesList = Object.keys(routesObject).map((key) => ({
				...routesObject[key],
			}));
			const userRoutes = routesList.filter((route) => route.user === uid);

			let newAllCoords = [];
			userRoutes.map((route) => {
				if (route.points) {
					const routePoints = Object.keys(route.points).map(
						(key) => ({
							lat: route.points[key].lat,
							lng: route.points[key].lng,
						}),
					);
					newAllCoords.push(routePoints);
				}
			});

			setAllCoords(newAllCoords);
		});
	}, []);

	return (
		<>
			<Button type="danger"
				onClick={props.hideUserRoutes}
				className={styles.userCard__btn2}
			>
				<h3 style={{ color: 'white' }}>REGRESAR</h3>
			</Button>

			<div className={styles.UserCard1}>
				<div className={styles.UserCard__upper}>
					<img
						className={styles.UserCard__photo}
						src={imagen}
						alt=""
					/>
					<div>
						<p>Nombre: {name}</p>
						<p>Email: {email}</p>
						<p>Número de rutas: {allCoords.length}</p>
						<p>
							Dia de Registro:{' '}
							{new Date(register_at).toLocaleDateString()}
						</p>
						<small>UID: {uid}</small>
					</div>
				</div>
				
				
				<div className={styles.mapContainer}>
					{allCoords.length !== 0 && (
						<Map
							google={props.google}
							initialCenter={{
								lat: Object.entries(allCoords[0])[0][1].lat,
								lng: Object.entries(allCoords[0])[0][1].lng,
							}}
							style={{
								width: '90%',
								height: '80%',
								
							}}
							className={'map'}
							zoom={16}
						>
							{allCoords.map((poly, index) => (
								<Polyline
									key={index}
									path={poly}
									strokeColor="#0000FF"
									strokeOpacity={0.8}
									strokeWeight={2}
								/>
							))}
						</Map>
					)}
				</div>
			</div>
		</>
	);
};

export default GoogleApiWrapper({
	apiKey: 'AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow',
})(ShowUserRoutes);
