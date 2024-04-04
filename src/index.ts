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
	tileSources: {
		type: 'image',
		url: img.src,
	},
	useCanvas: false,
	maxZoomLevel: 1000,
});

const panFactor = 0.008;
const zoomFactor = 0.02;
const zoomThreshold = 0.1;
const panThreshold = 0.1;

window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
	setInterval(() => {
		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[event.gamepad.index];
		if (gamepad) {
			const leftStickX = gamepad.axes[0];
			const leftStickY = gamepad.axes[1];
			const rightStickY = gamepad.axes[3];
			const xButtonPressed = gamepad.buttons[2].pressed;
			const yButtonPressed = gamepad.buttons[3].pressed;

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

			if (xButtonPressed) osd.viewport.goHome();

			if (yButtonPressed) {
				if (!document.fullscreenElement) {
					osd.setFullScreen(true);
				} else {
					osd.setFullScreen(false);
				}
			}
		}
	}, 10);
});
