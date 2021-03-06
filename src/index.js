// import VelocityModel from 'velocitymodel/lib/velocitymodel';
// import ModelAnimator from 'velocitymodel/lib/modelanimator';
import { buildGaugeFace, stringToElement } from "./gaugeface";

export { buildGaugeFace, stringToElement } from "./gaugeface";

const radPerDeg = Math.PI / 180;
const degPerRad = 180 / Math.PI;
export const degToRad = degrees => degrees * radPerDeg;
export const radToDeg = radians => radians * degPerRad;

export function svgNeedle(size) {
  const c = 250;
  const scale = size / 500;
  return stringToElement(
    `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:${size}px; height:${size}px;">
      <g>
        <g transform="scale(${scale})">
          <circle cx="${c}" cy="${c}" r="15" style="fill:#000"/>
          <path d="M ${c} ${c + 4.5} L ${c * 1.9} ${c} L ${c} ${c -
      4.5} z" fill="#000" stroke="#111"/>
          <path d="M ${c} ${c + 3} L ${c - 75} ${c + 3} L ${c - 75} ${c - 3} L ${c} ${c -
      3} z" fill="#000" stroke="#111"/>
          <circle cx="${c - 80}" cy="${c}" r="10" style="fill:#000"/>
          <circle cx="${c - 80}" cy="${c}" r="5.5" style="fill:#fff"/>
          <circle cx="${c}" cy="${c}" r="4" style="stroke:#999;fill:#ccc"/>
        </g>
      </g>
    </svg>`
  );
}

const clamp = (min, max) => val => (val < min ? min : val > max ? max : val);
const tryAsNumber = val => {
  const unpacked = Array.isArray(val) ? val[0] : val;
  const asNum = Number(unpacked);
  const notNumber = unpacked === undefined || unpacked === null || Number.isNaN(asNum);
  return [notNumber, notNumber ? unpacked : asNum];
};

export class Gauge {
  constructor(parent, options) {
    const {
      size = 500,
      startAngle = Math.PI * 0.6,
      stopAngle = Math.PI * 2.4,
      valueCallback,
      valueDisplayDecimals = 0,
      valueDisplayPostfix,
      keepIndicatorsOnNullish,
      min = 0,
      max = 100,
      startValue,
      needleAngleMin = Math.PI * 0.507,
      needleAngleMax = Math.PI * 2.493,
      needleSvg = svgNeedle,
      // needleTransition = '.2s transform ease-out-quint'
      needleDuration = 0.3,
      needleEasing = "cubic-bezier(0.365, 1.285, 0.275, 1.000)"
      // needleEasing = 'cubic-bezier(0.170, 1.080, 0.415, 1.045)'
      // needleTransition = '2s transform cubic-bezier(0.170, 1.080, 0.415, 1.045)'
      // needleTransition = '.2s transform cubic-bezier(0.170, 1.080, 0.540, 1.025)'
      // needleTransition = '.2s transform cubic-bezier(0.280, 0.520, 0.635, 1)'
    } = options;
    // this.visual = this.visual.bind(this);
    this.parent = parent;
    this.center = size / 2;
    this.startAngle = startAngle;
    this.valueCallback = valueCallback;
    this.min = min;
    this.angleDiff = stopAngle - startAngle;
    this.max = max;
    this.interval = max - min;
    this.anglePerStep = this.angleDiff / this.interval;
    this.stepPerAngle = this.interval / this.angleDiff;
    this.valueDisplayDecimals = valueDisplayDecimals;
    this.valueDisplayPostfix = valueDisplayPostfix;
    this.keepIndicatorsOnNullish = keepIndicatorsOnNullish;
    this.valueDisplay = buildGaugeFace(parent, {
      ...options,
      size,
      startAngle,
      stopAngle,
      min,
      max
    });
    this.needleMinValue = this.angleToValue(needleAngleMin);
    this.needleMaxValue = this.angleToValue(needleAngleMax);
    this.clampValue = clamp(this.needleMinValue, this.needleMaxValue);
    this.needle = needleSvg(size);
    this.needle.style.position = "absolute";
    this.needle.style.top = 0;
    this.needle.style.left = 0;
    this.needleG = this.needle.querySelector("g");
    if (!this.keepIndicatorsOnNullish) {
      if (this.valueDisplay) this.valueDisplay.innerHTML = "";
      this.needleG.style.display = "none";
    }
    this.needleG.style.transformOrigin = `${this.center}px ${this.center}px`;
    this.needleG.style.transition = `${needleDuration}s transform ${needleEasing}`;
    // '.2s all cubic-bezier(0.310, 0.440, 0.445, 1.650)';
    // 'transition: ;transform-origin: ${(size + c) / 4}px ${(size + c) / 4}px';
    // 'transition: .2s all ease-in-out;transform-origin: ${(size + c) / 4}px ${(size + c) / 4}px';
    this.parent.style.position = "relative";
    this.parent.appendChild(this.needle);
    this.setTarget(startValue);
  }

  angleToValue(angle) {
    return this.min + (angle - this.startAngle) * this.stepPerAngle;
  }

  valueToAngle(value) {
    return this.startAngle + (value - this.min) * this.anglePerStep;
  }

  setTarget(value) {
    const [notNumber, val] = tryAsNumber(value);
    if (notNumber) {
      if (!this.keepIndicatorsOnNullish) {
        if (this.valueDisplay) this.valueDisplay.innerHTML = "";
        this.needleG.style.display = "none";
      }
      if (this.valueDisplay && typeof val === "string") {
        this.valueDisplay.innerHTML = val;
        if (this.valueCallback) this.valueCallback(val);
      }
      return;
    }
    const deg = radToDeg(this.valueToAngle(this.clampValue(val)));
    if (this.needleG.style.display === "none") this.needleG.style.display = "";
    this.needleG.setAttributeNS(null, "transform", `rotate(${deg} 0 0)`);
    if (this.valueDisplay)
      this.valueDisplay.innerHTML = `${val.toFixed(this.valueDisplayDecimals)}${
        this.valueDisplayPostfix ? this.valueDisplayPostfix : ""
      }`;
    if (this.valueCallback) this.valueCallback(val);
  }
}

export function createGauge(el, options) {
  return new Gauge(el, options);
}

export default Gauge;
