import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {truncate} from '../../../../shared/utils/lodash-functions';
import glamorous from 'glamorous';
import {grid} from '../../../utils/grid';
import {toolsPresenter} from '../../../utils/presenters';
import Services from '../../services';
import Button from '../../buttons/base/link';
import CircularButton, {REMOVE} from '../../buttons/circular';
import Circular, {LARGE} from '../../indicators/indeterminate/circular';
import Title from '../../typography/title';
import BigTitle from '../../typography/big-title';
import Text from '../../typography/text';
import {ASH, BLACK, WHITE} from '../../../style/colors';
import LocationIcon from '../../icons/location-icon.svg';
import {withSendAnalyticsEvent, withAnalyticsPayload} from '../../../enhancers/analytics-enhancer';
import {ID} from '../../../utils/graphql';
import {MEDIUM} from '../../../../shared/style/breakpoints';
import {FONT_FAMILY} from '../../../style/typography';
import {formatDate} from '../../../utils/format';
import LazyLoadImage from '../../../utils/lazy-loading-images';

const MAX_CHARS_DESCRIPTION = 180;
const MAX_CHARS_TITLE = 60;
const MAX_CHARS_AUTHOR = 40;

const Container = glamorous.div(
  {
    position: 'relative',
    boxSizing: 'border-box',
    padding: grid(3),
    border: `1px solid ${ASH}`,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    background: WHITE
  },
  ({header, embedHeader, tallHeader, fullImage}) => ({
    paddingTop: header || embedHeader ? 0 : grid(3),
    height:
      embedHeader || tallHeader ? grid(53) : header ? (fullImage ? grid(52) : grid(44)) : grid(34),
    [MEDIUM]: {
      height: grid(36)
    }
  })
);

const RemoveButton = glamorous.div({
  position: 'absolute',
  top: -18,
  right: -18
});

const TitleContainer = glamorous.div(
  ({orderChange}) => ({
    fontSize: orderChange && 19,
    ' a': {
      minHeight: orderChange && 64
    }
  }),
  {
    display: 'flex',
    alignItems: 'center'
  }
);

const Logo = glamorous.img({
  width: 45,
  height: 45,
  marginRight: 10
});

const Status = glamorous.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingTop: grid(4)
});

const Content = glamorous.div(
  ({fullImage}) => ({
    maxHeight: fullImage ? 500 : 400,
    [MEDIUM]: {
      maxHeight: fullImage ? 280 : 180
    }
  }),
  {
    flex: 1, // stretch to full height available, so footer is at bottom
    overflowY: 'hidden'
  }
);

const Date = glamorous.div({
  fontSize: 11,
  fontFamily: FONT_FAMILY,
  letterSpacing: '0.3px',
  color: '#a1a1a1'
});

const TitleSmall = glamorous(BigTitle)({
  lineHeight: 1.3
});

const Header = glamorous.a(
  ({header, tallHeader, fullImage, postLogo}) => ({
    backgroundImage: header ? `url(${header})` : 'none',
    height: tallHeader ? grid(27) : fullImage ? grid(19) : grid(16),
    backgroundPosition: fullImage && 'center',
    marginLeft: !fullImage && -grid(3),
    marginRight: !fullImage && -grid(3),
    marginTop: fullImage && grid(2),
    marginBottom: !postLogo && grid(2)
  }),
  {
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }
);

const Overlay = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(rgba(1, 1, 1, 0.5), transparent)',
  '> svg': {
    width: 44,
    height: 31,
    '> g > path': {
      opacity: 0.7,
      ':first-child': {
        fill: BLACK
      }
    }
  }
});

const Embed = glamorous.div({
  marginLeft: -grid(3),
  marginRight: -grid(3),
  marginBottom: grid(2),
  height: grid(25),
  display: 'block',
  '& iframe': {
    width: '100%',
    height: grid(25)
  },
  '& iframe + *': {
    display: 'none'
  }
});

const Location = glamorous.div({
  marginBottom: grid(3),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: grid(1)
  },
  '& span': {
    fontSize: 15
  }
});

const Footer = glamorous.div(
  {
    display: 'flex',
    paddingTop: grid(2),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ({button}) => ({
    borderTop: button ? 'none' : `1px solid ${ASH}`
  })
);

const PostLogo = glamorous.img({
  width: 30,
  height: 30,
  borderRadius: 2,
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.26)',
  marginRight: 10
});

const PostLogoContainer = glamorous.div({
  margin: '10px 0 10px 0',
  display: 'flex',
  alignItems: 'center',
  fontSize: 11,
  fontFamily: FONT_FAMILY,
  letterSpacing: '0.3px',

  ' p': {
    margin: 0,
    fontWeight: 600
  }
});

export class ContentCard extends Component {
  static propTypes = {
    id: ID,
    header: PropTypes.string,
    overlay: PropTypes.element,
    tallHeader: PropTypes.bool,
    embedHeader: PropTypes.string,
    url: PropTypes.string,
    publishedAt: PropTypes.string,
    title: PropTypes.string,
    bigTitle: PropTypes.bool,
    author: PropTypes.string,
    text: PropTypes.string,
    location: PropTypes.string,
    button: PropTypes.string,
    services: PropTypes.array,
    infoComponent: PropTypes.element,
    removeMode: PropTypes.bool,
    onDestroy: PropTypes.func,
    approve: PropTypes.func,
    processing: PropTypes.bool,
    onRemoveClick: PropTypes.func,
    sendAnalyticsEvent: PropTypes.func.isRequired,
    clickContentEvent: PropTypes.string,
    hoverPopoverServiceEvent: PropTypes.string,
    clickPopoverServiceEvent: PropTypes.string,
    clickContentParams: PropTypes.object,
    companyName: PropTypes.string,
    companyLogo: PropTypes.string,
    postLogo: PropTypes.string,
    fullImage: PropTypes.bool,
    orderChange: PropTypes.bool
  };

