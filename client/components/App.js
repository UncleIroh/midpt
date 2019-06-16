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
    fetch('http://localhost:3000/buildroute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        console.log('raw server response', response);
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          result: {
            point1: data.points[0],
            point2: data.points[1],
            midpt: data.midpt,
            aToMidptURL: data.directionURLs[0],
            bToMidptURL: data.directionURLs[1],
            address1: data.addresses[0],
            address2: data.addresses[1]
          }
        });
      });
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
