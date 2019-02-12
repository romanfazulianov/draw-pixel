import React, { Component } from 'react';
import './style.scss';
import Pixel from './Pixel';
import {createLineEquation} from '../math/lineTo';

class EditField extends Component {
  state = { field: {} };
  startDraw = (event) => {
    this.field.addEventListener('mousemove', this.draw);
    this.field.addEventListener('mouseleave', this.stopDraw);
    this.field.addEventListener('mouseup', this.stopDraw);
    this.drawing = true;
    this.calculate(event.pageX, event.pageY);
  };
  draw = event => {
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    this.calculate(x, y);
  };
  stopDraw = (event) => {
    if (this.drawing) {
      this.lastX = null;
      this.lastY = null;
      this.field.removeEventListener('mousemove', this.draw);
      this.field.removeEventListener('mouseleave', this.stopDraw);
      this.field.removeEventListener('mouseup', this.stopDraw);
      this.drawing = false;
    }
  };
  getRef = (el) => {
    window.max = 0;
    if(el) {
      this.field = el;
      this.startDim = this.field.getBoundingClientRect();
      this.field.addEventListener('mousedown', this.startDraw);
    } else {
      this.field.removeEventListener('mousedown', this.startDraw);
    }
  };

  color = 'black';

  fill = (x) => {
    window.max = Math.max(window.max, Object.values(x).length)
    console.log('added', Object.values(x).length, 'points');
    this.setState((state) => ({field: {...state.field, ...x}}), () => {
      console.log(Object.values(this.state.field).length, 'points')
    });
  };

  indexate = (x, y) => this.width * y  + x;

  calculate = (xl, yl) => {
    const lastX = this.lastX;
    const lastY = this.lastY;
    const xt = Math.min(Math.max(((xl - this.startDim.left) / this.pixelSize) | 0, 0), this.width - 1);
    const yt = Math.min(Math.max(((yl - this.startDim.top) / this.pixelSize) | 0, 0), this.height - 1);
    this.lastX = xt;
    this.lastY = yt;
    requestAnimationFrame(() => {
      const state = {};
      const i = this.indexate(xt, yt);
      state[i] = <Pixel
          key={i}
          x={xt}
          y={yt}
          scale={this.pixelSize}
          color={this.color}/>;
      if (lastY != null && lastX != null) {
        const equ = createLineEquation(lastX, lastY, xt, yt);
        if (equ.x) {
          const startY = Math.min(lastY, yt);
          const endY = Math.max(lastY, yt);
          for (let y = startY + 1; y < endY; y++) {
            const x = equ.x(y) | 0;
            const i = this.indexate(x, y);
            state[i] = <Pixel
                key={i}
                x={x}
                y={y}
                scale={this.pixelSize}
                color={this.color}/>;
          }
        } else {
          const startX = Math.min(lastX, xt);
          const endX = Math.max(lastX, xt);
          for (let x = startX + 1; x < endX; x++) {
            const y = equ.y(x) | 0;
            const i = this.indexate(x, y);
            state[i] = <Pixel
                key={i}
                x={x}
                y={y}
                scale={this.pixelSize}
                color={this.color}/>;
          }
        }
      }
      this.fill(state)
    })
  };
  height = 320;
  width = 320;
  originalWidth = 640;
  pixelSize = (this.originalWidth / this.width ) | 0;

  render() {
    const field = Object.values(this.state.field);
    return (
        <div
            ref={this.getRef}
            className="draw-pixel_edit-field"
            style={{ width: this.originalWidth, height: this.height * this.pixelSize }}>
          {field}
        </div>
    );
  }
}

export default EditField;
