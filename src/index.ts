import openseadragon from 'openseadragon';

declare global {
	interface Window {
		openseadragonContainer: HTMLDivElement;
	}
}

const url = 'https://shop.r10s.jp/book/cabinet/1432/9784581021432.jpg';
console.log(url);

const img = new Image();
img.src = url;
document.body.appendChild(img);
// const osd = openseadragon({
// 	element: window.openseadragonContainer,
// 	tileSources: url,
// });
