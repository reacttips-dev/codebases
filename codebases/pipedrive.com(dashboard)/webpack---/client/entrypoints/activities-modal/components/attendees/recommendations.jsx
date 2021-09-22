import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Option, Icon } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';
import { getRecommendationKey } from './helpers';

const RecommendationsTitle = styled.div`
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	padding: 4px 16px;
`;
const RecommendationIcon = styled(Icon)`
	margin: 4px 10px 0 0;
`;
const RecommendationContent = styled.div`
	overflow: hidden;
`;
const RecommendationName = styled.div`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
const RecommendationReason = styled.div`
	font-size: 13px;
	color: #747678;
`;
const RecommendationOption = styled(Option)`
	display: flex;
	align-items: flex-start;

	&.cui4-option--highlighted {
		${RecommendationReason} {
			color: #fff;
		}
	}
`;

const Recommendation = ({ recommendation, itemProps, isHighlighted }) => {
	const { name, email_address: emailAddress, reason } = recommendation;

	return (
		<RecommendationOption {...itemProps} highlighted={isHighlighted}>
			<RecommendationIcon icon="person" size="s" />
			<RecommendationContent>
				<RecommendationName>
					{name} ({emailAddress})
				</RecommendationName>
				<RecommendationReason>{reason}</RecommendationReason>
			</RecommendationContent>
		</RecommendationOption>
	);
};

Recommendation.propTypes = {
	recommendation: PropTypes.object.isRequired,
	itemProps: PropTypes.object.isRequired,
	isHighlighted: PropTypes.bool,
};

const Recommendations = ({ recommendations, getItemProps, highlightedIndex, translator }) => {
	return (
		<>
			<RecommendationsTitle>{translator.gettext('Recommended guests')}</RecommendationsTitle>
			{recommendations.map((rec, index) => {
				const recommendationKey = getRecommendationKey(rec);

				return (
					<Recommendation
						key={recommendationKey}
						recommendation={rec}
						itemProps={getItemProps({ key: recommendationKey, index, item: rec })}
						isHighlighted={highlightedIndex === index}
					/>
				);
			})}
		</>
	);
};

Recommendations.propTypes = {
	recommendations: PropTypes.array.isRequired,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
	translator: PropTypes.object.isRequired,
};

export default modalContext(Recommendations);
