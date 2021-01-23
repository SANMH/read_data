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
      selectedUser: "",
      user: {},
      points: {},
      showAll: false
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
        showAll: true
      });
    });
  }

  render() {
    const { markers, loading, selectedUser, user, showAll } = this.state;

    var triangleCoords = []

    if (selectedUser) {
      Object.keys(user.points).map(key => {
        var lat = user.points[key].lat;
        var lng = user.points[key].lng;
        triangleCoords.push({ lat, lng })
      });
    }

    var allCoords = []

    markers.map(user => {
      var coords = []

      Object.keys(user.points).map(key => {
        var lat = user.points[key].lat;
        var lng = user.points[key].lng;
        coords.push({ lat, lng })
      });

      allCoords.push(coords)
    });

    return (
      <div>
        <h1>Dashboard</h1>

        {/* <br />
        <br /> */}

        {/* <button onClick={ () => {this.setState({showAll: !showAll})}}>{showAll ? "Hide" : "Show"} All Users</button> */}

        {/* <br />
        <br /> */}

        {loading && <div>Cargando ...</div>}

        <><label htmlFor="userselect">Select User: </label>

          <select name="user" id="userselect" onChange={e => {
            if (e.target.value !== "") {
              this.setState({
                selectedUser: e.target.value,
                user: this.state.markers.find(user => user.uid === e.target.value),
                showAll: false
              })
            } else {
              this.setState({
                selectedUser: e.target.value,
                user: {},
                showAll: true
              })
            }
          }}>

            {/*Cargar todo los datos de la base */}
            <option value="">All</option>
            {markers.map((user, index) => (
              <option key={index} value={user.uid}>{user.uid}</option>
            ))}

          </select></>

        {!showAll && selectedUser && (
          <div style={{ display: "flex" }}>
            <div>
              <br />
              <br />
              <button onClick={() => {
                let ref = Firebase.database().ref("Marker/" + selectedUser);
                ref.remove();
                window.location.reload();
              }}>Delete User {selectedUser}</button>
              <br />
              <br />
              <UserList markers={markers} selectedUser={selectedUser} user={user} />
            </div>


            <div>
              <Map
                initialCenter={{
                  lat: Object.entries(user.points)[0][1].lat,
                  lng: Object.entries(user.points)[0][1].lng
                }}
                center={{
                  lat: Object.entries(user.points)[0][1].lat,
                  lng: Object.entries(user.points)[0][1].lng
                }}
                google={this.props.google}
                style={{ width: "80%", margin: "auto" }}
                className={"map"}
                zoom={16}
                onClick={this.onPointMap}
              >


                {Object.keys(user.points).map((key, index) => (
                  <Marker
                    key={index}
                    title={key}
                    name={key}
                    position={{ lat: user.points[key].lat, lng: user.points[key].lng }}
                  />
                ))
                }

                {allCoords.map((poly, index) => (
                  <Polyline
                    key={index}
                    path={poly}
                    strokeColor="#0000FF"
                    strokeOpacity={0.8}
                    strokeWeight={2} />
                ))}

              </Map></div></div>)}

        {showAll && (
          <Map
            initialCenter={{
              lat: Object.entries(allCoords[0])[0][1].lat,
              lng: Object.entries(allCoords[0])[0][1].lng
            }}
            google={this.props.google}
            style={{ width: "80%", margin: "auto" }}
            className={"map"}
            zoom={15}
            onClick={this.onPointMap}
          >

            {allCoords.map((poly, index) => (
              <Polyline
                key={index}
                path={poly}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2} />
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
      {Object.keys(points).map(key => (
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

  )
};


export default GoogleApiWrapper({
  apiKey: ('AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow')
})(AdminPage)

