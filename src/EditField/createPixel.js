/**
 * writes a point on a field;
 * @param point {i, x, y, color }
 * @param field
 * @param scale
 * @returns {*}
 */
export function createPixel (point, field, scale) {
  point.dom = document.createElement('div');
  point.dom.setAttribute("id", point.i);
  point.dom.style.cssText =
      `height: ${scale}px; width: ${scale}px; top: ${point.y * scale}px; left: ${point.x * scale}px;  position: absolute; background: ${point.color};`;

  field.appendChild(point.dom);
  return point;
}

/**
 * updates by cloning
 * @param point
 * @param prevPoint
 * @param scale
 * @returns {*}
 */
export function updatePixel (point, prevPoint, scale) {
  if (point.color === prevPoint.color) {
    return prevPoint;
  }
  var clone = prevPoint.dom.cloneNode(true);
  clone.style.cssText =
      `height: ${scale}px; width: ${scale}px; top: ${point.y * scale}px; left: ${point.x * scale}px;  position: absolute; background: ${point.color};`;
  prevPoint.dom.parentNode.replaceChild(clone, prevPoint.dom);
  prevPoint.dom = null;
  point.dom = clone;
  return point;
}
