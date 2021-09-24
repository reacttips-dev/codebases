import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {Query} from 'react-apollo';
import {alternativeTools} from '../../../data/tool-alternatives/queries';
import {Spinner} from '../containers/tool-alternatives';
import Circular, {LARGE} from '../../../shared/library/indicators/indeterminate/circular';
import {flattenEdges} from '../../../shared/utils/graphql';
import {PHONE, TABLET} from '../../../shared/style/breakpoints';
import LoadMoreButton from '../../../shared/library/buttons/load-more';
import {updateQuery} from '../../../data/shared/updateToolQuery';
import ToolAlternativesSection from './alternatives-section';
import {TITLE_TEXT} from '../../../shared/style/typography';
import {CHARCOAL} from '../../../shared/style/colors';
import {flexBox, INITIAL, COLUMN, CENTER} from '../styles';
import SignUp from '../../../shared/library/buttons/sign-up';
import {withMutation} from '../../../shared/enhancers/graphql-enhancer';
import {trackViews} from '../../../data/shared/mutations';
import {callTrackViews} from '../../../../app/shared/utils/trackViews.js';

const Container = glamorous.div({
  width: '100%',
  [PHONE]: {
    ...flexBox(INITIAL, COLUMN, CENTER)
  }
});

const Wrapper = glamorous.div({
  width: '100%',
  paddingBottom: 80,
  [PHONE]: {
    ...flexBox(INITIAL, COLUMN, CENTER)
  }
});

const Title = glamorous.h3({
  ...TITLE_TEXT,
  fontSize: 18,
  color: CHARCOAL,
  [TABLET]: {
    alignSelf: 'flex-start',
    marginBottom: 25
  }
});

export const Center = glamorous.div({
  marginTop: 20,
  ...flexBox(CENTER)
});

const Alternatives = ({
  id,
  name,
  slug,
  thumbRetinaUrl,
  enableSignup,
  showJobs,
  privateMode,
  trackViews
}) => {
  return (
    <Container>
      <Query query={alternativeTools} variables={{id, first: enableSignup ? 8 : 20}}>
        {({loading, data, fetchMore}) => {
          const hasData = data && data.tool;
          if (loading && !hasData) {
            return (
              <Spinner>
                <Circular size={LARGE} />
              </Spinner>
            );
          }

          if (hasData) {
            const alternativeTools = flattenEdges(data.tool.alternativeTools);
            const endCursor = data.tool.alternativeTools.pageInfo.endCursor;
            const hasNextPage = data.tool.alternativeTools.pageInfo.hasNextPage;
            const decisionIds = [];
            alternativeTools.map(tool =>
              decisionIds.push(...flattenEdges(tool.stackDecisionsWithAlternatives).map(i => i.id))
            );

            return (
              <AlternativesComponent
                name={name}
                alternativeTools={alternativeTools}
                privateMode={privateMode}
                thumbRetinaUrl={thumbRetinaUrl}
                slug={slug}
                showJobs={showJobs}
                hasNextPage={hasNextPage}
                enableSignup={enableSignup}
                loading={loading}
                fetchMore={fetchMore}
                endCursor={endCursor}
                decisionIds={decisionIds}
                trackViews={trackViews}
              />
            );
          }
        }}
      </Query>
    </Container>
  );
};

Alternatives.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  slug: PropTypes.string,
  thumbRetinaUrl: PropTypes.string,
  enableSignup: PropTypes.bool,
  privateMode: PropTypes.bool,
  showJobs: PropTypes.bool,
  trackViews: PropTypes.func
};

const AlternativesComponent = ({
  name,
  alternativeTools,
  privateMode,
  thumbRetinaUrl,
  slug,
  showJobs,
  hasNextPage,
  enableSignup,
  loading,
  fetchMore,
  endCursor,
  decisionIds,
  trackViews
}) => {
  useEffect(() => {
    if (!loading && decisionIds) {
      callTrackViews({
        trackViews,
        decisionIds,
        clientContext: `ToolAlternatives-${window.location.pathname}`
      });
    }
  }, [decisionIds]);

  return (
    <Wrapper>
      <Title>{`${name} alternatives & related posts`}</Title>
      {alternativeTools &&
        alternativeTools.map(tool => (
          <ToolAlternativesSection
            privateMode={privateMode}
            key={tool.id}
            stackupName={name}
            stackupLogo={thumbRetinaUrl}
            stackupSlug={slug}
            showJobs={showJobs}
            tool={tool}
            {...tool}
          />
        ))}
      {hasNextPage && !enableSignup && (
        <Center>
          <LoadMoreButton
            loading={loading}
            onClick={() => {
              fetchMore({
                variables: {
                  after: endCursor
                },
                updateQuery
              });
            }}
          />
        </Center>
      )}
      {enableSignup && (
        <Center>
          <SignUp text="Sign up to see more" />
        </Center>
      )}
    </Wrapper>
  );
};

AlternativesComponent.propTypes = {
  name: PropTypes.string,
  alternativeTools: PropTypes.array,
  decisionIds: PropTypes.array,
  privateMode: PropTypes.bool,
  thumbRetinaUrl: PropTypes.string,
  slug: PropTypes.string,
  showJobs: PropTypes.bool,
  hasNextPage: PropTypes.string,
  enableSignup: PropTypes.bool,
  loading: PropTypes.bool,
  fetchMore: PropTypes.func,
  endCursor: PropTypes.string,
  trackViews: PropTypes.func
};

export default withMutation(trackViews, mutate => ({
  trackViews: (decisionIds, clientContext) => mutate({variables: {decisionIds, clientContext}})
}))(Alternatives);
