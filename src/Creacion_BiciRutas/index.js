import React, { Component } from 'react';
import {
	Map,
	InfoWindow,
	Marker,
	GoogleApiWrapper,
	Polyline,
} from 'google-maps-react';

import { message, Button } from 'antd';

import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import { history } from '../store';

// Iniciar firebase si aún no está inicializado
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();
let firebaseDatabase = firebase.database();

class MainMap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: firebaseAuth.currentUser,
			markers: [
				{
					//title: "The marker`s title will appear as a tooltip.",
					//name: "SOMA",
					//position: { lat: -0.24542770000000003, lng: -78.5309735 },
				},
			],
			markers1: [{}],
			markerList: [
				{
					//lat: "",
					//lng: "",
					//timestamp: Date.now()
				},
			],
			routeName: '',
			hoverTitle: '',
			hoverPosition: {},
			currentSeq: 0,
		};
		this.onPointMap = this.onPointMap.bind(this);
	}

	dateConvert = (fromDate) => {
		const formattedDate =
			fromDate.getFullYear() +
			'-' +
			(fromDate.getMonth() + 1 > 9
				? fromDate.getMonth() + 1
				: '0' + fromDate.getMonth() + 1) +
			'-' +
			(fromDate.getDate() > 9
				? fromDate.getDate()
				: '0' + fromDate.getDate()) +
			' ' +
			(fromDate.getHours() > 9
				? fromDate.getHours()
				: '0' + fromDate.getHours()) +
			':' +
			(fromDate.getMinutes() > 9
				? fromDate.getMinutes()
				: '0' + fromDate.getMinutes()) +
			':' +
			(fromDate.getSeconds() > 9
				? fromDate.getSeconds()
				: '0' + fromDate.getSeconds());
		return formattedDate;
	};

	//aqui se crea el marcador
	onPointMap(t, map, coord) {
		const { latLng } = coord;
		const lat = latLng.lat();
		const lng = latLng.lng();

		this.setState((previousState) => {
			return {
				markers: [
					...previousState.markers,
					{
						title: '',
						name: '',
						position: { lat, lng },
					},
				],
				markerList: [
					...previousState.markerList,
					{
						lat: lat,
						lng: lng,
						timestamp: Date.now(),
					},
				],
			};
		});
	}

	handleSaveMarkers = () => {
		const markerList = this.state.markerList;
		const routeName = this.state.routeName;

		const markerListRef = firebaseDatabase.ref('Bici_rutas').push({
			userId: firebaseAuth.currentUser.uid,
			title: routeName,
			timestamp: new Date().getTime(),
		});

		let nextInSeq = parseInt(this.state.currentSeq) + 1;

		//Estado de los marcadores
		this.setState({
			markers: [
				{
					//title: "The marker`s title will appear as a tooltip.",
					//name: "SOMA",
					//position: { lat: "", lng: "" },
				},
			],
			markerList: [{}],
			routeName: `biciruta${nextInSeq}-`,
		});

		markerList.forEach((marker) => {
			markerListRef.child('points').push(marker);
		});

		message.success('Ruta guardada con éxito');

		// markerList.forEach(marker => {
		//   console.log(marker)
		//   markerListRef.push(marker);
		// });
	};

	componentDidMount() {
		let ref = firebaseDatabase.ref('Bici_rutas');
		ref.on('value', (snapshot) => {
			const markersObject = snapshot.val();

			const markersList = Object.keys(markersObject).map((key) => ({
				...markersObject[key],
				uid: key,
			}));

			// Mantener la variable de estado global currentSeq que obtendrá la última ruta guardada en la base de datos y obtendrá el número de ruta de esa ruta
			// NOTA: esta lógica NO funcionará si se cambia el esquema de nomenclatura de las rutas
			// Lógica para obtener el último número de ruta: 
			//-> obtener el nombre de la ruta más reciente 
			//-> recortar los primeros 8 caracteres para eliminar 'biciruta' 
			//-> dividir la nueva cadena por el carácter '-' y obtener la primera mitad 
			//-> recortar el espacio en blanco 
			//-> la cadena obtenida es nuestra secuencia actual
			let currentSeq = markersList
				.sort((a, b) => (a.title > b.title ? 1 : -1))
				[markersList.length - 1].title.slice(8)
				.split('-')[0]
				.trim();

			// Guardar 'nextInSeq' como el número entero mayor que 'currentSeq' en 1
			let nextInSeq = parseInt(currentSeq) + 1;

			let nextRouteName = `biciruta${nextInSeq}-`;

			this.setState({
				markers1: markersList,
				routeName: nextRouteName,
				currentSeq: currentSeq,
			});
		});
	}

	render() {
		// redirigir a la página de inicio si el usuario no es administrador
		if (
			this.state.user &&
			this.state.user.email &&
			localStorage.getItem('isAdmin') === 'false'
		) {
			history.push('/');
		}

		// console.log('user : ' + firebaseAuth.currentUser.uid)
		let bicycleCoords = [];

		this.state.markerList.slice(1).map(({ lat, lng }) => {
			bicycleCoords.push({ lat, lng });
		});

		// const allCoords = [
		// 	{ lat: -0.22379672590243121, lng: -78.51335147156581 },
		// 	{ lat: -0.2232187142576618, lng: -78.5140877379404 },
		// 	{ lat: -0.22021209407389694, lng: -78.51164966551303 },
		// ];

		var allCoords = [];

		this.state.markers1.map((user) => {
			var coords = [];

			if (user && user.points) {
				Object.keys(user.points).map((key) => {
					var lat = user.points[key].lat;
					var lng = user.points[key].lng;
					coords.push({ lat, lng, title: user.title });
				});

				allCoords.push(coords);
			}
		});

		return (
			<div>
				<input 
				style={{
					marginLeft: '10px',
					width: '300px'
				}}
					value={this.state.routeName}
					placeholder="Nombre BiciRuta"
					onChange={(e) => {
						this.setState({
							routeName: e.target.value,
						});
					}}
				/>

				<Button
					type="button"
					style={{ marginLeft: '20px' }}
					onClick={this.handleSaveMarkers}
					type="primary"
					disabled={
						this.state.routeName === '' ||
						this.state.routeName === 'biciruta' ||
						this.state.routeName.endsWith('-')
					}
				>
					Guardar
				</Button>

				<Button
					type="button"
					style={{ marginLeft: '20px' }}
					onClick={() => {
						let newMarkers = this.state.markers;
						let newMarkerList = this.state.markerList;
						newMarkers.pop();
						newMarkerList.pop();
						this.setState({
							markers: newMarkers,
							markerList: newMarkerList,
						});
					}}
					type="danger"
					disabled={
						this.state.markers.length === 0 ||
						this.state.markerList.length === 1
					}
				>
					Borara ultimo marcador
				</Button>

				<h1 className="text-center">Crea la BiciRuta</h1>
				{allCoords &&
					allCoords[0] &&
					Object.entries(allCoords[0]) &&
					Object.entries(allCoords[0])[0] &&
					Object.entries(allCoords[0])[0][1] && (
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
							zoom={20}
							onClick={this.onPointMap}
						>
							{this.state.markers.slice(1).map((marker, uid) => (
								<Marker
									key={uid}
									title={marker.title}
									name={marker.name}
									position={marker.position}
									draggable={true}
									onDragend={(t, map, coord) => {
										const { latLng } = coord;
										const lat = latLng.lat();
										const lng = latLng.lng();

										this.setState((prevState) => {
											const markerList = [
												...this.state.markerList,
											];
											markerList[uid + 1] = {
												lat,
												lng,
											};
											const markers = [
												...this.state.markers,
											];
											markers[uid + 1] = {
												...markers[uid + 1],
												position: { lat, lng },
											};
											return { markers, markerList };
										});
									}}
									icon={{
										url:
											'http://maps.google.com/mapfiles/ms/icons/cycling.png',
									}}
								/>
							))}

							{/* <Marker
								title={this.state.hoverTitle}
								name={this.state.hoverName}
								position={this.state.hoverPosition}
							/> */}
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
											hoverTitle: poly[0].title,
											hoverPosition: {
												lat,
												lng,
											},
										});
									}}
									key={index}
									path={poly}
									strokeColor="red"
									strokeOpacity={2}
									strokeWeight={4}
								/>
							))}

							<Polyline
								path={bicycleCoords}
								strokeColor="#0000FF"
								strokeOpacity={0.8}
								strokeWeight={2}
							/>
						</Map>
					)}
			</div>
		);
	}
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow',
})(MainMap);
