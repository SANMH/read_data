import React, { Component } from 'react';
import { withFirebase } from '../firebase/index copy';
import * as firebase from "firebase/app"
import "firebase/database"
import { config } from "../firebase/index"
import Firebase from "firebase";
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { marker, point } from 'leaflet';

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
      points: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    let ref = Firebase.database().ref("Marker")
    ref.on('value', snapshot => {
      const markersObject = snapshot.val();

      const markersList = Object.keys(markersObject).map(key => ({
        ...markersObject[key],
        uid: key,
      }));

      this.setState({
        markers: markersList,
        loading: false,
      });
      console.log(markersList)
    });
  }

  render() {
    const { markers, loading } = this.state;

    return (
      <div>
        <h1>Dashboard</h1>

        {loading && <div>Cargando ...</div>}

        <UserList markers={markers} />
        

<Map
initialCenter={{
  lat: -0.24542770000000003,
  lng: -78.5309735
}}

google={this.props.google}
style={{ width: "80%", margin: "auto" }}
className={"map"}
zoom={20}
onClick={this.onPointMap}
>



{this.state.markers.map((marker, index) => (
  <Marker
    key={index}
    title={marker.title}
    name={marker.name}
    position={marker.position}
  />
))}
 
</Map>


</div>
    );
  }
}


const UserList = ({ markers }) => (
  <ul>
    {markers.map(marker => (
      <li key={marker.uid}>
        <span>
          <strong>ID ruta:</strong> {marker.uid}
        </span>
        <br/>
        <span>
    <strong>ID latitude:</strong> {marker.lat}
  </span>
  <br />
  <span>
    <strong>ID longitude:</strong> {marker.lng}
  </span>
  <br/>
        <span>
          <strong>ID User:</strong> {marker.userId}
        </span>
      </li>
    ))}
  </ul>

);


export default GoogleApiWrapper({
  apiKey: ('AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow')
})(AdminPage)

