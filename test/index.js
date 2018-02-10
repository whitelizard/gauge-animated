// import style from './style';
import { Component } from 'preact';
import { createGauge } from './lib';

export default class App extends Component {
  updateGauge = () => {
    const value = Math.random() * 100;
    console.log('Setting:', value);
    this.gauge.setTarget(value);
  };
  componentDidMount() {
    this.gauge = createGauge(this.area, { size: 300 });
    // console.log(this.gauge);
    setInterval(() => {
      this.updateGauge();
    }, 1000);
  }
  render() {
    return (
      <div>
        <div ref={c => (this.area = c)} />
      </div>
    );
  }
}
