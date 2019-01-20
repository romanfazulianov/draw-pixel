import React, { Component } from 'react';
import EditField from './EditField';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="draw-pixel">
        <header className="draw-pixel_header">
          <h1>DRAW PIXEL 0.0.1</h1>
        </header>
        <EditField />
      </div>
    );
  }
}

export default App;
