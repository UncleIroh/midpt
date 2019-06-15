import React, { Component } from 'react';
import Map from '../components/Map';

const Maps = (props) => {
  return (
    <section id="maps">
      <h1>MAP</h1>
      <Map key={1} keyVal={1} address={'1600 Main Street'} mapTitle={'Codesmith'} point={props.coords.point1} midpt={props.coords.midpt} />
      <Map key={2} keyVal={2} address={'1 World Way'} mapTitle={'LAX'} point={props.coords.point2} midpt={props.coords.midpt} />
    </section>
  );
}

export default Maps;
