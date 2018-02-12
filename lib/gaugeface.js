'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = range;
exports.stringToElement = stringToElement;
exports.buildGaugeFace = buildGaugeFace;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function range(length) {
  return Array.apply(undefined, _toConsumableArray({ length: length })).map(Number.call, Number);
}

function stringToElement(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.querySelector(':first-child');
}

function drawMarkerLine(ctx, cosA, sinA, center, length, lineWidth) {
  var minRadius = center - length;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(center * (1 + cosA), center * (1 + sinA));
  ctx.lineTo(center + minRadius * cosA, center + minRadius * sinA);
  ctx.stroke();
}

// function drawLabel(ctx, cosA, sinA, center, radius, text) {
//   ctx.fillText(text, center + radius * cosA, center + radius * sinA);
// }

function drawScale(ctx, _ref) {
  var _ref$size = _ref.size,
      size = _ref$size === undefined ? 500 : _ref$size,
      _ref$startAngle = _ref.startAngle,
      startAngle = _ref$startAngle === undefined ? Math.PI * 0.7 : _ref$startAngle,
      _ref$stopAngle = _ref.stopAngle,
      stopAngle = _ref$stopAngle === undefined ? Math.PI * 2.3 : _ref$stopAngle,
      _ref$min = _ref.min,
      min = _ref$min === undefined ? 0 : _ref$min,
      _ref$max = _ref.max,
      max = _ref$max === undefined ? 100 : _ref$max,
      _ref$stepValue = _ref.stepValue,
      stepValue = _ref$stepValue === undefined ? 1 : _ref$stepValue,
      _ref$mediumSteps = _ref.mediumSteps,
      mediumSteps = _ref$mediumSteps === undefined ? 5 : _ref$mediumSteps,
      _ref$largeSteps = _ref.largeSteps,
      largeSteps = _ref$largeSteps === undefined ? 10 : _ref$largeSteps,
      _ref$markerLength = _ref.markerLength,
      markerLength = _ref$markerLength === undefined ? 8 : _ref$markerLength,
      _ref$markerWidth = _ref.markerWidth,
      markerWidth = _ref$markerWidth === undefined ? 1.5 : _ref$markerWidth,
      _ref$stopPinColor = _ref.stopPinColor,
      stopPinColor = _ref$stopPinColor === undefined ? '#666' : _ref$stopPinColor,
      markerColors = _ref.markerColors,
      markerWidths = _ref.markerWidths,
      markerLengths = _ref.markerLengths;

  ctx.save();
  var doublePi = 2 * Math.PI;
  var totalSteps = (max - min) / stepValue;
  var center = size / 2;
  var angleDiff = stopAngle - startAngle;
  var da = angleDiff / totalSteps;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  var a = startAngle;

  range(totalSteps + 1).forEach(function (i) {
    var sinA = Math.sin(a);
    var cosA = Math.cos(a);
    if (markerColors) ctx.strokeStyle = markerColors(i);
    var mW = void 0;
    if (markerWidths) mW = markerWidths(i);
    var mL = void 0;
    if (markerLengths) mL = markerLengths(i);
    if (largeSteps && i % largeSteps === 0) {
      drawMarkerLine(ctx, cosA, sinA, center, mL || markerLength * 1.6, mW || markerWidth * 1.75);
    } else if (mediumSteps && i % mediumSteps === 0) {
      drawMarkerLine(ctx, cosA, sinA, center, mL || markerLength * 1.3, mW || markerWidth * 1.4);
    } else {
      drawMarkerLine(ctx, cosA, sinA, center, mL || markerLength, mW || markerWidth);
    }
    a += da;
  });
  if (stopPinColor) {
    ctx.fillStyle = stopPinColor;
    ctx.beginPath();
    ctx.arc(center, center * 1.82, 5 * size / 500, 0, doublePi, true);
    ctx.fill();
  }
  ctx.restore();
}

function toFontStyleStr(size, family) {
  var s = '';
  if (size) s += 'font-size:' + size + 'px;';
  if (family) s += 'font-family:' + family + ' sans-serif;';
  return s;
}

