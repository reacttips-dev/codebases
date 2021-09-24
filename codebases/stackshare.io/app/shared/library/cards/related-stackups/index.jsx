import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {SectionHeading, SectionPlaceholder} from '../card';
import Stackup from '../stackup';
import {ASH} from '../../../style/colors';
import {Link} from '../../../../shared/library/cards/card';
import {Grid, StackupsLinks} from '../../../../bundles/stackups/components/shared/styles';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});
const StackupsCards = glamorous(Grid)({
  textDecoration: 'none',
  ' > a': {
    border: `1px solid ${ASH}`,
    borderRadius: 3,
    margin: 0
  }
});

const StyledSectionHeading = glamorous(SectionHeading)({
  marginBottom: 25
});

const RelatedStackups = ({items, tools, ctaText, disableHeading, disableCta}) => {
  return (
    <Container>
      {!disableHeading && <StyledSectionHeading>Related Comparisons</StyledSectionHeading>}
      {items.length > 0 && (
        <StackupsCards>
          {items.map(({id, services, path}) => (
            <Stackup key={id} services={services} path={path} />
          ))}
        </StackupsCards>
      )}
      <StackupsLinks>
        {!disableCta &&
          tools &&
          tools.map(({name, relatedStackups, path}, index) => (
            <Fragment key={index}>
              {relatedStackups && relatedStackups.count > 0 && (
                <Link data-testid="popularToolComparisonLink" href={`${path}/stackups`}>
                  {ctaText ? ctaText : `Popular tool comparisons with ${name}`}
                </Link>
              )}
            </Fragment>
          ))}
      </StackupsLinks>
      {items.length === 0 && <SectionPlaceholder>No related comparisons found</SectionPlaceholder>}
    </Container>
  );
};

RelatedStackups.propTypes = {
  items: PropTypes.array,
  tools: PropTypes.array,
  ctaText: PropTypes.string,
  disableHeading: PropTypes.bool,
  disableCta: PropTypes.bool
};

export default RelatedStackups;
