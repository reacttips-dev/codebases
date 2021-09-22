import { getUrl } from '../utils/helpers';
import { SelectedItem } from '../types/apollo-query-types';
import { getRouter } from '../api/webapp';

const useRouter = () => {
	const router = getRouter();

	const goTo = (item: SelectedItem) => {
		let url = '';

		if (typeof item === 'object') {
			url = getUrl(item.type, item.id);
		} else {
			url = item;
		}

		if (url !== window.location.pathname) {
			router.navigateTo(url);
		}
	};

	const on = (...args: any[]) => {
		router.on(...args);
	};

	const off = (...args: any[]) => {
		router.off(...args);
	};

	return [goTo, on, off];
};

export default useRouter;
