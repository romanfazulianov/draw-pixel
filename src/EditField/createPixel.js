//create etalon, clone it
let etalon = document.createElement('div');
etalon.className = 'pixel black s02';
/**
 * writes a point on a field;
 * @param point {i, x, y, color }
 * @param field
 * @param scale
 * @returns {*}
 */
export function createPixel (point, field, scale) {
  point.dom = etalon.cloneNode(true);
  point.dom.style.cssText =
      `top: ${point.y * scale}px; left: ${point.x * scale}px;`;

  field.appendChild(point.dom);
  return point;
}

/**
 * updates by cloning
 * @param prevPoint
 * @returns {*}
 */
export function updatePixel (prevPoint) {
  if (prevPoint.dom.className === etalon.className) {
    return prevPoint;
  }
  prevPoint.dom.className = etalon.className;
  return prevPoint;
}
