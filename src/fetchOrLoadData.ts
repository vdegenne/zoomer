export async function fetchOrLoadImage(url: string) {
	try {
		// Attempt to fetch the image using fetch
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		// If fetch is successful, extract the raw image data
		const blob = await response.blob();
		const reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error('Error fetching image:', error);

		// If fetch fails, load the image directly into an <img> element
		const imgElement = document.createElement('img');
		imgElement.src = url;

		return new Promise((resolve, reject) => {
			imgElement.onload = () => {
				// Convert the image into raw data
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				canvas.width = imgElement.width;
				canvas.height = imgElement.height;
				context!.drawImage(imgElement, 0, 0);
				const imageData = context!.getImageData(
					0,
					0,
					canvas.width - 1,
					canvas.height - 1,
				);
				resolve(imageData.data);
			};
			imgElement.onerror = reject;
		});
	}
}
