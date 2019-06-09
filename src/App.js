import React from 'react';
import { geolocated } from 'react-geolocated';
import { GoogleMap, Marker, Polyline, InfoWindow, Circle } from '@react-google-maps/api'
import ReactQueryParams from 'react-query-params';

import * as constants from './constants';
import './App.css';
import Header from './Header/Header';
import { mapStyles } from './mapStyles';
import { StyledApp, AcornButton, DemoButton } from './styled';

class App extends ReactQueryParams {
  state = {
    location: {
      lat: constants.center.lat,
      lng: constants.center.lng,
    },
    infoWindowOpen: null,
    demoActive: false,
    consumedAcorns: [],
  };

  markers = {};

  componentDidUpdate(prevProps) {
    if (this.props.coords !== prevProps.coords && !this.state.demoActive) {
      const location = { lat: this.props.coords.latitude, lng: this.props.coords.longitude };

      if (!prevProps.coords && this.map) {
        this.map.setCenter(location);
      }

      this.setState({ location });
      this.updateProximity();
    }
  }

  componentDidMount(){
    if (this.queryParams.treasures !== undefined) {
      const consumedAcorns = this.queryParams.treasures.split(',').map((str) => parseInt(str));
      this.setState({consumedAcorns});
    }
  }

  mapLoaded = (map) => {
    this.map = map;

    if (this.props.coords) {
      map.setCenter({lat: this.props.coords.latitude, lng: this.props.coords.longitude});
    }
  };

  updateProximity = () => {
    if (this.map && window.google.maps.geometry) {
      let activeMarker = undefined;
      constants.treasures.forEach((treasure, index) => {
        if (!this.state.consumedAcorns.includes(index)) {
          if (this.isCloseEnough(treasure)) {
            this.markers[index].setAnimation(window.google.maps.Animation.BOUNCE);
            activeMarker = index;
          } else {
            this.markers[index].setAnimation(null);
          }
        }
      });
      this.setState({activeMarker});
    }
  };

  movedMap = () => {
    if (this.state.demoActive) {
      this.setState({location: {lng: this.map.getCenter().lng(), lat: this.map.getCenter().lat()}});

      this.updateProximity();
    }
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
    const treasures = [...this.state.consumedAcorns];
    treasures.push(this.state.activeMarker);
    if (this.state.activeMarker !== undefined && !this.state.clicked) {
      window.location = (process.env.REACT_APP_SERVER_URL || 'http://6d84f684.ngrok.io') + '?treasures=' + treasures.join();
      this.setState({clicked: true});
    }
  };

  markerLoaded = (id, marker) => {
    this.markers[id] = marker;
  };

  toggleDemo = () => {
    const location = { lat: constants.center.lat, lng: constants.center.lng };
    const demoActive = !this.state.demoActive;

    if (demoActive && this.map) {
      this.map.setCenter(location);
    }
    this.setState({location, demoActive});
  };

  render() {
    const { activeMarker, clicked, location, infoWindowOpen, consumedAcorns} = this.state;

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

          {constants.treasures
            .map((treasure, index) => (
            <Marker
              animation={window.google.maps.Animation.DROP}
              key={index}
              position={treasure.position}
              icon={{
                url: 'acorn.svg',
                anchor: { x: 15, y: 15 },
              }}
              visible={!consumedAcorns.includes(index)}
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

          <DemoButton
            onClick={this.toggleDemo}
          >
            {this.state.demoActive ? 'Demo Mode On' : 'Demo Mode Off'}
          </DemoButton>

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
  watchPosition: true,
})(App);
