import React, { Component } from 'react';
// import other components here
function getInitialState() {
  return {};
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    // function bindings here
  }

  render() {
    return <div className="App" />;
  }
}

export default App;
