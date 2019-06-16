import React, { Component } from 'react';
import Maps from '../components/Maps';
import Form from '../components/Form';

function getInitialState() {
  return { placeholder: 'Enter an address...' };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }
  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
    console.log(e.target.id + ' change: ' + this.state[e.target.id]);
  }
  onClick(e) {
    console.log('CLICK:', e.target.value);
    console.log('Radio val:', this.state.radioVal);
    console.log(this.state.loca + ' ' + this.state.locb);
    const data = {
      points: [this.state.loca, this.state.locb],
      departureTime: 'x'
    };
    fetch('/buildroute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      });
    // this.setState({
    //   result: {
    //     point1: {
    //       lat: 33.988,
    //       lng: -118.470
    //     },
    //     point2: {
    //       lat: 33.941,
    //       lng: -118.408
    //     },
    //     midpt: {
    //       lat: 33.996,
    //       lng: -118.434
    //     },
    //     aToMidptURL: 'http://maps.google.com/',
    //     bToMidptURL: 'http://maps.google.com/',
    //     address1: '1600 Main Street, Los Angeles, CA 90045',
    //     address2: '1 World Way, Los Angeles, CA 90045'
    //   }
    // });
  }
  onRadioChange(e) {
    this.setState({ radioVal: [e.target.value] });
  }
  render() {
    return (
      <div className="App">
        <h1>midpt</h1>
        <Form
          onChange={this.onChange}
          onClick={this.onClick}
          onRadioChange={this.onRadioChange}
          placeholder={this.state.placeholder}
        />
        <Maps result={this.state.result} />
      </div>
    );
  }
}

export default App;
