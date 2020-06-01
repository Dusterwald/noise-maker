/* not bound to style, should be computed */

export function computeInOffsetByIndex(x, y, index) {
  const outx = x + 20;
  const outy = y + 47 + (index * 20);
  // const outy = y + 65 + (index * 20);

  return { x: outx, y: outy };
}

export function computeOutOffsetByIndex(x, y, index) {
  const outx = x + 160;
  const outy = y + 49 + (index * 22);
  // const outy = y + 72 + (index * 22);

  return { x: outx, y: outy };
}
