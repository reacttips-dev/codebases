import Cookies from 'js-cookie';

export const sameUser = (currentUser, vendastaUser) => {
	try {
		return (
			currentUser.userId === String(vendastaUser.userId) &&
			currentUser.companyId === String(vendastaUser.companyId)
		);
	} catch (_) {
		return false;
	}
};

export const parseVendastaCookie = (vendastaCookie) => {
	try {
		return JSON.parse(vendastaCookie);
	} catch (_) {
		return null;
	}
};

export default async (componentLoader, cdnDomain: string) => {
	const vendasta = Cookies.get('vendasta');

	if (!vendasta) {
		return;
	}

	const user = await componentLoader.load('webapp:user');
	const userId = `${user?.get('id')}`;
	const companyId = `${user?.get('company_id')}`;

	const parsedVendasta = parseVendastaCookie(vendasta);

	if (!sameUser({ userId, companyId }, parsedVendasta)) {
		Cookies.remove('vendasta');

		return;
	}

	const existingScript = document.getElementById('vendastaNavigationBar');

	if (!existingScript) {
		const cdnPath = `//cdn.${cdnDomain}/froot/`;
		const script = document.createElement('script');

		script.src = `${cdnPath}/libs/vendasta.min.js`;
		script.id = 'vendastaNavigationBar';
		script.setAttribute('data-url', parsedVendasta.dataUrl);
		script.setAttribute('data-app-id', parsedVendasta.productId);
		script.setAttribute('data-account-id', parsedVendasta.accountId);
		document.body.appendChild(script);
	}
};
