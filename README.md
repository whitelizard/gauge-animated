# gauge-animated
A physically animated Gauge, using [velocitymodel](https://www.npmjs.com/package/velocitymodel)

### Install
```bash
npm i -S gauge-animated
```

### Demo
**Demo [here](http://codepen.io/whitelizard/pen/ggVoOR?editors=0010)**

The API is rather extensive and allows for a lot of customization to create very different looking gauges, as you can see in the demo. Look at the **bottom section of the JS code window in the demo** to find the configurations (API use) of all the examples.

### Details
The face of the gauge (the scale) is drawn in a `<canvas>`, the text lables are just `<div>`'s (that you can style), and the needle is `<svg>` (which you can override through your own function).

### Do you React?
There is also a **React**-wrapper of this gauge module: [react-gauge-animated](https://www.npmjs.com/package/react-gauge-animated)
