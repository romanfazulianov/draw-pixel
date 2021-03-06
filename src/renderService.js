import React from 'react';
import Pixel from './EditField/Pixel';
let notify;
let field;
let animInProgress;
let pixels = {};
const height = 320;
const width = 320;
const scale = 2;
let drawing = false;
const color = 'black';
let last = null;
const workerQ = [];
let working = false;
const indexate = (x, y) => width * y  + x;

const createLine = (line = {}) => ({
  addPixelToLine: ({x, y}) => {
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

const worker = new Worker('worker.js');

worker.onmessage = ({data: result}) => {
  if (drawing) {
    if (workerQ.length > 0) {
      const [{scale, width, height}, {left, top}, point] = workerQ.shift();
      worker.postMessage([{scale, width, height}, {left, top}, point, last]);
      last = point;
    } else {
      working = false;
    }
  } else {
    working = false;
  }
  const { addPixelToLine, getLine } = createLine();
  result.forEach(addPixelToLine);
  fill(getLine());
};

const postMessage = ([{scale, width, height}, {left, top}, point]) => {
  if (working) {
    workerQ.push([{scale, width, height}, {left, top}, point]);
  } else {
    working = true;
    worker.postMessage([{scale, width, height}, {left, top}, point, last]);
    last = point;
  }
};

const calculate = (point) => {
  const { left, top } = field.getBoundingClientRect();

  const workerData = [{scale, width, height}, {left, top}, point];

  postMessage(workerData);
};

const draw = event => {
  if (drawing) {
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    calculate({x, y});
  }
};

const stopDraw = (event) => {
  if (drawing) {
    last = null;
    drawing = false;
  }
};

const startDraw = (event) => {
  drawing = true;
  draw(event);
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
      worker.terminate();
      field.removeEventListener('mousedown', startDraw);
      field.removeEventListener('mousemove', draw);
      field.removeEventListener('mouseleave', stopDraw);
      field.removeEventListener('mouseup', stopDraw);
    }
  }
};
