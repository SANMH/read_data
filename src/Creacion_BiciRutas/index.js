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
			markerList: [
				{
					//lat: "",
					//lng: "",
					//timestamp: Date.now()
				},
			],
			routeName: '',
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

		//estado de los marcadores
		this.setState({
			markers: [
				{
					//title: "The marker`s title will appear as a tooltip.",
					//name: "SOMA",
					//position: { lat: "", lng: "" },
				},
			],
			markerList: [{}],
			routeName: '',
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

	render() {
		// redirect to home page if user is not admin
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

		const { dataUser } = this.state;
		const triangleCoords = [
			{ lat: -0.2230980943885677, lng: -78.51259076329114 },
			{ lat: -0.220101529811345, lng: -78.51183192334038 },
			{ lat: -0.2167093539292637, lng: -78.50516878464863 },
			{ lat: -0.21329979536304305, lng: -78.49991204517507 },
		];

		const linea1 = [
			{ lat: -0.22379672590243121, lng: -78.51335147156581 },
			{ lat: -0.2232187142576618, lng: -78.5140877379404 },
			{ lat: -0.22021209407389694, lng: -78.51164966551303 },
		];

		const linea2 = [
			{ lat: -0.21040646554435538, lng: -78.49359013054348 },
			{ lat: -0.21061165314908972, lng: -78.49360890600659 },
			{ lat: -0.2107873194383424, lng: -78.49351979916473 },
			{ lat: -0.21115785615137247, lng: -78.49319675494095 },
			{ lat: -0.2114515560411711, lng: -78.49290439415833 },
			{ lat: -0.211835224941273, lng: -78.49245571237682 },
			{ lat: -0.21220840750105238, lng: -78.49200239735264 },
			{ lat: -0.2123578461876737, lng: -78.49179203082548 },
			{ lat: -0.21244233519110006, lng: -78.49156001974569 },
			{ lat: -0.21252139024374792, lng: -78.49101457284425 },
			{ lat: -0.21271467228823784, lng: -78.48906657662882 },
		];

		const linea3 = [
			{ lat: -0.21281362289681605, lng: -78.48815016381236 },
			{ lat: -0.21287799546900013, lng: -78.48648719422313 },
			{ lat: -0.21259904765428553, lng: -78.48537139527294 },
			{ lat: -0.21240592993345853, lng: -78.48449163071605 },
			{ lat: -0.21189094933279307, lng: -78.48359040848705 },
			{ lat: -0.21139742624108343, lng: -78.48285011879894 },
		];

		const linea4 = [
			{ lat: -0.21073762788600953, lng: -78.48250844092064 },
			{ lat: -0.20925349961580128, lng: -78.48232929388723 },
			{ lat: -0.206935408670939, lng: -78.48204586072248 },
			{ lat: -0.20655453747038352, lng: -78.48207268281263 },
			{ lat: -0.2062004881771799, lng: -78.4821746067552 },
			{ lat: -0.20485854714288146, lng: -78.48259621850842 },
			{ lat: -0.20388441243378663, lng: -78.48294290962328 },
		];

		const linea5 = [
			{ lat: -0.21028100723454446, lng: -78.4935867593166 },
			{ lat: -0.2065581257536007, lng: -78.48792193387715 },
			{ lat: -0.20383424499662095, lng: -78.48327774915874 },
		];

		const linea6 = [
			{ lat: -0.20811234563440373, lng: -78.4901343411253 },
			{ lat: -0.20819012918253402, lng: -78.49004180491428 },
			{ lat: -0.20852808528374286, lng: -78.48901183665257 },
			{ lat: -0.2085562482918483, lng: -78.48895148694973 },
			{ lat: -0.20745094720432858, lng: -78.4872088093542 },
			{ lat: -0.207334271876529, lng: -78.48704117129077 },
			{ lat: -0.2063561364590961, lng: -78.48566456339773 },
			{ lat: -0.20618581729039775, lng: -78.4853158762258 },
			{ lat: -0.20581444961819637, lng: -78.48463671945623 },
			{ lat: -0.20501460878495073, lng: -78.48528953241969 },
		];

		return (
			<div>
				<input
					value={this.state.routeName}
					placeholder="Title"
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
					type="danger"
					disabled={this.state.routeName === ''}
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
					Delete last Marker
				</Button>

				<h1 className="text-center">Crea la BiciRuta</h1>
				<Map
					initialCenter={{
						lat: -0.21020266504029167,
						lng: -78.48859356991835,
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
									const markers = [...this.state.markers];
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

					<Marker
						title={'Santo Domingo'}
						name={'Santo Domingo'}
						position={{
							lat: -0.2230980943885677,
							lng: -78.51259076329114,
						}}
					/>
					<Marker />

					<Marker
						title={'Plaza Grande'}
						name={'Plaza Grande'}
						position={{
							lat: -0.220101529811345,
							lng: -78.51183192334038,
						}}
					/>
					<Marker />

					<Marker
						title={'Alameda'}
						name={'Alameda'}
						position={{
							lat: -0.2167093539292637,
							lng: -78.50516878464863,
						}}
					/>
					<Marker />

					<Marker
						title={'Asamblea Nacional'}
						name={'Asamblea Nacional'}
						position={{
							lat: -0.21329979536304305,
							lng: -78.49991204517507,
						}}
					/>
					<Marker />

					<Polyline
						path={triangleCoords}
						strokeColor="#0000FF"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={linea1}
						strokeColor="red"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={linea2}
						strokeColor="green"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={linea3}
						strokeColor="blue"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={linea4}
						strokeColor="red"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={linea5}
						strokeColor="black"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={linea6}
						strokeColor="yellow"
						strokeOpacity={1}
						strokeWeight={2}
					/>

					<Polyline
						path={bicycleCoords}
						strokeColor="#0000FF"
						strokeOpacity={0.8}
						strokeWeight={2}
					/>
				</Map>
			</div>
		);
	}
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow',
})(MainMap);
