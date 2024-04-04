export function getImgQueryParam() {
	const queryParams = new URLSearchParams(window.location.search);
	const imgValue = queryParams.get('img');
	return imgValue;
}
