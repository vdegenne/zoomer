import openseadragon, {Point} from 'openseadragon';

declare global {
	interface Window {
		openseadragonContainer: HTMLDivElement;
	}
}

const url = 'https://shop.r10s.jp/book/cabinet/1432/9784581021432.jpg';
const img = new Image();
img.src = url;

const osd = openseadragon({
	element: window.openseadragonContainer,
	tileSources: {
		type: 'image',
		url: img.src,
	},
	useCanvas: true,
	maxZoomLevel: 1000,
});

const panDistance = 0.005;
const leftPan = new Point(-panDistance, 0);
const rightPan = new Point(panDistance, 0);
const upPan = new Point(0, -panDistance);
const downPan = new Point(0, panDistance);

// gameControl.on('connect', (gamepad) => {
// 	gamepad.axeThreshold = [0.15];
// 	gamepad.on(XBoxButton.LEFT_STICK_LEFT, () => {
// 		console.log('left');
// 		osd.viewport.panBy(leftPan);
// 	});
// 	gamepad.on(XBoxButton.LEFT_STICK_RIGHT, () => {
// 		console.log('right');
// 		osd.viewport.panBy(rightPan);
// 	});
// 	gamepad.on(XBoxButton.LEFT_STICK_UP, () => {
// 		console.log('up');
// 		osd.viewport.panBy(upPan);
// 	});
// 	gamepad.on(XBoxButton.LEFT_STICK_DOWN, () => {
// 		console.log('down');
// 		osd.viewport.panBy(downPan);
// 	});
//
// 	gamepad.on(XBoxButton.RIGHT_STICK_UP, () => {
// 		console.log(osd.viewport.getZoom());
// 		osd.viewport.zoomBy(1.01);
// 	});
// 	gamepad.on(XBoxButton.RIGHT_STICK_DOWN, () => {
// 		osd.viewport.zoomBy(0.99);
// 	});
// });

const panFactor = 0.01;

function bindLeftStickToPanBy() {
	function handleGamepadInput(gamepad: Gamepad) {
		const leftStickX = gamepad.axes[0];
		const leftStickY = gamepad.axes[1];

		const panByX = Math.sign(leftStickX) * Math.pow(leftStickX, 2) * panFactor;
		const panByY = Math.sign(leftStickY) * Math.pow(leftStickY, 2) * panFactor;

		osd.viewport.panBy(new Point(panByX, panByY), false);
	}

	window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
		setInterval(() => {
			const gamepads = navigator.getGamepads();
			const gamepad = gamepads[event.gamepad.index];
			if (gamepad) {
				handleGamepadInput(gamepad);
			}
		}, 10);
	});
}

bindLeftStickToPanBy();
