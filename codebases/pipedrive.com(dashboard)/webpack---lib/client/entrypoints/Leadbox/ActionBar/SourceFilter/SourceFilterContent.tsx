import { Separator, Option } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { SourceLabel } from 'Components/SourceLabel/SourceLabel';
import React from 'react';
import { NoResults } from 'Components/NoResults/NoResults';
import { createFragmentContainer, graphql } from '@pipedrive/relay';

import { FilterInput } from './FilterInput';
import * as S from './SourceFilterContent.styles';
import { useSourceFilter } from './useSourceFilter';
import { SourceFilterContent_data } from './__generated__/SourceFilterContent_data.graphql';

interface Props {
	readonly data: SourceFilterContent_data | null;
}

export const SourceFilterContentWithoutData: React.FC<Props> = ({ data }) => {
	const translator = useTranslator();

	const { sources, selectedSourceIDs, visibleSources, setSearchValue, toggleSourceSelected } = useSourceFilter(data);

	return (
		<S.OptionsWrapper>
			{sources && sources?.length > 4 && <FilterInput setSearchValue={setSearchValue} />}
			<Separator />
			{visibleSources && visibleSources?.length > 0 ? (
				<>
					<Option
						key="allSources"
						onClick={() => toggleSourceSelected(null)}
						selected={selectedSourceIDs.length === 0}
					>
						{translator.gettext('All sources')}
					</Option>

					<div>
						<Separator />
					</div>
				</>
			) : (
				<NoResults />
			)}

			<div data-testid="SourceFilterOptions">
				{visibleSources?.map((source) => {
					if (source === null) {
						return null;
					}

					return (
						<Option
							key={source.id}
							onClick={() => toggleSourceSelected(source.id)}
							selected={selectedSourceIDs.includes(source.id)}
						>
							<SourceLabel source={source} />
						</Option>
					);
				})}
			</div>
		</S.OptionsWrapper>
	);
};

export const SourceFilterContent = createFragmentContainer(SourceFilterContentWithoutData, {
	data: graphql`
		fragment SourceFilterContent_data on RootQuery {
			...useSourceFilter_data
		}
	`,
});
