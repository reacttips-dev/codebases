import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Popover, {
  ARROW_TOP,
  LAYOUT_STYLE_FIT
} from '../../../../shared/library/popovers/base/popover';
import SectionTitle from '../../../../shared/library/typography/section-title';
import ScrollPanel from '../../../../shared/library/panels/scroll';
import {ARROW_HEIGHT} from '../../../../shared/library/popovers/base/arrow';
import Decision from './decision';
import {ASH} from '../../../../shared/style/colors';
import {withQuery} from '../../../../shared/enhancers/graphql-enhancer';
import {popularDecisionsQuery} from '../../../../data/feed/queries';
import {flattenEdges} from '../../../../shared/utils/graphql';

const Container = glamorous.div({
  display: 'flex',
  position: 'relative',
  width: '100%',
  boxSizing: 'content-box',
  paddingTop: ARROW_HEIGHT + 5,
  zIndex: 1
});

const Content = glamorous.div({
  padding: 20
});

const DecisionList = glamorous.div({
  paddingRight: 5,
  '>*': {
    borderBottom: `1px solid ${ASH}`,
    marginTop: 10,
    marginBottom: 20,
    paddingBottom: 20
  },
  '>:last-child': {
    borderBottom: 0,
    paddingBottom: 0,
    marginBottom: 0
  }
});

class PopularDecisions extends Component {
  static propTypes = {
    decisions: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    return (
      <Container innerRef={this.assignContainer}>
        <Popover
          position={{top: 0, left: 0}}
          arrowSide={ARROW_TOP}
          layoutStyle={LAYOUT_STYLE_FIT}
          arrowOffset={70}
          inline={true}
        >
          <Content>
            <SectionTitle>Popular Decisions</SectionTitle>
            <ScrollPanel height={200}>
              <DecisionList>
                {this.props.decisions.map(d => (
                  <Decision key={d.id} {...d} />
                ))}
              </DecisionList>
            </ScrollPanel>
          </Content>
        </Popover>
      </Container>
    );
  }
}

export default withQuery(popularDecisionsQuery, data => ({
  decisions: flattenEdges(data.stackDecisions, [])
}))(PopularDecisions);
