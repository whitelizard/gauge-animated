# Complex Configurable Gauge

A CSS3 animated gauge, with a rather complex & highly configurable gauge face (and SVG needle).

### Install

```bash
npm i -S gauge-animated
```

### Use

```js
import { createGauge } from 'gauge-animated/lib';
createGauge(document.body, {...});
```

### Demo

**Demo [here](http://codepen.io/whitelizard/pen/zRwOaJ?editors=0010)**

The API is rather extensive and allows for a lot of customization to create very different looking gauges, as you can see in the demo. Look at the **bottom section of the JS code window in the demo** to find the configurations (API use) of all the examples.

### Details

The face of the gauge (the scale) is drawn in a `<canvas>`, the text lables are just `<div>`'s (that you can style), and the needle is `<svg>` (which you can override through your own function).

# Licence

Hippocratic License Version 2.1
