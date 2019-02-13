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
let left;
let top;

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

const onResult = function ({data: result}) {
  const { addPixelToLine, getLine } = createLine();
  result.forEach(addPixelToLine);
  fill(getLine());
  this.terminate();
};

const calculate = (point) => {

  //spawn threads works slower then keep
  const worker = new Worker('worker.js');
  worker.onmessage = onResult;
  worker.postMessage([{scale, width, height}, {left, top}, point, last]);
  last = point;
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
  const { left: l, top: t } = field.getBoundingClientRect();
  left = l;
  top = t;
  return {
    end: () => {
      field.removeEventListener('mousedown', startDraw);
      field.removeEventListener('mousemove', draw);
      field.removeEventListener('mouseleave', stopDraw);
      field.removeEventListener('mouseup', stopDraw);
    }
  }
};
