import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';

import { searchEntities, searchProjects } from '../../../../../api';
import { InputSelect } from '@pipedrive/form-fields';
import { prioritizeDeal } from './helpers';

import modalContext from '../../../../../utils/context';
import HoverCard from '../../../../../common-components/hover-card';

const MainEntity = styled(InputSelect)`
	margin-bottom: 8px;
`;

const PROJECTS_SUITE = 'PROJECTS';

const getEntity = ({ deal, lead, project }) => {
	if (deal) {
		return {
			type: 'deal',
			id: deal.get('id'),
			data: deal.set('type', 'deal'),
		};
	}

	if (lead) {
		return {
			type: 'lead',
			id: lead.get('id'),
			data: lead.set('type', 'lead'),
		};
	}

	if (project) {
		return {
			type: 'project',
			id: project.get('id'),
			data: project.set('type', project),
		};
	}

	return {
		type: null,
		id: null,
		data: null,
	};
};

const onChangeRemovals = {
	deal: { lead: null, project: null },
	lead: { deal: null, project: null },
	project: { deal: null, lead: null },
};

const getPlaceholderText = (translator, isProjectsAlphaEnabled) => {
	if (isProjectsAlphaEnabled) {
		return translator.gettext('Deal, Lead or Project');
	}

	return translator.gettext('Deal or Lead');
};

const getIsProjectsAlphaEnabled = (webappApi) => {
	const companyFeatures = webappApi.userSelf.companyFeatures.attributes;
	const userSuites = webappApi.userSelf.attributes.suites;
	const isProjectsFeatureEnabled = companyFeatures && companyFeatures.projects_alpha;
	const isIdentitySuitesFeatureEnabled = companyFeatures && companyFeatures.identity_suites;

	return (
		isProjectsFeatureEnabled &&
		(!isIdentitySuitesFeatureEnabled ||
			(isIdentitySuitesFeatureEnabled && userSuites?.includes(PROJECTS_SUITE)))
	);
};

const MainEntityField = (props) => {
	const {
		deal,
		lead,
		project,
		participants,
		organization,
		updateMultipleFields,
		translator,
		webappApi,
		logger,
	} = props;

	const hasParticipants = !!participants?.toJS()?.length;
	const hasOrganization = !!organization?.toJS();
	const isProjectsAlphaEnabled = getIsProjectsAlphaEnabled(webappApi);

	const getSuggestionValue = (suggestion) => {
		const { item } = suggestion;
		const title = item && item.title;
		const orgTitle = item && item.organization && item.organization.name;

		return orgTitle ? `${title} (${orgTitle})` : title;
	};

	const entity = getEntity({ deal, lead, project });
	const [inputIcon, setInputIcon] = useState(entity.type || 'deal');
	const [value, setValue] = useState(getSuggestionValue({ item: entity.data?.toJS() }));

	useEffect(() => {
		setValue(getSuggestionValue({ item: entity.data?.toJS() }));
	}, [entity.data]);

	const getEntities = async (value) => {
		const dealOrLeadSearchResults = await searchEntities({
			term: value,
			itemTypes: 'lead,deal',
			fields: 'title',
		});

		const sortedDealOrLeadSearchResults = prioritizeDeal(dealOrLeadSearchResults);

		if (!isProjectsAlphaEnabled) {
			return sortedDealOrLeadSearchResults;
		}

		const projectsSearchResults = await searchProjects({ term: value });

		return sortedDealOrLeadSearchResults.concat(projectsSearchResults);
	};

	const handleChange = (suggestion) => {
		if (suggestion && suggestion.item) {
			const { item } = suggestion;

			setInputIcon(item.type);
			updateMultipleFields({
				[item.type]: item,
				...(!hasParticipants && item.person && item.person.id
					? { participants: [item.person] }
					: {}),
				...(!hasOrganization && item.organization && item.organization.id
					? { organization: item.organization }
					: {}),
				...onChangeRemovals[item.type],
			});
			setValue(getSuggestionValue(suggestion));
		} else {
			updateMultipleFields({ deal: null, lead: null, project: null });
			setValue(null);
		}
	};

	const getSuggestionIcon = (suggestion) => {
		return suggestion && suggestion.item ? suggestion.item.type : inputIcon;
	};
	const hoverCardProps = {
		...(entity.type !== 'project' && { type: entity.type, id: entity.id }),
	};

	return (
		<HoverCard webappApi={webappApi} logger={logger} hoverCardProps={hoverCardProps}>
			<div data-test="activity-form-deal-or-lead-suggestion">
				<MainEntity
					key={`${entity.type}-${entity.id}`}
					inputProps={{
						icon: inputIcon,
						onBlur: () => !value && setValue(''),
					}}
					portalTo={document.body}
					getSuggestionValue={getSuggestionValue}
					getSuggestionIcon={getSuggestionIcon}
					suggestionIcon={inputIcon}
					getSuggestions={getEntities}
					dropdownTrigger={2}
					value={value}
					placeholder={getPlaceholderText(translator, isProjectsAlphaEnabled)}
					onComponentChange={handleChange}
					disableNewLabel
					allowClear
				/>
			</div>
		</HoverCard>
	);
};

MainEntityField.propTypes = {
	updateMultipleFields: PropTypes.func.isRequired,
	deal: ImmutablePropTypes.map,
	relatedOrganization: ImmutablePropTypes.map,
	organization: ImmutablePropTypes.map,
	participants: ImmutablePropTypes.list,
	lead: ImmutablePropTypes.map,
	project: ImmutablePropTypes.map,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
};

export default modalContext(MainEntityField);
