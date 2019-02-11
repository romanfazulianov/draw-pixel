export function createLineEquation(/*начальная точка*/x0, y0, /*конечная*/x1, y1) {//уравнение прямой в декартовых координатах
  const dx = x1 - x0;
  const dy = y1 - y0;
  const aDX = Math.abs(dx);
  const aDY = Math.abs(dy);
  if (aDX === aDY && aDX === 0) {
    return {
      y: (x) => 0
    }
  }
  if (aDX < aDY) {
    return {
      x: (y) => (y*dx - y0*dx +x0*dy)/dy
    }
  }
  const t = dy / dx; //соотношение сторон треугольника
  const dt = y0 - t * x0; // смещение от y = 0

  return {
    y: (x) => t * x + dt,
  };
}

/*
x0y0
---------
|points2|
|check  |
---------x1y1
*/
