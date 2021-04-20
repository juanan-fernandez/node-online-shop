const deleteProduct = btn => {
	const productId = btn.parentNode.querySelector('input[name="productId"]').value;
	const csrf = btn.parentNode.querySelector('input[name=_csrf]').value;

	const productElement = btn.closest('article');

	fetch('/admin/delete-product/' + productId, {
		method: 'DELETE',
		headers: {
			'csrf-token': csrf,
		},
	})
		.then(response => {
			return response.json();
		})
		.then(data => {
			console.log(data);
			productElement.parentNode.removeChild(productElement);
		})
		.catch(err => {
			console.log(err);
		});
};
