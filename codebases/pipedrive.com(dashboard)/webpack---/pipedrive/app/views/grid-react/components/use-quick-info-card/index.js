import React from 'react';
import WebappApi from 'webapp-api/index';
import componentLoader from 'webapp-component-loader';

/* eslint-disable react/display-name */
const useQuickInfoCard = () => {
	const [QuickInfoCard, setQuickInfoCard] = React.useState(null);
	const webappApi = React.useRef(new WebappApi());

	React.useEffect(() => {
		const fetchQuickInfoCard = async () => {
			const { default: QuickInfoCardComponent } = await componentLoader.load(
				'quick-info-card'
			);

			setQuickInfoCard(() => (props) => (
				<QuickInfoCardComponent webappApi={webappApi.current} {...props} />
			));
		};

		fetchQuickInfoCard();
	}, []);

	return QuickInfoCard;
};
/* eslint-disable react/display-name */

export default useQuickInfoCard;
