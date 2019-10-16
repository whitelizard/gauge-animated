// import style from './style';
import { Component } from "preact";
// import Gauge, { createGauge } from '../index';
import { createGauge, stringToElement } from "../index";

export default class App extends Component {
  updateGauge = (gauge, range = [0, 100]) => {
    const [rMin, rMax] = range;
    const interval = rMax - rMin;
    const value = Math.random() * interval + rMin;
    // console.log('Setting:', value);
    gauge.setTarget(value);
  };

  componentDidMount() {
    console.log(createGauge, stringToElement);
    // const testG = new Gauge(this.area, { size: 300 });
    this.gauge = createGauge(this.area, {
      size: 300
    });
    setInterval(() => {
      this.updateGauge(this.gauge);
    }, 1000);

    this.gauge2 = createGauge(this.area2, {
      size: 300,
      min: 0.1,
      max: 1.8,
      valueDisplayDecimals: 2,
      // startValue: 0.1,
      decimals: 3,
      stepValue: 0.1
    });
    // console.log(this.gauge);
    setInterval(() => {
      this.updateGauge(this.gauge2, [0, 2]);
    }, 1000);
  }

  render() {
    return (
      <div>
        <div ref={c => (this.area = c)} />
        <div ref={c => (this.area2 = c)} />
      </div>
    );
  }
}
