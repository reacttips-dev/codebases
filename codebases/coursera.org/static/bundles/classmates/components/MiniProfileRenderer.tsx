import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import MiniProfile from 'bundles/classmates/components/MiniProfile';

class MiniProfileRenderer extends React.Component {
  static propTypes = {
    externalId: PropTypes.string.isRequired,
    courseRole: PropTypes.string,
    source: PropTypes.string.isRequired,
    toolTipId: PropTypes.string,
  };

  static MAX_HEIGHT = 200;

  static MIN_HOVER_TIME = 500;

  state = { showMiniProfile: false };

  componentWillUnmount() {
    if (this.displayTimeout) {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      clearTimeout(this.displayTimeout);
    }
  }

  displayTimeout = null;

  isDisplayMethodLocked = false;

  display = (event: $TSFixMe) => {
    if (this.isDisplayMethodLocked) return;
    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    const hasEnoughRoom = $(window).height() - (event.pageY - $(window).scrollTop()) > MiniProfileRenderer.MAX_HEIGHT;

    this.isDisplayMethodLocked = true;

    // @ts-expect-error ts-migrate(2322) FIXME: Type 'Timeout' is not assignable to type 'null'.
    this.displayTimeout = setTimeout(() => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'source' does not exist on type 'Readonly... Remove this comment to see the full error message
      const className = this.props.source + (hasEnoughRoom ? 'South' : 'North');
      this.setState({ showMiniProfile: true, className });
    }, MiniProfileRenderer.MIN_HOVER_TIME);
  };

  hide = (event: $TSFixMe) => {
    if (this.displayTimeout) {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      clearTimeout(this.displayTimeout);
    }

    this.isDisplayMethodLocked = false;
    this.setState({ showMiniProfile: false });
  };

  render() {
    return (
      this.state.showMiniProfile && (
        <MiniProfile
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'externalId' does not exist on type 'Read... Remove this comment to see the full error message
          externalId={this.props.externalId}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseRole' does not exist on type 'Read... Remove this comment to see the full error message
          courseRole={this.props.courseRole}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'className' does not exist on type '{ sho... Remove this comment to see the full error message
          orientationClass={this.state.className}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'toolTipId' does not exist on type 'Reado... Remove this comment to see the full error message
          toolTipId={this.props.toolTipId}
        />
      )
    );
  }
}

export default MiniProfileRenderer;
