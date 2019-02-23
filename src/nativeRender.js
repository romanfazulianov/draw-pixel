import {createPixel, updatePixel} from './EditField/createPixel';
// move to worker
let pixels = {};
const height = 320;
const width = 320;
const scale = 2;
const color = 'black';
let last = null;
let left;
let top;
//end of list
// leave here only dom
const workerQ = [];
let working = false;
let drawing = false;
let field;
let lD;
let pixelsQ = {};


const updateCycleStart = () => {
  requestAnimationFrame(() => {
    if (drawing || working) updateCycleStart();
    const keys = Object.keys(pixelsQ);
    if(!keys.length) return;
    const fragment = document.createElement('div');
    Object.keys(pixelsQ).forEach(key => {
      pixels[key] = pixels[key]
          ? updatePixel(pixels[key])
          : createPixel(pixelsQ[key], fragment, scale);
    });
    pixelsQ = {};
    field.appendChild(fragment);
    if (lD) {
      const nD = Date.now();
      console.log(Object.keys(pixels).length, (1000 / (nD - lD)).toFixed(2) + 'fps');
      lD = nD;
    } else {
      lD = Date.now();
    }
  })
};

// let max = 0;
const fill = (x) => {
  Object.assign(pixelsQ, x);
};

const worker = new Worker('nativeWorker.js');

worker.onmessage = ({data: result}) => {
  fill(result);
  if (workerQ.length === 0) {
    working = false;
    if (!drawing) {
      last = null;
    }
    return;
  }
  const point = workerQ.shift();
  worker.postMessage([{scale, color, width, height}, {left, top}, point, last]);
  last = point;
};

const postMessage = (point) => {
  if (working) {
    workerQ.push(point);
    return;
  }
  working = true;
  worker.postMessage([{scale, color, width, height}, {left, top}, point, last]);
  last = point;
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
  drawing = false;
  if (workerQ.length === 0)
  {
    last = null;
  }
  lD = undefined;
  field.removeEventListener('mousemove', draw);
  field.removeEventListener('mouseleave', stopDraw);
  field.removeEventListener('mouseup', stopDraw);
};

const startDraw = (event) => {
  drawing = true;
  field.addEventListener('mousemove', draw);
  field.addEventListener('mouseleave', stopDraw);
  field.addEventListener('mouseup', stopDraw);
  draw(event);
  updateCycleStart();
};

export const createDrawer = (el) => {
  field = el;
  const { left: l, top: t } = field.getBoundingClientRect();
  left = l;
  top = t;
  field.style.width = width * scale + 'px';
  field.style.height = height * scale + 'px';
  field.addEventListener('mousedown', startDraw);
};
