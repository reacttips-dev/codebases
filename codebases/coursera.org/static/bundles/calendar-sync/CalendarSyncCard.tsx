import React, { PureComponent } from 'react';

import classNames from 'classnames';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import onDemandTutorialViewsApi from 'bundles/ondemand/utils/onDemandTutorialViewsApi';
import TrackedButton from 'bundles/page/components/TrackedButton';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import { Box, StyleSheet, css, color, Card } from '@coursera/coursera-ui';
import { SvgClose } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/calendar-sync';
import { Typography } from '@coursera/cds-core';

import { isDegreeHomeV2Enabled } from 'bundles/degree-home/utils/experimentUtils';
import { isRightToLeft } from 'js/lib/language';
import connectToRouter from 'js/lib/connectToRouter';
import CalendarSyncCardButtonArea from './CalendarSyncCardButtonArea';
import CalendarSyncCardHeader from './CalendarSyncCardHeader';

import 'css!./__styl__/CalendarSyncCard';

type InputProps = {
  asBanner: boolean;
};

type RouterProps = {
  degreeSlug: string | undefined;
};

type Props = InputProps & RouterProps;

type State = {
  closed: boolean;
  animating: boolean;
};

const styles = StyleSheet.create({
  bannerCard: {
    boxShadow: 'none !important',
    border: `1px solid ${color.info}`,
  },

  bannerParagraph: {
    maxWidth: 'calc(100% - 24px)',
  },
});

class CalendarSyncCard extends PureComponent<Props, State> {
  static defaultProps = {
    asBanner: false,
  };

  state = {
    closed: true,
    animating: false,
  };

  constructor(props: Props) {
    super(props);

    const { asBanner } = this.props;
    const type = asBanner ? 'Banner' : 'Card';

    this.visibilityKey = `dismissedCalendarSyncNotification.${type}`;
  }

  componentDidMount() {
    onDemandTutorialViewsApi.hasKey(this.visibilityKey).then((closed: $TSFixMe) => {
      this.setState({ closed });
    });
  }

  closeCard = () => {
    this.setState({
      animating: true,
    });

    setTimeout(() => {
      this.setState({
        animating: false,
        closed: true,
      });
    }, 1000);

    onDemandTutorialViewsApi.storeKey(this.visibilityKey);
  };

  visibilityKey = 'dismissedCalendarSyncNotification';

  render() {
    const { asBanner, degreeSlug } = this.props;
    const { closed, animating } = this.state;

    const flexDirection = asBanner ? 'row-reverse' : 'row';
    const justifyContent = asBanner ? 'end' : 'between';
    const alignItems = asBanner ? 'start' : 'center';

    const wrapperStyle = {
      paddingBottom: asBanner ? 0 : '1.5rem',
    };

    const bannerStyle = {
      backgroundColor: color.bgInfo,
    };

    const title = _t('Don’t miss out on deadlines and events');
    const message = _t(
      'Add all your assignment deadlines and important dates to your calendar. You can also set it up later in Settings.'
    );

    const isRtl = isRightToLeft(_t.getLocale());

    return closed ? null : (
      <TrackedDiv
        trackingName="calendar_notification"
        trackClicks={false}
        requireFullyVisible={false}
        withVisibilityTracking={true}
        style={wrapperStyle}
        className={classNames('rc-CalendarSyncCardWrapper', { 'rc-CalendarSyncCardWrapperClosed': animating })}
        role="group"
      >
        <Card
          style={asBanner ? bannerStyle : {}}
          rootClassName={classNames('rc-CalendarSyncCard', css(asBanner && styles.bannerCard).className)}
        >
          <Box flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems}>
            <Box
              flex={1}
              justifyContent="start"
              alignItems="start"
              flexDirection="column"
              rootClassName={classNames('calendar-box', isRtl)}
            >
              <TrackedButton
                trackingName="button_close"
                className="rc-CalendarSyncCardClose nostyle"
                aria-label={_t('Close Add to Calendar Notification')}
              >
                <SvgClose onClick={this.closeCard} />
              </TrackedButton>
              <CalendarSyncCardHeader asBanner={asBanner}>{title}</CalendarSyncCardHeader>
              {isDegreeHomeV2Enabled(degreeSlug) ? (
                <Typography {...css(asBanner && styles.bannerParagraph)}>{message}</Typography>
              ) : (
                <p {...css(asBanner && styles.bannerParagraph)}>{message}</p>
              )}
              <CalendarSyncCardButtonArea closeCard={this.closeCard} asBanner={asBanner} />
            </Box>
          </Box>
        </Card>
      </TrackedDiv>
    );
  }
}

export default connectToRouter<Props, InputProps>(({ params }) => ({ degreeSlug: params.degreeSlug }))(
  CalendarSyncCard
);
