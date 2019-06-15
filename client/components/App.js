import React, {Component} from 'react';
import Maps from '../components/Maps';
// import other components here
function getInitialState() {
  return {
    result: {
      point1: {
        lat : 33.988,
        lng: -118.470,
      },
      point2: {
        lat : 33.941,
        lng: -118.408,
      },
      midpt: {
        lat : 33.996,
        lng: -118.434,
      },
      aToMidptURL: 'http://maps.google.com/',
      bToMidptURL: 'http://maps.google.com/',
      address1: '1600 Main Street, Los Angeles, CA 90045',
      address2: '1 World Way, Los Angeles, CA 90045',
    }
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    // function bindings here
  }

  render() {
    return (
      <div className="App">
        <Maps result={this.state.result} />
      </div>
    );
  }
}

export default App;
