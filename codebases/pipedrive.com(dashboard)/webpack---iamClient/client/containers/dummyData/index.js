import React, { useState, useRef, useEffect } from 'react';
import { componentLoader } from '../../utils/componentLoader';
import DefaultView from './defaultVIew';
import { Spinner } from '@pipedrive/convention-ui-react';
import style from './style.css';
import {
	isAccountLessThan30Days,
	getApiConfig,
} from './utils';
import PropTypes from 'prop-types';

const getDummyDataService = async () => {
	try {
		return await componentLoader.load('dummy-data-service');
	} catch (e) {
		return null;
	}
};

export const isDummyDataService = async () => {
	const dummyDataService = await getDummyDataService();
	const apiConfig = await getApiConfig(componentLoader);

	if (!dummyDataService) {
		return false;
	}

	const isInTrialAndAdmin = apiConfig.userSelf.get('company_status') === 'in_trial' && apiConfig.userSelf.get('is_admin');

	return isAccountLessThan30Days(apiConfig.userSelf.get('created')) && isInTrialAndAdmin;
};

const DummyData = () => {
	const ddRef = useRef();

	useEffect(() => {
		const initDummyData = async () => {
			const dummyDataService = await getDummyDataService();
			const apiConfig = await getApiConfig(componentLoader);

			dummyDataService.initDummyData(ddRef.current, apiConfig);
		};

		initDummyData();
	}, []);

	return (
		<div className={style.parentWrapper} ref={ddRef}/>
	);
};

export const DummyDataSection = ({ gettext }) => {
	const [isDummyData, setIsDummyData] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadDDS = async () => {
			const isDDS = await isDummyDataService();

			setIsDummyData(isDDS);
			setLoading(false);
		};

		loadDDS();
	}, []);

	if (loading) {
		return <div className={style.parentWrapper}><Spinner size={'l'} className={style.spinner}/></div>;
	}

	if (!isDummyData) {
		return <div className={style.parentWrapperSmall}><DefaultView gettext={gettext}/></div>;
	}

	return <DummyData />;
};

DummyDataSection.propTypes = {
	gettext: PropTypes.func.isRequired,
};

