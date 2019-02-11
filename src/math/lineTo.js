export function createLineEquation(/*начальная точка*/x0, y0, /*конечная*/x1, y1) {//уравнение прямой в декартовых координатах
  const xd = x1 - x0;
  const t = xd === 0 ? 0 : (y1 - y0) / xd; //соотношение сторон треугольника
  const dt = y0 - t * x0; // смещение от y = 0

  return {
    y: (x) => t * x + dt,
    x: y => dt
  };
}

/*
x0y0
---------
|points2|
|check  |
---------x1y1
*/
