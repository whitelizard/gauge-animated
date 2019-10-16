export function range(length) {
  // return Array(...{ length }).map(Number.call, Number);
  return [...Array(Math.round(length))].map((_, i) => i);
}

export function stringToElement(str) {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div.querySelector(":first-child");
}

function drawMarkerLine(ctx, cosA, sinA, center, length, lineWidth) {
  const minRadius = center - length;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(center * (1 + cosA), center * (1 + sinA));
  ctx.lineTo(center + minRadius * cosA, center + minRadius * sinA);
  ctx.stroke();
}

// function drawLabel(ctx, cosA, sinA, center, radius, text) {
//   ctx.fillText(text, center + radius * cosA, center + radius * sinA);
// }

function drawScale(
  ctx,
  {
    size = 500,
    startAngle = Math.PI * 0.7, // [rad]
    stopAngle = Math.PI * 2.3, // [rad]
    min = 0,
    max = 100,
    stepValue = 1,
    mediumSteps = 5,
    largeSteps = 10,
    // labelSteps = 10,
    markerLength = 8,
    markerWidth = 1.5,
    stopPinColor = "#666",
    markerColors,
    markerWidths,
    markerLengths
  }
) {
  ctx.save();
  const doublePi = 2 * Math.PI;
  const totalSteps = (max - min) / stepValue;
  const center = size / 2;
  const angleDiff = stopAngle - startAngle;
  const da = angleDiff / totalSteps;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  let a = startAngle;

  range(totalSteps + 1).forEach(i => {
    const sinA = Math.sin(a);
    const cosA = Math.cos(a);
    if (markerColors) ctx.strokeStyle = markerColors(i);
    let mW;
    if (markerWidths) mW = markerWidths(i);
    let mL;
    if (markerLengths) mL = markerLengths(i);
    if (largeSteps && i % largeSteps === 0) {
      drawMarkerLine(
        ctx,
        cosA,
        sinA,
        center,
        mL || markerLength * 1.6,
        mW || markerWidth * 1.75
      );
    } else if (mediumSteps && i % mediumSteps === 0) {
      drawMarkerLine(
        ctx,
        cosA,
        sinA,
        center,
        mL || markerLength * 1.3,
        mW || markerWidth * 1.4
      );
    } else {
      drawMarkerLine(
        ctx,
        cosA,
        sinA,
        center,
        mL || markerLength,
        mW || markerWidth
      );
    }
    a += da;
  });
  if (stopPinColor) {
    ctx.fillStyle = stopPinColor;
    ctx.beginPath();
    ctx.arc(center, center * 1.82, (5 * size) / 500, 0, doublePi, true);
    ctx.fill();
  }
  ctx.restore();
}

function toFontStyleStr(size, family) {
  let s = "";
  if (size) s += `font-size:${size}px;`;
  if (family) s += `font-family:${family} sans-serif;`;
  return s;
}

function addScaleLabels(
  element,
  {
    size = 500,
    startAngle = Math.PI * 0.7, // [rad]
    stopAngle = Math.PI * 2.3, // [rad]
    min = 0,
    max = 100,
    stepValue = 1,
    labelSteps = 10,
    decimals = 0,
    labelDivider = 1,
    // markerLength = 8,
    // markerWidth = 1.5,
    fontSize,
    fontFamily,
    faceText,
    faceTextFontSize,
    faceTextFontFamily,
    faceTextRadius = 0.4,
    // lables,
    // labelsLevel,
    labelRadius = 0.83,
    scaleLabelFontSize,
    scaleLabelFontFamily,
    // stopPinColor = '#666',
    valueDisplay = true,
    valueDisplayRadius = 0.5,
    valueDisplayFontSize,
    valueDisplayFontFamily
  }
) {
  // const doublePi = 2 * Math.PI;
  const totalSteps = (max - min) / stepValue;
  const center = size / 2;
  const angleDiff = stopAngle - startAngle;
  const da = angleDiff / totalSteps;
  let a = startAngle; // - Math.PI/2;
  const style = `
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0;
    height: 0;
    white-space: nowrap;
  `;
  const fontStr = toFontStyleStr(fontSize, fontFamily);
  range(totalSteps + 1).forEach(i => {
    const sinA = Math.sin(a);
    const cosA = Math.cos(a);
    if (labelSteps && i % labelSteps === 0) {
      const label = stringToElement(
        `
        <div class="gauge-scale-label" style="${style}${toFontStyleStr(
  scaleLabelFontSize,
  scaleLabelFontFamily
) || fontStr}">${((stepValue * i + min) / labelDivider).toFixed(
  decimals
)}</div>
      `
      );
      const r = center * labelRadius;
      label.style.top = `${center + r * sinA}px`;
      label.style.left = `${center + r * cosA}px`;
      element.appendChild(label);
    }
    a += da;
  });
  if (faceText) {
    const label = stringToElement(
      `
      <div class="gauge-face-text" style="${style}${toFontStyleStr(
  faceTextFontSize,
  faceTextFontFamily
) || fontStr}">${faceText}</div>
    `
    );
    const r = center * faceTextRadius * -1;
    label.style.top = `${center + r}px`;
    label.style.left = `${center}px`;
    element.appendChild(label);
  }
  if (valueDisplay) {
    const label = stringToElement(
      `
      <div class="gauge-value-display" style="${style}${toFontStyleStr(
  valueDisplayFontSize,
  valueDisplayFontFamily
) || fontStr}">-</div>
    `
    );
    const r = center * valueDisplayRadius;
    label.style.top = `${center + r}px`;
    label.style.left = `${center}px`;
    element.appendChild(label);
    return label;
  }
  return undefined;
}

export function buildGaugeFace(element, options) {
  const { size } = options;
  const canvas = stringToElement(`<canvas width="${size}" height="${size}"/>`);
  element.appendChild(canvas);
  drawScale(canvas.getContext("2d"), options);
  return addScaleLabels(element, options);
}
