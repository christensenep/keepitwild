import React from 'react';
import { geolocated } from 'react-geolocated';
import { GoogleMap, Marker, Polyline, InfoWindow, Circle } from '@react-google-maps/api'

import * as constants from './constants';
import './App.css';
import Header from './Header/Header';
import { mapStyles } from './mapStyles';
import { StyledApp, AcornButton } from './styled';

class App extends React.Component {
  state = {
    location: {
      lat: constants.center.lat,
      lng: constants.center.lng,
    },
    infoWindowOpen: null,
  };

  markers = {};

  componentDidUpdate(prevProps) {
  }

  componentDidMount(){
  }

  mapLoaded = (map) => {
    this.map = map;
  };

  movedMap = () => {
    let activeMarker = undefined;
    constants.treasures.forEach((treasure, index) => {
      if (this.isCloseEnough(treasure)) {
        this.markers[index].setAnimation(window.google.maps.Animation.BOUNCE);
        activeMarker = index;
      } else {
        this.markers[index].setAnimation(null);
      }
    });

    this.setState({ location: { lng: this.map.getCenter().lng(), lat: this.map.getCenter().lat() }, activeMarker });
  };

  isCloseEnough = (treasure) => {
    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(this.state.location),
      new window.google.maps.LatLng(treasure.position));

    return distance < 100;
  };

  clickTreasure = (id) => {
    if (id === null) {
      this.setState({infoWindowOpen: null});
      return;
    }

    if (!this.isCloseEnough(constants.treasures[id])) {
      this.setState({infoWindowOpen: id});
    }
  };

  clickButton = () => {
    if (this.state.activeMarker && !this.state.clicked) {
      window.location = process.env.REACT_APP_SERVER_URL || 'http://6d84f684.ngrok.io';
      this.setState({clicked: true});
    }
  };

  markerLoaded = (id, marker) => {
    this.markers[id] = marker;
  };

  render() {
    const { activeMarker, clicked, location, infoWindowOpen } = this.state;

    return (
      <StyledApp>
        <Header/>

        <GoogleMap
          id="circle-example"
          mapContainerClassName='mapClass'
          zoom={13.5}
          center={constants.center}
          options={{
            disableDefaultUI: true,
            styles: mapStyles,
          }}
          onCenterChanged={this.movedMap}
          onLoad={this.mapLoaded}
        >
          <Marker
            position={{
              lat: location.lat,
              lng: location.lng,
            }}
            icon={{
              url: '//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
              size: { height: 22, width: 22 },
              origin: { x: 0, y: 18 },
              anchor: { x: 11, y: 11 },
            }}
            zIndex={10000}
          />

          <Marker
            position={constants.start}
          />
          <Marker
            position={constants.finish}
          />

          {constants.treasures.map((treasure, index) => (
            <Marker
              animation={window.google.maps.Animation.DROP}
              key={index}
              position={treasure.position}
              icon={{
                url: 'acorn.svg',
                anchor: { x: 15, y: 15 },
              }}
              onClick={() => this.clickTreasure(index)}
              onLoad={((marker) => this.markerLoaded(index, marker))}
            />
          ))}

          <Polyline
            options={{
              path: constants.path,
              strokeColor: '#56A9FF',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
          <Polyline
            options={{
              path: constants.path,
              strokeColor: '#0167CC',
              strokeOpacity: 1,
              strokeWeight: 1,
            }}
          />

          {infoWindowOpen !== null &&
            <InfoWindow
              position={constants.treasures[infoWindowOpen].position}
              onCloseClick={() => this.clickTreasure(null)}
              options={{
                pixelOffset: {height: -20, width: 0},
              }}
            >
              <p>Not Close Enough!</p>
            </InfoWindow>
          }

          {activeMarker !== undefined && !clicked &&
            <AcornButton
              onClick={this.clickButton}
            >
              Collect Acorn!
            </AcornButton>
          }
        </GoogleMap>
      </StyledApp>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App);
