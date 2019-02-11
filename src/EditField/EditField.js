import React, { Component } from 'react';
import './style.scss';
import Pixel from './Pixel';
import {createLineEquation} from '../math/lineTo';

class EditField extends Component {
  state = {};
  startDraw = (event) => {
    document.getElementsByTagName("body")[0].style['user-select'] = 'none';
    document.addEventListener('mousemove', this.draw);
    this.field.addEventListener('mouseleave', this.stopDraw);
    this.draw({...event});
    this.setState((state) => ({draw: true}));
    this.calculate(event.clientX, event.clientY);

  };
  draw = event => this.calculate(event.clientX, event.clientY);
  stopDraw = (event) => {
    if (this.state.draw) {
      document.getElementsByTagName("body")[0].style['user-select'] = null;
      document.removeEventListener('mousemove', this.draw);
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
      console.log(this.startDim)
    }
  };

  fill = (x, y) => {
    const index = this.width * (y + 1) + x;
    this.setState((state) => ({[index]: {...state[index], color: 'red'}}))
  };

  calculate (xl, yl) {
    console.log ('__start___', {xl, yl})
    const xt = ((xl - this.startDim.x) / this.pixelSize) | 0;
    const yt = ((yl - this.startDim.y) / this.pixelSize) | 0;
    this.fill(xt, yt);

    if (this.lastY != null && this.lastX != null) {
      const equ = createLineEquation(this.lastX, this.lastY, xt, yt);
      let run = this.lastX - xt;
      const step = run !== 0 ? run / Math.abs(run) : 0;
      console.log({px: this.lastX, py: this.lastY, xt, yt, run, step})
      if (step === 0) {
        const startY = Math.min(this.lastY, yt);
        const endY = Math.max(this.lastY, yt);
        for (let yp = startY; yp <= endY; yp++) {
          console.log('vline', {xt, yp})
          this.fill(xt, yp)
        }
      } else {
        let prevY = yt;
        for (let x = xt; x <= this.lastX; x = x + step) {
          const y = equ.y(x) | 0;
          this.fill(x, y);
          if (prevY - y >= 1) {
            const startY = Math.min(prevY, y);
            const endY = Math.max(prevY, y);
            for (let yp = startY; yp <= endY; yp++) {
              console.log('vline t', {xt, yp})
              this.fill(x, yp)
            }
          }
          prevY = y;
        }
      }
      console.log('_end__', this.lastX - xt, this.lastY - yt)

    }
    this.lastX = xt;
    this.lastY = yt;

  }
  height = 32;
  width = 48;
  originalWidth = 1200;
  pixelSize = (this.originalWidth / this.width ) | 0;

  render() {
    const field = [];
    const fieldSize = this.width * this.height;
    while (field.length < fieldSize) {
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
