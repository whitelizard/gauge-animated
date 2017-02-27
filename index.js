
const radPerDeg = Math.PI/180;
const degPerRad = 180/Math.PI;
export const degToRad = degrees => degrees*radPerDeg;
export const radToDeg = radians => radians*degPerRad;

export function range(length) {
  return Array.apply(null, { length }).map(Number.call, Number);
}

export function stringToElement(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.querySelector(':first-child');
}

export function svgNeedle(size) {
  const c = 250;
  const scale = size / 500;
  return stringToElement(`
    <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:${size}px; height:${size}px;">
      <g>
        <g transform="scale(${scale})">
          <circle cx="${c}" cy="${c}" r="15" style="fill:#000"/>
          <path d="M ${c} ${c+4.5} L ${c*1.9} ${c} L ${c} ${c-4.5} z" fill="#000" stroke="#111"/>
          <path d="M ${c} ${c+3} L ${c-75} ${c+3} L ${c-75} ${c-3} L ${c} ${c-3} z" fill="#000" stroke="#111"/>
          <circle cx="${c-80}" cy="${c}" r="10" style="fill:#000"/>
          <circle cx="${c-80}" cy="${c}" r="5.5" style="fill:#fff"/>
          <circle cx="${c}" cy="${c}" r="4" style="stroke:#999;fill:#ccc"/>
        </g>
      </g>
    </svg>
  `);
}

function drawMarkerLine(ctx, cosA, sinA, center, length, lineWidth) {
  const minRadius = center - length;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(center * (1 + cosA), center * (1 + sinA));
  ctx.lineTo(center + minRadius * cosA, center + minRadius * sinA);
  ctx.stroke();
}

function drawLabel(ctx, cosA, sinA, center, radius, text) {
  ctx.fillText(text, center+radius*cosA, center+radius*sinA);
}

function drawScale(ctx, {
  size = 500,
  startAngle = Math.PI*0.7, // [rad]
  stopAngle = Math.PI*2.3, // [rad]
  min = 0,
  max = 100,
  stepValue = 1,
  mediumSteps = 5,
  largeSteps = 10,
  labelSteps = 10,
  markerLength = 8,
  markerWidth = 1.5,
  stopPinColor = '#666',
  markerColors,
  markerWidths,
  markerLengths,
}) {
  ctx.save();
  const doublePi = 2 * Math.PI;
  const totalSteps = (max - min)/stepValue;
  const center = size / 2;
  const angleDiff = stopAngle - startAngle;
  const da = angleDiff / totalSteps;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
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
      drawMarkerLine(ctx, cosA, sinA, center, mL || markerLength*1.6, mW || markerWidth*1.75);
    } else if (mediumSteps && i % mediumSteps === 0) {
      drawMarkerLine(ctx, cosA, sinA, center, mL || markerLength*1.3, mW || markerWidth*1.4);
    } else  {
      drawMarkerLine(ctx, cosA, sinA, center, mL || markerLength, mW || markerWidth);
    }
    a += da;
  });
  if (stopPinColor) {
    ctx.fillStyle = stopPinColor;
    ctx.beginPath();
    ctx.arc(center, center*1.82, 5*size/500, 0, doublePi, true);
    ctx.fill();
  }
  ctx.restore();
}

