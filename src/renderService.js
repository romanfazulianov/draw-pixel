import React from 'react';
import Pixel from './EditField/Pixel';
import { createLineEquation } from './math/lineTo';
let notify;
let field;
let animInProgress;
let pixels = {};
const height = 320;
const width = 320;
const scale = 2;
let drawing = false;
const color = 'black';
let lastX = null;
let lastY = null;

const indexate = (x, y) => width * y  + x;

const createLine = (line = {}) => ({
  addPixelToLine: (x, y) => {
    const i = indexate(x, y);
    line[i] = <Pixel
        key={i}
        x={x}
        y={y}
        scale={scale}
        color={color}/>;
  },
  getLine: () => line
});

const calculate = (xl, yl) => {
  const { addPixelToLine, getLine } = createLine();
  const { left, top } = field.getBoundingClientRect();
  const xt = Math.min(Math.max(((xl - left) / scale) | 0, 0), width - 1);
  const yt = Math.min(Math.max(((yl - top) / scale) | 0, 0), height - 1);

  addPixelToLine(xt, yt);
  if (lastY != null && lastX != null) {
    const equ = createLineEquation(lastX, lastY, xt, yt);
    if (equ.x) {
      const startY = Math.min(lastY, yt);
      const endY = Math.max(lastY, yt);
      for (let y = startY + 1; y < endY; y++) {
        const x = equ.x(y) | 0;
        addPixelToLine(x, y);
      }
    } else {
      const startX = Math.min(lastX, xt);
      const endX = Math.max(lastX, xt);
      for (let x = startX + 1; x < endX; x++) {
        const y = equ.y(x) | 0;
        addPixelToLine(x, y);
      }
    }
  }
  fill(getLine());
  lastX = xt;
  lastY = yt;
  // worker = new Worker("worker.js");
  // startDim = field.getBoundingClientRect();
  // worker.terminate();
  //TODO createWorker, callWorker, getResult, terminateWorker
};

const fill = (x) => {
  pixels =  {...pixels, ...x};
  if (!animInProgress) {
    //тушить колбеки которые чаще 60fps
    animInProgress = true;
    requestAnimationFrame(() => {
          notify(Object.values(pixels));
          animInProgress = false
        }
    );
  }
};

const draw = event => {
  if (drawing) {
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    calculate(x, y);
  }
};

const stopDraw = (event) => {
  if (drawing) {
    lastX = null;
    lastY = null;
    drawing = false;
  }
};

const startDraw = (event) => {
  drawing = true;
  calculate(event.pageX, event.pageY);
};

export const createDrawer = (el, updater) => {
  field = el;
  notify = updater;
  field.style.width = width * scale + 'px';
  field.style.height = height * scale + 'px';
  field.addEventListener('mousedown', startDraw);
  field.addEventListener('mousemove', draw);
  field.addEventListener('mouseleave', stopDraw);
  field.addEventListener('mouseup', stopDraw);
  return {
    end: () => {
      field.removeEventListener('mousedown', startDraw);
      field.removeEventListener('mousemove', draw);
      field.removeEventListener('mouseleave', stopDraw);
      field.removeEventListener('mouseup', stopDraw);
    }
  }
};
