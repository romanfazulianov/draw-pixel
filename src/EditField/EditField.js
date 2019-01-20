import React, { Component } from 'react';
import './style.scss';

class EditField extends Component {
  render() {
    const height = 32;
    const width = 48;
    const originalWidth = 1200;
    const pixelSize = (originalWidth / width ) | 0;

    const field = [];
    const fieldSize = width * height;
    while (field.length < fieldSize) {
      field.push(<div key={field.length} className="pixel" style={{height: pixelSize, width: pixelSize }}/>)
    }
    return (
        <div>
          <div className="draw-pixel_edit-field" style={{ width: originalWidth, height: height * pixelSize }}>
            {field}
          </div>
          <br/>
          pixels: {width} &times; {height}
          <br/>
          pixelSize: {pixelSize}
          <br/>
          size: {height * pixelSize} &times; {pixelSize * width}
          <br/>
          original: {originalWidth}
        </div>
    );
  }
}

export default EditField;
