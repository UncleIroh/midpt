import React, { Component } from 'react';
import Map from '../components/Map';

const GoogleMapsAPI = new Promise((res, err) => {
  const script = document.createElement('script');
  document.body.appendChild(script);
  script.onload = res;
  script.onerror = err;
  script.async = true;
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.GOOGLE_MAPS_KEY;
});

const Maps = (props) => {
  const mapComponents = [];
  if (props.result) {
    if (props.result.point1) {
      mapComponents.push(
        <Map key={1} keyVal={1} address={props.result.address1} point={props.result.point1} midpt={props.result.midpt} url={props.result.aToMidptURL} />
      );
    }
    if (props.result.point2) {
      mapComponents.push(
        <Map key={2} keyVal={2} address={props.result.address2} point={props.result.point2} midpt={props.result.midpt} url={props.result.bToMidptURL} />
      );
    }
  }
  return (
    <section id="maps">
      {mapComponents}
    </section>
  );
};

export default Maps;
