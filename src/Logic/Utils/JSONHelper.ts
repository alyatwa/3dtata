export function loadJSON(path:string) {
	return new Promise((resolve, reject) => {
	  fetch(path)
		.then(response => response.json())
		.then(json => {
		  resolve(json);
		})
		.catch(error => {
		  reject(error);
		});
	});
}