function addScaleLabels(element, _ref2) {
  var _ref2$size = _ref2.size,
      size = _ref2$size === undefined ? 500 : _ref2$size,
      _ref2$startAngle = _ref2.startAngle,
      startAngle = _ref2$startAngle === undefined ? Math.PI * 0.7 : _ref2$startAngle,
      _ref2$stopAngle = _ref2.stopAngle,
      stopAngle = _ref2$stopAngle === undefined ? Math.PI * 2.3 : _ref2$stopAngle,
      _ref2$min = _ref2.min,
      min = _ref2$min === undefined ? 0 : _ref2$min,
      _ref2$max = _ref2.max,
      max = _ref2$max === undefined ? 100 : _ref2$max,
      _ref2$stepValue = _ref2.stepValue,
      stepValue = _ref2$stepValue === undefined ? 1 : _ref2$stepValue,
      _ref2$labelSteps = _ref2.labelSteps,
      labelSteps = _ref2$labelSteps === undefined ? 10 : _ref2$labelSteps,
      _ref2$decimals = _ref2.decimals,
      decimals = _ref2$decimals === undefined ? 0 : _ref2$decimals,
      _ref2$labelDivider = _ref2.labelDivider,
      labelDivider = _ref2$labelDivider === undefined ? 1 : _ref2$labelDivider,
      fontSize = _ref2.fontSize,
      fontFamily = _ref2.fontFamily,
      faceText = _ref2.faceText,
      faceTextFontSize = _ref2.faceTextFontSize,
      faceTextFontFamily = _ref2.faceTextFontFamily,
      _ref2$faceTextRadius = _ref2.faceTextRadius,
      faceTextRadius = _ref2$faceTextRadius === undefined ? 0.4 : _ref2$faceTextRadius,
      lables = _ref2.lables,
      labelsLevel = _ref2.labelsLevel,
      _ref2$labelRadius = _ref2.labelRadius,
      labelRadius = _ref2$labelRadius === undefined ? 0.83 : _ref2$labelRadius,
      scaleLabelFontSize = _ref2.scaleLabelFontSize,
      scaleLabelFontFamily = _ref2.scaleLabelFontFamily,
      _ref2$valueDisplay = _ref2.valueDisplay,
      valueDisplay = _ref2$valueDisplay === undefined ? true : _ref2$valueDisplay,
      _ref2$valueDisplayRad = _ref2.valueDisplayRadius,
      valueDisplayRadius = _ref2$valueDisplayRad === undefined ? 0.5 : _ref2$valueDisplayRad,
      valueDisplayFontSize = _ref2.valueDisplayFontSize,
      valueDisplayFontFamily = _ref2.valueDisplayFontFamily;

  // const doublePi = 2 * Math.PI;
  var totalSteps = (max - min) / stepValue;
  var center = size / 2;
  var angleDiff = stopAngle - startAngle;
  var da = angleDiff / totalSteps;
  var a = startAngle; // - Math.PI/2;
  var style = '\n    position: absolute;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 0;\n    height: 0;\n    white-space: nowrap;\n  ';
  var fontStr = toFontStyleStr(fontSize, fontFamily);
  range(totalSteps + 1).forEach(function (i) {
    var sinA = Math.sin(a);
    var cosA = Math.cos(a);
    if (labelSteps && i % labelSteps === 0) {
      var label = stringToElement('\n        <div class="gauge-scale-label" style="' + style + (toFontStyleStr(scaleLabelFontSize, scaleLabelFontFamily) || fontStr) + '">' + ((stepValue * i + min) / labelDivider).toFixed(decimals) + '</div>\n      ');
      var r = center * labelRadius;
      label.style.top = center + r * sinA + 'px';
      label.style.left = center + r * cosA + 'px';
      element.appendChild(label);
    }
    a += da;
  });
  if (faceText) {
    var label = stringToElement('\n      <div class="gauge-face-text" style="' + style + (toFontStyleStr(faceTextFontSize, faceTextFontFamily) || fontStr) + '">' + faceText + '</div>\n    ');
    var r = center * faceTextRadius * -1;
    label.style.top = center + r + 'px';
    label.style.left = center + 'px';
    element.appendChild(label);
  }
  if (valueDisplay) {
    var _label = stringToElement('\n      <div class="gauge-value-display" style="' + style + (toFontStyleStr(valueDisplayFontSize, valueDisplayFontFamily) || fontStr) + '">-</div>\n    ');
    var _r = center * valueDisplayRadius;
    _label.style.top = center + _r + 'px';
    _label.style.left = center + 'px';
    element.appendChild(_label);
    return _label;
  }
  return undefined;
}

function buildGaugeFace(element, options) {
  var size = options.size;

  var canvas = stringToElement('<canvas width="' + size + '" height="' + size + '"/>');
  element.appendChild(canvas);
  drawScale(canvas.getContext('2d'), options);
  return addScaleLabels(element, options);
}