function addScaleLabels(element, {
  size = 500,
  startAngle = Math.PI*0.7, // [rad]
  stopAngle = Math.PI*2.3, // [rad]
  min = 0,
  max = 100,
  stepValue = 1,
  labelSteps = 10,
  decimals = 0,
  labelDivider = 1,
  markerLength = 8,
  markerWidth = 1.5,
  font,
  faceText,
  lables,
  labelsLevel,
  labelRadius = 0.83,
  stopPinColor = '#666',
  valueDisplay,
}) {
  const doublePi = 2 * Math.PI;
  const totalSteps = (max - min)/stepValue;
  const center = size / 2;
  const angleDiff = stopAngle - startAngle;
  const da = angleDiff / totalSteps;
  let a = startAngle;// - Math.PI/2;
  const style = `
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0;
    height: 0;
    white-space: nowrap;
    ${font ? `font:${font};` : ''}
  `;
  range(totalSteps + 1).forEach(i => {
    const sinA = Math.sin(a);
    const cosA = Math.cos(a);
    if (labelSteps && i % labelSteps === 0) {
      const label = stringToElement(`
        <div class="gauge-scale-label" style="${style}">${
          ((stepValue*i + min)/labelDivider).toFixed(decimals)
        }</div>
      `);
      const r = center*labelRadius;
      label.style.top = `${center+r*sinA}px`;
      label.style.left = `${center+r*cosA}px`;
      element.appendChild(label);
    }
    a += da;
  });
  if (faceText) {
    const label = stringToElement(`
      <div class="gauge-face-text" style="${style}">${
        faceText
      }</div>
    `);
    const r = center*0.4;
    label.style.top = `${center+r*-1}px`;
    label.style.left = `${center}px`;
    element.appendChild(label);
  }
  if (valueDisplay) {
    const label = stringToElement(`
      <div class="gauge-value-display" style="${style}">-</div>
    `);
    const r = center*0.5;
    label.style.top = `${center+r*1}px`;
    label.style.left = `${center}px`;
    element.appendChild(label);
    return label;
  }
  return undefined;
}

function buildGaugeFace(element, options) {
  const { size } = options;
  const canvas = stringToElement(`<canvas width="${size}" height="${size}"/>`);
  element.appendChild(canvas);
  drawScale(canvas.getContext('2d'), options);
  return addScaleLabels(element, options);
}

export default class Gauge {
  constructor(parent, options) {
    const {
      size = 500,
      P = 100,
      I = 0,
      D = 10,
      startAngle = Math.PI*0.6,
      stopAngle = Math.PI*2.4,
      valueCallback,
      valueDisplayDecimals = 0,
      valueDisplayPostfix,
      min = 0,
      max = 100,
      startValue = 0,
      needleAngleMin = Math.PI*0.507,
      needleAngleMax = Math.PI*2.493,
      needleSvg = svgNeedle,
      maxV,
    } = options;
    this.visual = this.visual.bind(this);
    this.parent = parent;
    this.center = size / 2;
    this.startAngle = startAngle;
    this.valueCallback = valueCallback;
    this.min = min,
    // this.max = max,
    this.angleDiff = stopAngle - startAngle;
    this.interval = max - min;
    this.anglePerStep = this.angleDiff/this.interval;
    this.stepPerAngle = this.interval/this.angleDiff;
    this.model = new VelocityModel({ P, I, D,
      min: this.angleToValue(needleAngleMin),
      max: this.angleToValue(needleAngleMax),
      start: startValue,
      maxV,
    });
    this.anim = new ModelAnimator(this.model, this.visual);
    this.valueDisplayDecimals = valueDisplayDecimals;
    this.valueDisplayPostfix = valueDisplayPostfix;
    this.valueDisplay = buildGaugeFace(parent, { ...options,
      size,
      startAngle,
      stopAngle,
      min,
      max,
    });
    this.needle = needleSvg(size);
    this.needle.style.position = 'absolute';
    this.needle.style.top = 0;
    this.needle.style.left = 0;
    this.needleG = this.needle.querySelector('g');
    parent.style.position = 'relative';
    parent.appendChild(this.needle);
    this.visual(startValue);
  }
  angleToValue(angle) {
    return this.min + (angle - this.startAngle) * this.stepPerAngle;
  }
  valueToAngle(value) {
    return this.startAngle + (value - this.min) * this.anglePerStep;
  }
  visual(value) {
    if (typeof value !== 'number') return;
    if (this.valueCallback) this.valueCallback(value);
    if (this.valueDisplay) {
      let x = value.toFixed(this.valueDisplayDecimals);
      if (this.valueDisplayPostfix) x += this.valueDisplayPostfix;
      this.valueDisplay.innerHTML = x;
    }
    const deg = radToDeg(this.valueToAngle(value));
    this.needleG.setAttributeNS(null, 'transform', `rotate(${deg} ${this.center} ${this.center})`);
  }
  setTarget(value) {
    this.anim.setTarget(value);
  }
}
