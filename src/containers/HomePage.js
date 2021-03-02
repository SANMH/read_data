import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../firebase/index';
import Firebase from 'firebase';
import { Map, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { DatePicker } from 'antd';
import moment from 'moment';

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();

class HomePage extends Component {
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
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		let ref = Firebase.database().ref('routes');
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
		const {
			markers,
			loading,
			selectedUser,
			user,
			showAll,
			selectedDate,
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

				var timestamp = user.finished_at;
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
				<h1>Home</h1>

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
})(HomePage);