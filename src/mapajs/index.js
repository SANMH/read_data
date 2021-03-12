import React, { Component, useState } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import axios from "axios";
import { Button } from 'antd';
import app from '../firebase/index';


class MainMap extends Component {
 

  constructor(props) {
    super(props);
    
    this.state = {
      user: app.auth().currentUser,
      markers: [
        {
          title: "The marker`s title will appear as a tooltip.",
          name: "SOMA",
          position: { lat: -0.24542770000000003, lng: -78.5309735 },
        }
      ],
      
    };
    this.onClick = this.onClick.bind(this);
  }

  //aqui se crea el marcador 
  
  onClick(t, map, coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    this.setState(previousState => {
      return {
        markers: [
          ...previousState.markers,
          {
            title: "",
            name: "",
            position: { lat, lng }
          }
        ]
      };
    }
    );
    console.log(lat, lng)  

    const savemarkers = (lat, lng) => {
      const markerRef = app.database().ref('Marker');
      const marker = {
        lat:lat, lng:lng, 
        complete: false,
      };
      markerRef.push(marker);
    };

    savemarkers(lat, lng)
  }


  render() {
    
    return (
      
      <div>
        
        <Button 
      
        type="button" onClick={this.onClick} type="danger"> 
      Salir
      </Button>
  
        <h1 className="text-center">My Maps</h1>
        <Map
         initialCenter={{
          lat: -0.24542770000000003,
          lng: -78.5309735
        }}
        
          google={this.props.google}
          style={{ width: "80%", margin: "auto" }}
          className={"map"}
          zoom={20}
          onClick={this.onClick}
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
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow')
})(MainMap)



