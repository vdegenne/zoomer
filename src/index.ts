import openseadragon, {Point} from 'openseadragon';
import {getImgQueryParam} from './utils.js';

declare global {
	interface Window {
		openseadragonContainer: HTMLDivElement;
	}
}

let url =
	getImgQueryParam() ??
	'https://shop.r10s.jp/book/cabinet/1432/9784581021432.jpg';

const img = new Image();
img.src = url;

const osd = openseadragon({
	element: window.openseadragonContainer,
	showNavigationControl: false,
	tileSources: {
		type: 'image',
		url: img.src,
	},
	navImages: {
		home: {
			REST: '../zoomer/images/home_rest.png',
			HOVER: '../zoomer/images/home_hover.png',
			GROUP: '../zoomer/images/home_grouphover.png',
			DOWN: '../zoomer/images/home_pressed.png',
		},
		zoomIn: {
			REST: '../zoomer/images/zoomin_rest.png',
			HOVER: '../zoomer/images/zoomin_hover.png',
			GROUP: '../zoomer/images/zoomin_grouphover.png',
			DOWN: '../zoomer/images/zoomin_pressed.png',
		},
		zoomOut: {
			REST: '../zoomer/images/zoomout_rest.png',
			HOVER: '../zoomer/images/zoomout_hover.png',
			GROUP: '../zoomer/images/zoomout_grouphover.png',
			DOWN: '../zoomer/images/zoomout_pressed.png',
		},
		flip: {
			REST: '../zoomer/images/flip_rest.png',
			HOVER: '../zoomer/images/flip_hover.png',
			GROUP: '../zoomer/images/flip_grouphover.png',
			DOWN: '../zoomer/images/flip_pressed.png',
		},
		next: {
			REST: '../zoomer/images/next_rest.png',
			HOVER: '../zoomer/images/next_hover.png',
			GROUP: '../zoomer/images/next_grouphover.png',
			DOWN: '../zoomer/images/next_pressed.png',
		},
		fullpage: {
			REST: '../zoomer/images/fullpage_rest.png',
			HOVER: '../zoomer/images/fullpage_hover.png',
			GROUP: '../zoomer/images/fullpage_grouphover.png',
			DOWN: '../zoomer/images/fullpage_pressed.png',
		},
		previous: {
			REST: '../zoomer/images/previous_rest.png',
			HOVER: '../zoomer/images/previous_hover.png',
			GROUP: '../zoomer/images/previous_grouphover.png',
			DOWN: '../zoomer/images/previous_pressed.png',
		},
		rotateleft: {
			REST: '../zoomer/images/rotateleft_rest.png',
			HOVER: '../zoomer/images/rotateleft_hover.png',
			GROUP: '../zoomer/images/rotateleft_grouphover.png',
			DOWN: '../zoomer/images/rotateleft_pressed.png',
		},
		rotateright: {
			REST: '../zoomer/images/rotateright_rest.png',
			HOVER: '../zoomer/images/rotateright_hover.png',
			GROUP: '../zoomer/images/rotateright_grouphover.png',
			DOWN: '../zoomer/images/rotateright_pressed.png',
		},
	},
	navigatorOpacity: 0,
	useCanvas: false,
	maxZoomLevel: 1000,
});

const panFactor = 0.004;
const zoomFactor = 0.02;
const zoomThreshold = 0.1;
const panThreshold = 0.1;

let preventRightStickButton = false;
let preventX = false;
let preventY = false;
let preventGuide = false;

let guard: boolean | undefined = undefined;
window.addEventListener('blur', () => (guard = true));
window.addEventListener('focus', () => {
	setTimeout(() => (guard = false), 500);
});
setTimeout(() => (guard = false), 500);

window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
	setInterval(() => {
		if (guard) return;
		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[event.gamepad.index];
		if (gamepad) {
			const leftStickX = gamepad.axes[0];
			const leftStickY = gamepad.axes[1];
			// const rightStickX = gamepad.axes[2];
			const rightStickY = gamepad.axes[3];
			const xButtonPressed = gamepad.buttons[2].pressed;
			const yButtonPressed = gamepad.buttons[3].pressed;
			const rightStickPressed = gamepad.buttons[11].pressed;
			const backButtonPressed = gamepad.buttons[8].pressed;
			// const leftTriggerPressed = gamepad.buttons[6].pressed;
			const guidePressed = gamepad.buttons[16].pressed;
			const leftTriggerPressed = gamepad.buttons[6].pressed;

			// if (yButtonPressed) {
			// 	if (preventY) {
			// 		return;
			// 	}
			// 	document.dispatchEvent(new Event('xbox-y', {bubbles: true}));
			// 	preventY = true;
			// 	return;
			// } else if (preventY !== false) {
			// 	preventY = false;
			// 	return;
			// }
			//
			// if (guidePressed) {
			// 	if (preventGuide) {
			// 		return;
			// 	}
			// 	let eventType = leftTriggerPressed
			// 		? 'xbox-guide-secondary'
			// 		: 'xbox-guide';
			// 	document.dispatchEvent(new Event(eventType, {bubbles: true}));
			// 	preventGuide = true;
			// 	return;
			// } else if (preventGuide !== false) {
			// 	preventGuide = false;
			// 	return;
			// }

			if (xButtonPressed) {
				if (preventX) {
					return;
				}
				if (!document.fullscreenElement) {
					osd.setFullScreen(true);
				} else {
					osd.setFullScreen(false);
				}
				preventX = true;
				return;
			} else if (preventX !== false) {
				preventX = false;
				return;
			}

			if (rightStickPressed) {
				if (preventRightStickButton) {
					return;
				}
				osd.viewport.goHome();
				preventRightStickButton = true;
				return;
			} else {
				preventRightStickButton = false;
			}

			const panByX =
				Math.abs(leftStickX) > panThreshold
					? Math.sign(leftStickX) * Math.pow(leftStickX, 2) * panFactor
					: 0;
			const panByY =
				Math.abs(leftStickY) > panThreshold
					? Math.sign(leftStickY) * Math.pow(leftStickY, 2) * panFactor
					: 0;
			osd.viewport.panBy(new Point(panByX, panByY), false);

			if (Math.abs(rightStickY) > zoomThreshold) {
				const zoomDirection = -Math.sign(rightStickY);
				const zoomFactorAdjusted =
					Math.pow(Math.abs(rightStickY), 2) * zoomFactor * zoomDirection;
				osd.viewport.zoomBy(1 + zoomFactorAdjusted, undefined, false);
			}
		}
	}, 10);
});
