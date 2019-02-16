/**
 * writes or updates a point on a field;
 * @param point {i, x, y, color }
 * @param prevPoint ?{i, x, y, color, dom }
 * @param field
 * @param scale
 * @returns {*}
 */
export function createPixel (point, prevPoint, field, scale) {
  if (prevPoint && prevPoint.dom) {
    prevPoint.color = point.color;
    prevPoint.dom.style.background = point.color;
    return prevPoint;
  }
  point.dom = document.createElement('div');
  point.dom.className = 'pixel';
  Object.assign(point.dom.style, {
    height: scale + 'px',
    width: scale + 'px',
    top: point.y * scale + 'px',
    left: point.x * scale + 'px',
    position: 'absolute',
    background: point.color
  });

  field.appendChild(point.dom);
  return point;
}
