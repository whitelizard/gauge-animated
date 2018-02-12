'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gauge = exports.radToDeg = exports.degToRad = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import VelocityModel from 'velocitymodel/lib/velocitymodel';
// import ModelAnimator from 'velocitymodel/lib/modelanimator';


exports.svgNeedle = svgNeedle;
exports.createGauge = createGauge;

var _gaugeface = require('./gaugeface.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var radPerDeg = Math.PI / 180;
var degPerRad = 180 / Math.PI;
var degToRad = exports.degToRad = function degToRad(degrees) {
  return degrees * radPerDeg;
};
var radToDeg = exports.radToDeg = function radToDeg(radians) {
  return radians * degPerRad;
};

function svgNeedle(size) {
  var c = 250;
  var scale = size / 500;
  return (0, _gaugeface.stringToElement)('<svg viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg" style="width:' + size + 'px; height:' + size + 'px;">\n      <g>\n        <g transform="scale(' + scale + ')">\n          <circle cx="' + c + '" cy="' + c + '" r="15" style="fill:#000"/>\n          <path d="M ' + c + ' ' + (c + 4.5) + ' L ' + c * 1.9 + ' ' + c + ' L ' + c + ' ' + (c - 4.5) + ' z" fill="#000" stroke="#111"/>\n          <path d="M ' + c + ' ' + (c + 3) + ' L ' + (c - 75) + ' ' + (c + 3) + ' L ' + (c - 75) + ' ' + (c - 3) + ' L ' + c + ' ' + (c - 3) + ' z" fill="#000" stroke="#111"/>\n          <circle cx="' + (c - 80) + '" cy="' + c + '" r="10" style="fill:#000"/>\n          <circle cx="' + (c - 80) + '" cy="' + c + '" r="5.5" style="fill:#fff"/>\n          <circle cx="' + c + '" cy="' + c + '" r="4" style="stroke:#999;fill:#ccc"/>\n        </g>\n      </g>\n    </svg>');
}

var Gauge = exports.Gauge = function () {
  function Gauge(parent, options) {
    _classCallCheck(this, Gauge);

    var _options$size = options.size,
        size = _options$size === undefined ? 500 : _options$size,
        _options$startAngle = options.startAngle,
        startAngle = _options$startAngle === undefined ? Math.PI * 0.6 : _options$startAngle,
        _options$stopAngle = options.stopAngle,
        stopAngle = _options$stopAngle === undefined ? Math.PI * 2.4 : _options$stopAngle,
        valueCallback = options.valueCallback,
        _options$valueDisplay = options.valueDisplayDecimals,
        valueDisplayDecimals = _options$valueDisplay === undefined ? 0 : _options$valueDisplay,
        valueDisplayPostfix = options.valueDisplayPostfix,
        _options$min = options.min,
        min = _options$min === undefined ? 0 : _options$min,
        _options$max = options.max,
        max = _options$max === undefined ? 100 : _options$max,
        _options$startValue = options.startValue,
        startValue = _options$startValue === undefined ? 0 : _options$startValue,
        _options$needleAngleM = options.needleAngleMin,
        needleAngleMin = _options$needleAngleM === undefined ? Math.PI * 0.507 : _options$needleAngleM,
        _options$needleAngleM2 = options.needleAngleMax,
        needleAngleMax = _options$needleAngleM2 === undefined ? Math.PI * 2.493 : _options$needleAngleM2,
        _options$needleSvg = options.needleSvg,
        needleSvg = _options$needleSvg === undefined ? svgNeedle : _options$needleSvg,
        _options$needleDurati = options.needleDuration,
        needleDuration = _options$needleDurati === undefined ? 0.3 : _options$needleDurati,
        _options$needleEasing = options.needleEasing,
        needleEasing = _options$needleEasing === undefined ? 'cubic-bezier(0.365, 1.285, 0.275, 1.000)' : _options$needleEasing;
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
    this.valueDisplay = (0, _gaugeface.buildGaugeFace)(parent, _extends({}, options, {
      size: size,
      startAngle: startAngle,
      stopAngle: stopAngle,
      min: min,
      max: max
    }));
    this.needleMinValue = this.angleToValue(needleAngleMin);
    this.needleMaxValue = this.angleToValue(needleAngleMax);
    this.needle = needleSvg(size);
    this.needle.style.position = 'absolute';
    this.needle.style.top = 0;
    this.needle.style.left = 0;
    this.needleG = this.needle.querySelector('g');
    this.needleG.style.transformOrigin = this.center + 'px ' + this.center + 'px';
    this.needleG.style.transition = needleDuration + 's transform ' + needleEasing;
    // '.2s all cubic-bezier(0.310, 0.440, 0.445, 1.650)';
    // 'transition: ;transform-origin: ${(size + c) / 4}px ${(size + c) / 4}px';
    // 'transition: .2s all ease-in-out;transform-origin: ${(size + c) / 4}px ${(size + c) / 4}px';
    this.parent.style.position = 'relative';
    this.parent.appendChild(this.needle);
    this.setTarget(startValue);
  }

  _createClass(Gauge, [{
    key: 'angleToValue',
    value: function angleToValue(angle) {
      return this.min + (angle - this.startAngle) * this.stepPerAngle;
    }
  }, {
    key: 'valueToAngle',
    value: function valueToAngle(value) {
      return this.startAngle + (value - this.min) * this.anglePerStep;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(value, target) {
      if (typeof value !== 'number') return;
      if (this.valueCallback) this.valueCallback(value);
      if (this.valueDisplay) {
        var x = value;
        if (target < this.min || target > this.max) x = target;
        x = x.toFixed(this.valueDisplayDecimals);
        if (this.valueDisplayPostfix) x += this.valueDisplayPostfix;
        this.valueDisplay.innerHTML = x;
      }
      if (value < this.needleMinValue) value = this.needleMinValue;
      if (value > this.needleMaxValue) value = this.needleMaxValue;
      var deg = radToDeg(this.valueToAngle(value));
      this.needleG.setAttributeNS(null, 'transform', 'rotate(' + deg + ' 0 0)');
    }
  }]);

  return Gauge;
}();

function createGauge(el, options) {
  return new Gauge(el, options);
}

exports.default = Gauge;