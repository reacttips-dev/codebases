import { Option, Icon } from '@pipedrive/convention-ui-react';
import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { addNewActivityModal } from '../../../../shared/api/webapp/modals';
import { Container } from './StyledComponents';

interface OwnProps {
	deal: Pipedrive.Deal;
	onActivitySaved: () => void;
}

export type ActivityFooterProps = OwnProps;

const ActivityFooter: React.FunctionComponent<ActivityFooterProps> = (props) => {
	const { deal, onActivitySaved } = props;
	const translator = useTranslator();

	return (
		<Container data-test="add-new-activity">
			<Option
				onClick={() => {
					addNewActivityModal({
						dealId: deal.id,
						personId: deal.person_id,
						orgId: deal.org_id,
						next: false,
						onsave: onActivitySaved,
					});
				}}
			>
				<Icon icon="plus" size="s" />
				{translator.gettext('Schedule an activity')}
			</Option>
		</Container>
	);
};

export default ActivityFooter;
