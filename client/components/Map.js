import React, { Component } from 'react';

const initMap = (point, midpt, id) => {
  let service = new window.google.maps.DirectionsService;
  let display = new window.google.maps.DirectionsRenderer;
  const pointStr = point.lat + ',' + point.lng;
  const midptStr = midpt.lat + ',' + midpt.lng;
  let map = new window.google.maps.Map(document.getElementById(id), {
    zoom: 7,
    center: { lat: midpt.lat, lng: midpt.lng, },
  });
  display.setMap(map);
  service.route({
    origin: pointStr,
    destination: midptStr,
    travelMode: 'DRIVING',
  }, (response, status) => {
    if (status === 'OK') {
      display.setDirections(response)
    } else {
      console.log('Google Maps directions req failed, status:', status);
    }
  });
};

const Map = (props) => {
  const id = 'map' + props.keyVal;
  setTimeout(() => {
    initMap(props.point, props.midpt, id);
  }, 1000);
  return (
    <div className="mapContainer">
      <span><strong>{'From ' + props.mapTitle}</strong>{' (' + props.address + ') '}<strong>{'to Midpoint'}</strong></span>
      <figure className="map" id={id}></figure>
    </div>
  );
}

export default Map;
