import React, { Component } from 'react';
import './style.scss';
import Pixel from './Pixel';
import {createLineEquation} from '../math/lineTo';

class EditField extends Component {
  state = { field: [], draw: false};
  startDraw = (event) => {
    document.addEventListener('mousemove', this.draw, {passive: false});
    this.field.addEventListener('mouseleave', this.stopDraw);
    this.draw({...event});
    this.setState((state) => ({draw: true}));
    this.calculate(event.clientX, event.clientY);

  };
  draw = event => this.calculate(event.clientX, event.clientY);
  stopDraw = (event) => {
    if (this.state.draw) {
      document.removeEventListener('mousemove', this.draw, {passive: false});
      this.field.removeEventListener('mouseleave', this.stopDraw);
      this.setState((state) => ({draw: false}));
      this.lastX = null;
      this.lastY = null;
    }
  };
  getRef = (el) => {
    if(el) {
      this.field = el;
      this.startDim = this.field.getBoundingClientRect();
    }
  };

  color = 'black';

  fill = (x) => {
    this.setState((state) => x.reduce((acc, i) => {
      acc[i] = {
        ...acc[i],
        color: this.color
      };
      return acc;
    }, []));
  };

  indexate = (x, y) => this.width * y  + x;

  calculate (xl, yl) {
      const xt = ((xl - this.startDim.x) / this.pixelSize) | 0;
      const yt = ((yl - this.startDim.y) / this.pixelSize) | 0;
      const state = {[this.indexate(xt, yt)]: true};
      if (this.lastY != null && this.lastX != null) {
        const equ = createLineEquation(this.lastX, this.lastY, xt, yt);
        if (equ.x) {
          const startY = Math.min(this.lastY, yt);
          const endY = Math.max(this.lastY, yt);
          for (let y = startY + 1; y < endY; y++) {
            const x = equ.x(y) | 0;
            state[this.indexate(x, y)] = true;
          }
        } else {
          const startX = Math.min(this.lastX, xt);
          const endX = Math.max(this.lastX, xt);
          for (let x = startX + 1; x < endX; x++) {
            const y = equ.y(x) | 0;
            state[this.indexate(x, y)] = true;
          }
        }
      }
      this.lastX = xt;
      this.lastY = yt;
      this.fill(Object.keys(state))
  }
  height = 200;
  width = 240;
  originalWidth = 1200;
  pixelSize = (this.originalWidth / this.width ) | 0;

  render() {
    const field = [];
    const fieldSize = this.width * this.height;
    for (let g = 0; g < fieldSize; g++) {
      field.push(
          <Pixel
              key={field.length}
              scale={this.pixelSize}
              color="transparent"
              {...this.state[field.length]}/>)
    }

    return (
        <div
            ref={this.getRef}
            className="draw-pixel_edit-field"
            onMouseDownCapture={this.startDraw}
            onMouseUpCapture={this.stopDraw}
            style={{ width: this.originalWidth, height: this.height * this.pixelSize }}>
          {field}
        </div>
    );
  }
}

export default EditField;
