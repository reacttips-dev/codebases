import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const loadedCoachMarks = {};

let iamClient;

const createCoachMark = (API, tag, addToCoachMarks) => {
	if (loadedCoachMarks[tag]) {
		return addToCoachMarks(tag, loadedCoachMarks[tag]);
	}

	const coachMark = new API.Coachmark({
		__debug: false,
		tag,
		onReady: (data) => {
			addToCoachMarks(tag, { visible: data.active, close: coachMark.close });
		},
	});

	return null;
};

const createCoachMarks = async (iamClientPromise, tags, addToCoachMarks) => {
	const API = await iamClientPromise;

	tags.forEach((tag) => createCoachMark(API, tag, addToCoachMarks));
};

const withCoachMarks = (ComponentToWrap, tags = []) => {
	const WrappedComponent = (props) => {
		const webappApi = props.webappApi;

		if (!webappApi) {
			return null;
		}

		const [loaded, setLoaded] = useState(false);
		const [coachMarks, setCoachmarks] = useState({});

		const addToCoachMarks = (tag, coachMark) => {
			if (!loadedCoachMarks[tag]) {
				loadedCoachMarks[tag] = coachMark;
			}

			setCoachmarks({ ...coachMarks, [tag]: coachMark });
		};

		const closeCoachMark = (tag) => {
			const updateCoachmark = coachMarks[tag];

			if (!updateCoachmark) {
				return;
			}

			updateCoachmark.close();
			updateCoachmark.visible = false;

			setCoachmarks({ ...coachMarks, [tag]: updateCoachmark });
			loadedCoachMarks[tag].visible = false;
		};

		useEffect(() => {
			if (!iamClient) {
				iamClient = webappApi.componentLoader.load('iam-client');
			}

			if (!loaded) {
				createCoachMarks(iamClient, tags, addToCoachMarks).then(() => setLoaded(true));
			}
		}, [loaded]);

		return (
			<ComponentToWrap {...props} coachMarks={coachMarks} closeCoachMark={closeCoachMark} />
		);
	};

	WrappedComponent.propTypes = {
		webappApi: PropTypes.object.isRequired,
	};

	return WrappedComponent;
};

const coachMarkTags = {
	CALENDAR_SYNC_TEASER: 'calendar_sync_promo_activity_modal',
};

export { withCoachMarks, coachMarkTags };
