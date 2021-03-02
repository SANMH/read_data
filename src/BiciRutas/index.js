import React, { Component } from 'react';
import { withFirebase } from '../firebase/index copy';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import Firebase from 'firebase';
import {
	Map,
	InfoWindow,
	Marker,
	GoogleApiWrapper,
	Polyline,
} from 'google-maps-react';
import { marker, point } from 'leaflet';
import { Modal, Button } from 'antd';

import { history } from '../store';

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();
let firebaseDatabase = firebase.database();

class AdminPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			markers: [],
			selectedUser: '',
			user: firebaseAuth.currentUser,
			points: {},
			showAll: false,
			visible: false,
			visibleSave: false,
			confirmLoading: false,
			confirmLoadingSave: false,
			modalText: '¿Estás seguro que deseas eliminar esta ruta?',
			modalTextSave:
				'¿Está seguro que desea guardar los cambios en los marcadores de esta ruta?',
			isMarkerMoved: false,
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		let ref = Firebase.database().ref('Bici_rutas');
		ref.on('value', (snapshot) => {
			const markersObject = snapshot.val();

			const markersList = Object.keys(markersObject).map((key) => ({
				...markersObject[key],
				uid: key,
			}));

			this.setState({
				markers: markersList,
				loading: false,
				showAll: true,
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

		const {
			markers,
			loading,
			selectedUser,
			user,
			showAll,
			visible,
			visibleSave,
			confirmLoading,
			confirmLoadingSave,
			modalText,
			modalTextSave,
			isMarkerMoved,
		} = this.state;

		var triangleCoords = [];

		if (selectedUser && user && user.points) {
			Object.keys(user.points).map((key) => {
				var lat = user.points[key].lat;
				var lng = user.points[key].lng;
				triangleCoords.push({ lat, lng });
			});
		}

		var allCoords = [];

		markers.map((user) => {
			var coords = [];

			if (user && user.points) {
				Object.keys(user.points).map((key) => {
					var lat = user.points[key].lat;
					var lng = user.points[key].lng;
					coords.push({ lat, lng });
				});

				allCoords.push(coords);
			}
		});

		return (
			<div>
				<h1>BiciRutas creadas </h1>

				{/* <br />
        <br /> */}

				{/* <button onClick={ () => {this.setState({showAll: !showAll})}}>{showAll ? "Hide" : "Show"} All Users</button> */}

				{/* <br />
        <br /> */}

				{loading && <div>Cargando ...</div>}

				<>
					<label htmlFor="userselect">Seleccione la BiciRuta:  </label>

					{/* Select de BiciRutas */}
					<select
						name="user"
						id="userselect"
						onChange={(e) => {
							if (e.target.value !== '') {
								this.setState({
									selectedUser: e.target.value,
									user: this.state.markers.find(
										(user) => user.uid === e.target.value,
									),
									showAll: false,
								});
							} else {
								this.setState({
									selectedUser: e.target.value,
									user: {},
									showAll: true,
								});
							}
						}}
					>
						<option value="">Todas las rutas</option>
						{markers.map((user, index) => (
							<option key={index} value={user.uid}>
								{user.title ? user.title : user.uid}
							</option>
						))}
					</select>

					{!showAll && selectedUser && (
						<>
							<Button
								style={{ marginLeft: '20px' }}
								type="primary"
								onClick={() => this.setState({ visible: true })}
							>
								Borrar ==> {user.title ? user.title : selectedUser}
							</Button>
							
							<Button
								disabled={!isMarkerMoved}
								style={{ marginLeft: '20px' }}
								type="primary"
								onClick={() =>
									this.setState({ visibleSave: true })
								}
							>

								Guardar cambios para ==> {' '}
								{user.title ? user.title : selectedUser}
							</Button>

							<Modal
								title={`Borrar ${user.title ? user.title : selectedUser
									}`}
								visible={visible}
								onOk={() => {
									this.setState({
										ModalText: 'Borrando ruta',
										confirmLoading: true,
									});
									let ref = Firebase.database().ref(
										'Bici_rutas/' + selectedUser,
									);
									ref.remove();
									window.location.reload();
								}}
								confirmLoading={confirmLoading}
								onCancel={() =>
									this.setState({ visible: false })
								}
							>
								<p>{modalText}</p>
							</Modal>
							<Modal
								title={`Guardar cambios en Marcadores de ${user.title ? user.title : selectedUser
									}`}
								visible={visibleSave}
								onOk={() => {
									this.setState({
										ModalTextSave: 'Guardando ruta',
										confirmLoadingSave: true,
									});
									let ref = Firebase.database().ref(
										'Bici_rutas/' + selectedUser,
									);
									ref.remove();
									firebaseDatabase
										.ref('Bici_rutas')
										.push(this.state.user);

									window.location.reload();
								}}
								confirmLoading={confirmLoadingSave}
								onCancel={() =>
									this.setState({ visibleSave: false })
								}
							>
								<p>{modalTextSave}</p>
							</Modal>
						</>
					)}
				</>

				<br />
				<br />

				{!showAll && selectedUser && (
					<div style={{ display: 'flex' }}>
						<div>
							<Map
								initialCenter={{
									lat: Object.entries(user.points)[0][1].lat,
									lng: Object.entries(user.points)[0][1].lng,
								}}
								center={{
									lat: Object.entries(user.points)[0][1].lat,
									lng: Object.entries(user.points)[0][1].lng,
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
								{Object.keys(user.points).map((key, index) => (
									<Marker
										draggable={true}
										onDragend={(t, map, coord) => {
											const { latLng } = coord;
											const lat = latLng.lat();
											const lng = latLng.lng();

											this.setState((prevState) => {
												let user = this.state.user;
												user.points[key].lat = lat;
												user.points[key].lng = lng;
												return {
													user,
													isMarkerMoved: true,
												};
											});
										}}
										key={index}
										title={key}
										name={key}
										position={{
											lat: user.points[key].lat,
											lng: user.points[key].lng,
										}}
									/>
								))}

								{allCoords.map((poly, index) => (
									<Polyline
										key={index}
										path={poly}
										strokeColor="#0000FF"
										strokeOpacity={0.8}
										strokeWeight={2}
									/>
								))}

								{user && user.points && (
									<Polyline
										path={Object.keys(user.points).map(
											(key) => ({
												lat: user.points[key].lat,
												lng: user.points[key].lng,
											}),
										)}
										strokeColor="#FF0000"
										strokeOpacity={0.8}
										strokeWeight={2}
									/>
								)}
							</Map>
						</div>
					</div>
				)}

				{showAll && (
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
		);
	}
}

const UserList = ({ markers, selectedUser, user }) => {
	var points = user.points;
	return (
		<ul>
			{Object.keys(points).map((key) => (
				<li key={key}>
					<span>
						<strong>ID ruta:</strong> {key}
					</span>
					<br />
					<span>
						<strong>ID latitude:</strong> {points[key].lat}
					</span>
					<br />
					<span>
						<strong>ID longitude:</strong> {points[key].lng}
					</span>
					<br />
					<span>
						<strong>ID User:</strong> {selectedUser}
					</span>
				</li>
			))}
		</ul>
	);
};

export default GoogleApiWrapper({
	apiKey: 'AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow',
})(AdminPage);
