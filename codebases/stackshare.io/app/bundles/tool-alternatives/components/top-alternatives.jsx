import React, {useState} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {Query} from 'react-apollo';
import {alternativeTools} from '../../../data/tool-alternatives/queries';
import Circular, {LARGE} from '../../../shared/library/indicators/indeterminate/circular';
import {flattenEdges} from '../../../shared/utils/graphql';
import ItemList from '../../../shared/library/cards/item-list';
import {Spinner} from '../containers/tool-alternatives';
import {SILVER_ALUMINIUM} from '../../../shared/style/colors';
import SmallTitle from '../../../shared/library/typography/small-title';
import SignUp from '../../../shared/library/buttons/sign-up';
import {Center} from './alternatives';
import LoadMoreButton from '../../../shared/library/buttons/load-more';

const StyledSmallTitle = glamorous(SmallTitle)({
  textTransform: 'uppercase',
  color: SILVER_ALUMINIUM,
  marginBottom: 10
}).withComponent('h2');

const TopToolWrapper = glamorous.div({
  margin: '25px 0'
});

const ShowMoreContainer = glamorous.div({
  marginTop: 30,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1
});

const ItemListContainer = glamorous.div({
  '>ul>li': {
    width: '50%',
    marginBottom: 30,
    paddingRight: 30
  }
});

const TopAlternatives = ({tool, enableSignup}) => {
  return (
    <TopToolWrapper>
      <Query
        query={alternativeTools}
        variables={{id: tool.id, first: enableSignup ? 8 : 18}}
        notifyOnNetworkStatusChange={true}
      >
        {({loading, data}) => {
          const hasData = data && data.tool;
          if (loading && !hasData)
            return (
              <Spinner>
                <Circular size={LARGE} />
              </Spinner>
            );

          if (hasData) {
            const alternativeTools = flattenEdges(data.tool.alternativeTools);

            const alternativeToolsData =
              alternativeTools &&
              alternativeTools.map(company => {
                return {
                  name: company.name,
                  desc: company.description,
                  imageUrl: company.imageUrl,
                  thumbUrl: company.thumbRetinaUrl,
                  slug: `/${company.slug}`,
                  path: company.path,
                  id: company.id
                };
              });

            return (
              <>
                <StyledSmallTitle>Top Alternatives to {tool.name}</StyledSmallTitle>
                <AlternativesWithPagination
                  alternativeToolsData={alternativeToolsData}
                  loading={loading}
                />
              </>
            );
          }
        }}
      </Query>
      {enableSignup && (
        <Center>
          <SignUp text="Sign up to see more" />
        </Center>
      )}
    </TopToolWrapper>
  );
};

const alternativeToLoadOnLoadMore = 8;

const AlternativesWithPagination = ({alternativeToolsData, loading}) => {
  const [alternativesToShow, setalternativesToShow] = useState(alternativeToLoadOnLoadMore);
  const count = alternativeToolsData && alternativeToolsData.length;

  const showMorealternatives = () =>
    setalternativesToShow(
      alternativesToShow > count ? count : alternativesToShow + alternativeToLoadOnLoadMore
    );

  return (
    <ItemListContainer>
      <ItemList
        item={alternativeToolsData && alternativeToolsData.slice(0, alternativesToShow)}
        iconsWithDesc={true}
        loading={loading}
        notFoundItem="Alternatives"
      />
      <ShowMoreContainer>
        {alternativesToShow < count && <LoadMoreButton onClick={showMorealternatives} />}
      </ShowMoreContainer>
    </ItemListContainer>
  );
};

AlternativesWithPagination.propTypes = {
  alternativeToolsData: PropTypes.array,
  loading: PropTypes.bool
};

TopAlternatives.propTypes = {
  tool: PropTypes.object,
  enableSignup: PropTypes.bool
};

export default TopAlternatives;
