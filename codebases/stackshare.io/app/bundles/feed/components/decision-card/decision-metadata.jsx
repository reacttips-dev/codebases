import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, WHITE, CHARCOAL, CATHEDRAL, BLACK, SCORE} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {FEED_CLICK_CARD_COMPANY} from '../../constants/analytics';
import DecisionTagIcon from './icons/decision-tag-icon.svg';
import DecisionDraftIcon from '../../../../shared/library/icons/decision-draft-icon.svg';
import DefaultCompanyIcon from '../icons/default-company-icon.svg';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {HOVER} from '../../../../shared/style/breakpoints';
import {LIGHT, DARK} from '../../constants/utils';
import {ID} from '../../../../shared/utils/graphql';

const Container = glamorous.div(
  {
    ...BASE_TEXT,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    fontSize: 16
  },
  ({theme}) => ({
    color: theme === LIGHT ? CATHEDRAL : ASH
  })
);

const Preposition = glamorous.span({
  marginLeft: 8
});

export const Company = glamorous.a(
  {
    display: 'flex',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  ({theme}) => ({
    color: theme === LIGHT ? CATHEDRAL : ASH,
    [HOVER]: {
      ':hover': {
        ' > div': {
          color: theme === LIGHT ? CATHEDRAL : WHITE
        }
      }
    }
  })
);

const CompanyName = glamorous.div({}, ({theme}) => ({
  color: theme === LIGHT ? CATHEDRAL : ASH
}));

const CompanyLogo = glamorous.img({
  height: 20,
  width: 20,
  border: `solid 1px ${ASH}`,
  display: 'flex',
  margin: '0 8px 0 8px',
  backgroundColor: WHITE
});

const DefaultCompanyLogo = glamorous(DefaultCompanyIcon)({
  height: 20,
  width: 20,
  display: 'flex',
  margin: '0 8px 0 8px',
  '> g > path': {
    fill: CHARCOAL
  }
});

const StyledDecisionDraftIcon = glamorous(DecisionDraftIcon)({
  '> g > path': {
    fill: SCORE
  },
  '> g > rect': {
    stroke: SCORE
  }
});

const DecisionTagWrap = glamorous.div({}, ({theme}) => ({
  display: 'flex',
  '& svg': {
    '& path': {
      fill: theme === LIGHT ? BLACK : WHITE
    },
    ' & rect': {
      stroke: theme === LIGHT ? BLACK : WHITE
    }
  }
}));

export class DecisionMetadata extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    company: PropTypes.shape({
      id: ID,
      name: PropTypes.string,
      imageUrl: PropTypes.string,
      path: PropTypes.string
    }),
    theme: PropTypes.oneOf([LIGHT, DARK]),
    isDraft: PropTypes.bool
  };

  static defaultProps = {
    theme: DARK
  };

  render() {
    const {company, theme, isDraft} = this.props;
    return (
      <Container theme={theme}>
        <DecisionTagWrap theme={theme}>
          {isDraft ? <StyledDecisionDraftIcon /> : <DecisionTagIcon />}
        </DecisionTagWrap>
        {company !== null && (
          <React.Fragment>
            <Preposition>at</Preposition>
            <Company
              itemScope
              itemType="http://schema.org/Organization"
              itemProp="url"
              href={company.path}
              target="_blank"
              theme={theme}
              onClick={() =>
                this.props.sendAnalyticsEvent(FEED_CLICK_CARD_COMPANY, {
                  companyName: company.name,
                  companyId: company.id
                })
              }
            >
              {company.imageUrl !== null && (
                <CompanyLogo
                  itemProp="logo"
                  src={company.imageUrl}
                  alt={`Logo of ${company.name}`}
                />
              )}
              {company.imageUrl === null && <DefaultCompanyLogo />}
              <CompanyName itemProp="name" theme={theme}>
                {company.name}
              </CompanyName>
            </Company>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent
)(DecisionMetadata);
