import {createPixel, updatePixel} from './EditField/createPixel';
let field;
let pixels = {};
const height = 320;
const width = 320;
const scale = 2;
let drawing = false;
const color = 'black';
let last = null;
const workerQ = [];
let working = false;
let left;
let top;
// let max = 0;
const fill = (x) => {
//  console.log(document.styleSheets);//create a rules in body!!! without using inlines
  requestAnimationFrame(() => {
    const fragment = document.createElement('div');
    Object.keys(x).forEach(key => {
      pixels[key] = pixels[key]
          ? updatePixel(x[key], pixels[key], scale)
          : createPixel(x[key], fragment, scale);
    });
    field.appendChild(fragment)
  })
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
