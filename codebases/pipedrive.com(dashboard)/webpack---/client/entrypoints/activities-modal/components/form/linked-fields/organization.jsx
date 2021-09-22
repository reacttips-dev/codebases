import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { Organization } from '@pipedrive/form-fields';
import modalContext from '../../../../../utils/context';
import HoverCard from '../../../../../common-components/hover-card';

const OrganizationInput = styled(Organization)`
	margin-bottom: 0;
`;

const OrganizationField = (props) => {
	const { updateField, translator, webappApi, logger } = props;
	const organization = props.organization && {
		...props.organization.toJS(),
		id: props.organization.get('id') || props.organization.get('value'),
	};
	const orgId = organization && organization.id;

	return (
		<HoverCard
			webappApi={webappApi}
			logger={logger}
			hoverCardProps={{
				type: 'organization',
				id: orgId,
			}}
		>
			<div data-test="activity-form-org-suggestion">
				<OrganizationInput
					key={`organization-${orgId || 'new'}`}
					portalTo={document.body}
					value={organization}
					placeholder={translator.gettext('Organization')}
					onComponentChange={(suggestion) => {
						updateField('organization', suggestion === '' ? null : suggestion);
					}}
					allowNewItem
					allowClear
				/>
			</div>
		</HoverCard>
	);
};

OrganizationField.propTypes = {
	updateField: PropTypes.func.isRequired,
	organization: ImmutablePropTypes.map,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
};

export default modalContext(OrganizationField);
