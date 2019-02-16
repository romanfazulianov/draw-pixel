function createLineEquation(/*начальная точка*/x0, y0, /*конечная*/x1, y1) {
  //уравнение прямой в декартовых координатах
  const dx = x1 - x0;
  const dy = y1 - y0;
  const aDX = Math.abs(dx);
  const aDY = Math.abs(dy);
  if (aDX === aDY && aDX === 0) {
    return {
      y: (x) => 0,
    };
  }
  if (aDX < aDY) {
    return {
      x: (y) => (y * dx - y0 * dx + x0 * dy) / dy,
    };
  }
  const t = dy / dx; //соотношение сторон треугольника
  const dt = y0 - t * x0; // смещение от y = 0

  return {
    y: (x) => t * x + dt,
  };
}

const to1DArray = (x, y, width) => width * y  + x;

const createLine = (width, color, line = {}) => ({
  addPixelToLine: (x, y) => {
    const i = to1DArray(x, y, width);
    line[i] = {
      i,
      x,
      y,
      color
    };
  },
  getLine: () => line
});

onmessage = function(e) {
  const [{scale, color, width, height}, {left, top}, point, last] = e.data;
  const { addPixelToLine, getLine} = createLine(width, color);
  const xt = Math.min(
      Math.max(((point.x - left) / scale) | 0, 0),
      width - 1
  );
  const yt = Math.min(
      Math.max(((point.y - top) / scale) | 0, 0),
      height - 1
  );

  addPixelToLine(xt, yt);

  if (last !== null) {
    const xl = Math.min(
        Math.max(((last.x - left) / scale) | 0, 0),
        width - 1
    );
    const yl = Math.min(
        Math.max(((last.y - top) / scale) | 0, 0),
        height - 1
    );
    const equ = createLineEquation(xl, yl, xt, yt);
    if (equ.x) {
      const startY = Math.min(yl, yt);
      const endY = Math.max(yl, yt);
      for (let y = startY + 1; y < endY; y++) {
        const x = equ.x(y) | 0;
        addPixelToLine(x, y);
      }
    } else {
      const startX = Math.min(xl, xt);
      const endX = Math.max(xl, xt);
      for (let x = startX + 1; x < endX; x++) {
        const y = equ.y(x) | 0;
        addPixelToLine(x, y);
      }
    }
  }

  postMessage(getLine());
};
