import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cn from 'classnames';

import { isAssigned } from 'actions/ab';
import { HYDRA_BLUE_SKY_PDP } from 'constants/hydraTests';
import { onEvent } from 'helpers/EventHelpers';
import { trackEvent } from 'helpers/analytics';
import { AppState } from 'types/app';

import styles from 'styles/components/productdetail/recommendedSizeTooltip.scss';

interface State {
  hidden: boolean;
  initialClacValue?: string | true;
}

interface OwnProps {
  hydraBlueSkyPdp: boolean;
  id: string;
  openModal: () => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export class RecommendedSizeTooltip extends Component<Props, State> {
  state: State = {
    hidden : true
  };
  componentDidMount() {
    const { clacCookie } = this.props;
    this.setState({ initialClacValue: clacCookie });
    this.hideShowToolTip();
    onEvent(document, 'click', this.hide, undefined, this); // allow the tooltip to be dismissed when screen clicked
    onEvent(document, 'keydown', this.onKeyDown, undefined, this); // allow the tooltip to be dismissed on esc press
  }
  localStorageKey = 'sessionLastDismissedSizeTooltip';
  hideShowToolTip() {
    const { initialClacValue } = this.state;
    const { clacCookie, hydraBlueSkyPdp, sessionId } = this.props;
    const sessionLastDismissedSizeTooltip = window.localStorage.getItem(this.localStorageKey);

    /*
     * Issue #11071
     * The document click event doesn't play well with the Llama login modal.
     * This checks the Llama cookie (clac). If undefined (not set) or null (expired), hide tooltip.
     * Else if the tool tip hasn't been dismissed, but the Llama has been dismissed (initialClacValue
     * would still be undefined because the Llama cookie gets set before the click event
     * comes through) show the tooltip and set the initialClacValue. Lastly, hide tooltip
     * and write to localStorage.
     */
    if (!hydraBlueSkyPdp && !clacCookie) {
      this.setState({ hidden: true });
    } else if ((!sessionLastDismissedSizeTooltip || sessionId !== sessionLastDismissedSizeTooltip) && initialClacValue === undefined) {
      this.setState({ hidden: false, initialClacValue: hydraBlueSkyPdp || clacCookie });
    } else {
      this.setState({ hidden: true });
      window.localStorage.setItem(this.localStorageKey, sessionId);
    }
  }
  onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.hideShowToolTip();
    }
  };
  hide = () => {
    this.hideShowToolTip();
  };
  onClick = () => {
    const { openModal } = this.props;
    openModal();
  };
  render() {
    const { hydraBlueSkyPdp, id } = this.props;
    const { hidden } = this.state;
    /*
      https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip
      This is already not a properly accessible tooltip (It is more of a modal that looks like a tooltip)
      because it doesn't show on user input and we can't have the focus on the button this tooltip describes.
      This is because we show this tooltip on page load so having the page scroll to the tooltip is jarring for the user

      buttttt it does everything else right!
    */
    return <div id={id} role="tooltip" className={cn(styles.recommendedSizeTooltip, { [styles.hideTooltip] : hidden, [styles.blueSky]: hydraBlueSkyPdp })}>
      <div className={cn(styles.fadeIn, styles.delay)}>
        <p>We can help you find your size!</p>
        <p>
          Tell us which shoes fit you well in our
          <button type="button" onClick={this.onClick}>size calculator</button>
          and we can recommend a size that fits you best.
        </p>
      </div>
    </div>;
  }
}

const mapStateToProps = (state: AppState) => ({
  clacCookie: state.cookies['clac'] as string,
  hydraBlueSkyPdp: isAssigned(HYDRA_BLUE_SKY_PDP, 1, state),
  sessionId: state.cookies['session-id'] as string
});

const mapDispatchToProps = {
  trackEvent
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(RecommendedSizeTooltip);
