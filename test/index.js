// import style from './style';
import { Component } from 'preact';
// import Gauge, { createGauge } from '../index';
import { createGauge, stringToElement } from '../index';

export default class App extends Component {
	updateGauge = () => {
		const value = Math.random() * 130;
		// console.log('Setting:', value);
		this.gauge.setTarget(value);
	};
	componentDidMount() {
		console.log(createGauge, stringToElement);
		// const testG = new Gauge(this.area, { size: 300 });
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
