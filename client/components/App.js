import React, {Component} from 'react';
import Maps from '../components/Maps';
// import other components here
function getInitialState() {
  return {
    coords: {
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
    return (<div className="App">
      <Maps coords={this.state.coords}/>
    </div>);
  }
}

export default App;
