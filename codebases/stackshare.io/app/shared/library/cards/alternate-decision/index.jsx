import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import AlternateDecisionCard from './alternate-decision-card';
import glamorous from 'glamorous';
import {Link} from '../card';

const LinkWrapper = glamorous.div({
  marginTop: 20
});

const AlternateDecisions = ({decisions, allDecisionsLink, sendAnalyticsEvent}) => {
  if (decisions) {
    return (
      <Fragment>
        {decisions.map((d, index) => (
          <AlternateDecisionCard
            key={d.id}
            {...d}
            position={index + 1}
            sendAnalyticsEvent={sendAnalyticsEvent}
            publicId={d.publicId}
            user={d.user}
            publishedAt={d.publishedAt}
            upvotesCount={d.upvotesCount}
            viewCount={d.viewCount}
            htmlContent={d.htmlContent}
            services={d.services}
            topics={d.topics}
            company={d.company}
            link={d.link}
          />
        ))}
        {decisions.length !== 0 && allDecisionsLink && (
          <LinkWrapper>
            <Link href={allDecisionsLink}>See all decisions</Link>
          </LinkWrapper>
        )}
      </Fragment>
    );
  }
  return null;
};

AlternateDecisions.propTypes = {
  decisions: PropTypes.arrayOf(PropTypes.object),
  allDecisionsLink: PropTypes.string,
  sendAnalyticsEvent: PropTypes.any
};

export default AlternateDecisions;
