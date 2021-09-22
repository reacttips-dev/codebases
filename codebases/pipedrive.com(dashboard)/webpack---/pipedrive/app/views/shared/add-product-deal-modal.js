const componentLoader = require('webapp-component-loader');
const React = require('react');
const ReactDOM = require('react-dom');
const WebappApi = require('webapp-api/index');

const open = (elem, model) => {
	componentLoader.load('products-ui:add-product-deal-modal').then((ProductDealModal) => {
		ReactDOM.render(
			<ProductDealModal
				visible
				onCloseRequest={() => {
					ReactDOM.unmountComponentAtNode(elem);
				}}
				productsSelected={[]}
				webappApi={new WebappApi()}
				dealModel={model}
			/>,
			elem
		);
	});
};

const openProductDealModal = (model) => {
	let elem = document.getElementById('productsDetailsModal');

	// Creates div with class productsDetailsModal only if it does not exist already
	if (!elem) {
		elem = document.createElement('div');
		elem.className = 'productsDetailsModal';
	}

	return open(elem, model);
};

export { openProductDealModal };
