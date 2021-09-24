import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, WHITE} from '../../../shared/style/colors';
import ProsConsCard, {PROS, CONS, SLIM} from '../../../shared/library/cards/pros-cons';
import ToolDecisions from './tool-decisions';
import {border, flexBox, INITIAL, COLUMN, CENTER} from '../styles';
import {MEDIUM, PHONE, TABLET} from '../../../shared/style/breakpoints';
import ToolAlternativesCard from '../../../shared/library/cards/tool-alternatives';
import StackupCardLite from '../../../shared/library/cards/stackup/stackup-card-lite';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import {BASE_TEXT} from '../../../shared/style/typography';
import {flattenEdges} from '../../../shared/utils/graphql';

const Section = glamorous.div({
  width: '100%',
  padding: '25px 0',
  marginBottom: 20,
  background: WHITE,
  ...border(4, `0 1px 0 0 ${ASH}`),
  ...flexBox(INITIAL, COLUMN, CENTER),
  [PHONE]: {
    border: 'solid 1px #e1e1e1',
    borderRadius: 4,
    boxShadow: 'none',
    marginBottom: 20,
    padding: 10,
    paddingTop: 35
  }
});

const Container = glamorous.div({
  width: '100%',
  ...flexBox(INITIAL, COLUMN)
});

const Dets = glamorous.div({
  width: '100%',
  padding: 5,
  minHeight: 240,
  [MEDIUM]: {
    borderRight: 'none'
  },
  [TABLET]: {
    border: 0,
    marginTop: 30,
    width: 'auto'
  },
  [PHONE]: {
    padding: 0
  }
});

const Title = glamorous.div({
  height: 42,
  borderRadius: 4,
  backgroundColor: '#f8f8f8',
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.08,
  letterSpacing: 0.66,
  color: '#707070',
  paddingLeft: 20,
  marginBottom: 15,
  display: 'flex',
  alignItems: 'center'
});

const Details = glamorous.div({
  ...BASE_TEXT,
  display: 'grid',
  gridTemplateColumns: '33% 33% 33%',
  marginTop: 28,
  marginRight: 20,
  marginLeft: 20,
  [PHONE]: {
    display: 'block',
    margin: 0
  }
});

const Content = glamorous.div({
  marginLeft: 15,
  [PHONE]: {
    marginLeft: 0
  }
});

const ToolAlternativesSection = ({
  id,
  name,
  slug,
  stackupName,
  stackupLogo,
  stackupSlug,
  privateMode,
  showJobs = true,
  tool
}) => {
  const currentUser = useContext(CurrentUserContext);
  const decisions = flattenEdges(tool.stackDecisionsWithAlternatives);

  return (
    <Section>
      <Container>
        <ToolAlternativesCard privateMode={privateMode} {...tool} currentUser={currentUser} />

        <Details>
          <Dets>
            <Title>PROS OF {tool.name.toUpperCase()}</Title>
            <Content>
              <ProsConsCard
                type={PROS}
                slug={slug}
                name={name}
                items={tool[PROS]}
                theme={SLIM}
                privateMode={privateMode}
                currentUser={currentUser}
              />
            </Content>
          </Dets>

          <Dets>
            <Title>CONS OF {tool.name.toUpperCase()}</Title>
            <Content>
              <ProsConsCard
                type={CONS}
                slug={slug}
                name={name}
                items={tool[CONS]}
                theme={SLIM}
                privateMode={privateMode}
                currentUser={currentUser}
              />
            </Content>
          </Dets>

          <Dets>
            <Title>COMPARE</Title>
            <Content>
              <StackupCardLite
                stackupName={stackupName}
                stackupLogo={stackupLogo}
                stackupSlug={stackupSlug}
                {...tool}
                showJobs={showJobs}
              />
            </Content>
          </Dets>
        </Details>
      </Container>
      <ToolDecisions id={id} name={name} decisions={decisions} />
    </Section>
  );
};

ToolAlternativesSection.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  slug: PropTypes.string,
  stackupName: PropTypes.string,
  stackupLogo: PropTypes.string,
  stackupSlug: PropTypes.string,
  thumbRetinaUrl: PropTypes.string,
  showJobs: PropTypes.bool,
  privateMode: PropTypes.bool,
  tool: PropTypes.object
};

export default ToolAlternativesSection;
