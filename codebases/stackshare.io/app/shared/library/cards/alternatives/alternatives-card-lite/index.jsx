import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {flattenEdges} from '../../../../utils/graphql';
import {ASH, CHARCOAL, TARMAC, FOCUS_BLUE} from '../../../../style/colors';
import {PHONE} from '../../../../style/breakpoints';
import {WEIGHT, BASE_TEXT} from '../../../../../shared/style/typography';
import ServiceDetailsPopover from '../../../popovers/service-details/index.jsx';
import {PAGE_WIDTH} from '../../../../style/dimensions';

const border = (radius, border = `1px solid ${ASH}`) => {
  return {borderRadius: radius, border: border};
};

const Grid = glamorous.div(
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, auto))',
    width: '100%',
    gridGap: 15,
    margin: '0 auto',
    [PHONE]: {
      gridTemplateColumns: '1fr'
    }
  },
  ({isMobile}) => ({
    padding: isMobile ? '0 0 80px' : '0 15px 80px',
    maxWidth: isMobile ? 'auto' : PAGE_WIDTH
  })
);

const Card = glamorous.div({
  boxSizing: 'border-box',
  boxShadow: `0 1px 0 0 ${ASH}`,
  padding: 20,
  ...border(4)
});

const Wrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
});

const AltWrapper = glamorous(Wrapper)({
  justifyContent: 'space-between'
});

const Header = glamorous.div({}, ({isMobile}) => ({
  paddingBottom: isMobile ? 21 : 35
}));

const ToolIconBox = glamorous.div({
  width: 60,
  height: 60,
  padding: 5,
  overflow: 'hidden',
  ...border(5.3)
});

const Title = glamorous.h2({
  fontSize: 16,
  fontWeight: WEIGHT.BOLD,
  color: CHARCOAL,
  letterSpacing: 0.2,
  marginLeft: 10
});

const IconGrid = glamorous.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 42px)',
  gridGap: 10
});

const AlternateIconBox = glamorous.div({
  height: 42,
  overflow: 'hidden',
  ...border(5.3)
});

const Link = glamorous.a({
  textDecoration: 'none',
  color: TARMAC,
  ...BASE_TEXT,
  '&:hover h1': {
    color: FOCUS_BLUE
  }
});

const Icon = glamorous.img({
  width: '100%',
  height: '100%'
});

const AlternativeCards = ({topTools, isMobile}) => {
  const filteredServices = flattenEdges(topTools, []).filter(
    service => service.alternativeTools.edges.length > 0
  );
  return (
    <Grid isMobile={isMobile}>
      {filteredServices &&
        filteredServices.map(services => (
          <Card key={services.id}>
            <AlternativeCardLite services={services} isMobile={isMobile} />
          </Card>
        ))}
    </Grid>
  );
};

export const AlternativeCardLite = ({services, isMobile}) => {
  return (
    <Fragment>
      <Header isMobile={isMobile}>
        <Wrapper>
          <ToolIconBox>
            <Icon src={services.imageUrl} alt={`${services.name} icon`} />
          </ToolIconBox>
          <Link href={`/${services.slug}/alternatives`}>
            <Title>{`${services.name} alternatives`}</Title>
          </Link>
        </Wrapper>
      </Header>
      <AltWrapper>
        <IconGrid>
          {flattenEdges(services.alternativeTools, []).map(service => (
            <ServiceDetailsPopover key={service.id} service={service} showFollow={false}>
              <AlternateIconBox>
                <Link href={service.slug}>
                  <Icon src={service.imageUrl} alt={`${service.name} icon`} />
                </Link>
              </AlternateIconBox>
            </ServiceDetailsPopover>
          ))}
        </IconGrid>
        <Link href={`/${services.slug}/alternatives`}>See All</Link>
      </AltWrapper>
    </Fragment>
  );
};

AlternativeCards.propTypes = {
  topTools: PropTypes.object,
  isMobile: PropTypes.bool
};

AlternativeCardLite.propTypes = {
  services: PropTypes.object,
  isMobile: PropTypes.bool
};

export default AlternativeCards;
