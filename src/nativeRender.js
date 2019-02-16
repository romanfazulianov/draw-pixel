import { createPixel } from './EditField/createPixel';
let field;
let pixels = {};
const height = 128;
const width = 128;
const scale = 4;
let drawing = false;
const color = 'black';
let last = null;
const workerQ = [];
let working = false;
let left;
let top;
// let max = 0;
const fill = (x) => {
  Object.keys(x).forEach(key => {
    pixels[key] = createPixel(x[key], pixels[key], field, scale)
  });
  // max = Math.max(max, Object.keys(x).length)
  // console.log('max', max)
  // console.log('total', Object.keys(pixels).length)
};

const worker = new Worker('nativeWorker.js');

worker.onmessage = ({data: result}) => {
  if (workerQ.length > 0) {
    const point = workerQ.shift();
    worker.postMessage([{scale, color, width, height}, {left, top}, point, last]);
    last = point;
  } else {
    working = false;
    if(!drawing) {
      last = null;
    }
  }
  fill(result);
};

const postMessage = (point) => {
  if (working) {
    workerQ.push(point);
  } else {
    working = true;
    worker.postMessage([{scale, color, width, height}, {left, top}, point, last]);
    last = point;
  }
};

const draw = event => {
  if (drawing) {
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    postMessage({x, y});
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

export const createDrawer = (el) => {
  field = el;
  const { left: l, top: t } = field.getBoundingClientRect();
  left = l;
  top = t;
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
