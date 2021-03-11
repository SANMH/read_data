import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import Firebase from 'firebase';
import { Map, GoogleApiWrapper, Polyline, InfoWindow } from 'google-maps-react';
import { DatePicker } from 'antd';
import moment from 'moment';

// Inicializar aplicaciones y autenticación de Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}
let firebaseAuth = firebase.auth();

class Rutas extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			markers: [],
			selectedUser: '',
			user: firebaseAuth.currentUser,
			points: {},
			showAll: false,
			selectedDate: moment(),
			users: {},
			hoverTitle: '',
			hoverPosition: {},
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		// Establecer "marcadores" de variable de estado con el contenido de "rutas" de Firebase DB
		let ref = Firebase.database().ref('routes');
		ref.on('value', (snapshot) => {
			const markersObject = snapshot.val();

			const markersList = Object.keys(markersObject).map((key) => ({
				...markersObject[key],
				uid: key,
			}));

			this.setState({
				markers: markersList,
				showAll: true,
			});
		});

		// Establezca la variable de estado "users" con el contenido de "users" de Firebase DB
		let ref1 = Firebase.database().ref('users');
		ref1.on('value', (snapshot) => {
			const usersObject = snapshot.val();

			this.setState({
				users: usersObject,
				loading: false,
			});
		});
	}

	render() {
		const { markers, loading, showAll, selectedDate } = this.state;

		// La variable allCoords almacenará todas las rutas de todos los usuarios SOLO para la fecha seleccionada
		var allCoords = [];

		markers.map((route) => {
			// hacer variables temporales de "coords" para almacenar detalles sobre una sola ruta
			var coords = [];

			if (route && route.points) {
				Object.keys(route.points).map((key) => {
					var lat = route.points[key].lat;
					var lng = route.points[key].lng;
					coords.push({
						lat,
						lng,
						name: this.state.users[route.user].name,
					});
				});

				// envia la variable "coords" a la variable global allCoords SÓLO si la fecha coincide con la fecha seleccionada
				var timestamp = route.finished_at;
				if (
					moment(selectedDate).format('DD-MM-YYYY') ===
					moment(timestamp).format('DD-MM-YYYY')
				) {
					allCoords.push(coords);
				}
			}
		});

		return (
			<div>
				<h1>Rutas de Usuarios App City On Bike</h1>

				<DatePicker
					value={selectedDate}
					allowClear={false}
					onChange={(newDate) =>
						this.setState({ selectedDate: newDate })
					}
				/>

				{loading && <div>Cargando ...</div>}

				<br />
				<br />

				{showAll &&
					allCoords &&
					allCoords[0] &&
					allCoords[Object.keys(allCoords)[0]] &&
					allCoords[Object.keys(allCoords)[0]][0] && (
						<Map
							initialCenter={{
								lat: Object.entries(allCoords[0])[0][1].lat,
								lng: Object.entries(allCoords[0])[0][1].lng,
							}}
							google={this.props.google}
							style={{
								width: '100%',
								height: '100%',
							}}
							className={'map'}
							zoom={16}
							onClick={this.onPointMap}
						>
							<InfoWindow
								position={this.state.hoverPosition}
								visible={this.state.hoverPosition !== {}}
							>
								<div>
									<h1>{this.state.hoverTitle}</h1>
								</div>
							</InfoWindow>

							{allCoords.map((poly, index) => (
								<Polyline
									onClick={(t, map, coord) => {
										const { latLng } = coord;
										const lat = latLng.lat();
										const lng = latLng.lng();

										this.setState({
											hoverTitle: poly[0].name,
											hoverPosition: {
												lat,
												lng,
											},
										});
									}}
									key={index}
									path={poly}
									strokeColor="#0000FF"
									strokeOpacity={0.8}
									strokeWeight={2}
								/>
							))}
						</Map>
					)}

				{/* Muestra el mensaje "No hay rutas en esta fecha" si no existen rutas para la fecha seleccionada. */}
				{(!allCoords ||
					!allCoords[0] ||
					!allCoords[Object.keys(allCoords)[0]] ||
					!allCoords[Object.keys(allCoords)[0]][0]) &&
					!loading && <h1>No hay rutas en esta fecha</h1>}
			</div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow',
})(Rutas);