  static defaultProps = {
    services: [],
    processing: false,
    approve: () => {},
    clickContentEvent: null,
    hoverPopoverServiceEvent: null,
    clickPopoverServiceEvent: null,
    clickContentParams: {},
    fullImage: false,
    orderChange: false
  };

  state = {
    removing: false,
    error: false
  };

  handleContentClick = (url, services) => {
    const {sendAnalyticsEvent, clickContentEvent, clickContentParams} = this.props;
    sendAnalyticsEvent(clickContentEvent, {
      url,
      ...toolsPresenter('tools', services),
      ...clickContentParams
    });
  };

  handleRemoveClick = async () => {
    const {onDestroy, id, approve, onRemoveClick} = this.props;

    if (approve('Are you sure?')) {
      this.setState({removing: true});

      try {
        await onDestroy(id);
        this.setState({removing: false});
      } catch (err) {
        this.setState({removing: false, error: true});
      }
      onRemoveClick(id);
    }
  };

  handleServicePopover = (serviceId, serviceName, path) => {
    const {sendAnalyticsEvent, hoverPopoverServiceEvent} = this.props;
    sendAnalyticsEvent(hoverPopoverServiceEvent, {
      serviceId,
      serviceName,
      path
    });
  };

  handleServicePopoverClick = (serviceId, serviceName, path) => {
    const {sendAnalyticsEvent, clickPopoverServiceEvent} = this.props;
    sendAnalyticsEvent(clickPopoverServiceEvent, {
      serviceId,
      serviceName,
      path
    });
  };

  render() {
    const {
      header,
      overlay,
      tallHeader,
      embedHeader,
      url,
      title,
      bigTitle,
      author,
      text,
      location,
      button,
      services,
      infoComponent,
      removeMode,
      processing,
      publishedAt,
      companyName,
      companyLogo,
      postLogo,
      fullImage,
      orderChange
    } = this.props;
    const {removing} = this.state;
    const TitleComponent = bigTitle ? BigTitle : companyLogo ? TitleSmall : Title;
    if (processing) {
      return (
        <Container>
          <Status>
            <Circular size={LARGE} />
            <Text>Updating...</Text>
          </Status>
        </Container>
      );
    }

    return (
      <Container
        header={header}
        embedHeader={embedHeader}
        tallHeader={tallHeader}
        fullImage={fullImage}
      >
        {removeMode && (
          <RemoveButton>
            <CircularButton onClick={this.handleRemoveClick} type={REMOVE} processing={removing} />
          </RemoveButton>
        )}
        {header && (
          <Header
            href={url}
            header={header}
            tallHeader={tallHeader}
            fullImage={fullImage}
            postLogo={postLogo}
            onClick={() => this.handleContentClick(url, services)}
          >
            {overlay ? <Overlay>{overlay}</Overlay> : null}
          </Header>
        )}

        {embedHeader && <Embed dangerouslySetInnerHTML={{__html: embedHeader}} />}
        <Content fullImage={fullImage}>
          {!orderChange && publishedAt && <Date>{formatDate('ll [at] h:mmA', publishedAt)}</Date>}
          {title && (
            <TitleComponent>
              <TitleContainer orderChange={orderChange}>
                {companyLogo && (
                  <div>
                    <Logo src={companyLogo} alt={`${companyName} logo`} />
                  </div>
                )}
                <a
                  href={url}
                  dangerouslySetInnerHTML={{
                    __html: truncate(title, orderChange ? 65 : MAX_CHARS_TITLE)
                  }}
                  onClick={() => this.handleContentClick(url, services)}
                />
              </TitleContainer>
            </TitleComponent>
          )}
          {orderChange && publishedAt && <Date>{formatDate('ll [at] h:mmA', publishedAt)}</Date>}
          {postLogo && (
            <PostLogoContainer>
              <LazyLoadImage>
                <PostLogo src={postLogo} alt={`${postLogo} logo`} height={30} width={30} />
              </LazyLoadImage>
              {companyName && <p>{companyName}</p>}
            </PostLogoContainer>
          )}

          {author && (
            <Text>
              by{' '}
              <span
                dangerouslySetInnerHTML={{__html: truncate(author, {length: MAX_CHARS_AUTHOR})}}
              />
            </Text>
          )}
          {text && (
            <Text
              dangerouslySetInnerHTML={{__html: truncate(text, {length: MAX_CHARS_DESCRIPTION})}}
            />
          )}
        </Content>
        {location && (
          <Location>
            <LocationIcon />{' '}
            <Text>
              {companyName ? `${companyName} ,` : ''} {location}
            </Text>
          </Location>
        )}
        {button && (
          <Button href={url} onClick={() => this.handleContentClick(url, services)}>
            {button}
          </Button>
        )}
        {(services.length || infoComponent) && (
          <Footer button={button}>
            <Services
              services={services}
              onActivate={this.handleServicePopover}
              onClick={this.handleServicePopoverClick}
            />
            {infoComponent}
          </Footer>
        )}
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload(),
  withSendAnalyticsEvent
)(ContentCard);
