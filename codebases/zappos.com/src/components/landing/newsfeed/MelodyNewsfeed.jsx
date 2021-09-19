import { Component } from 'react';
import { connect } from 'react-redux';

import MelodyNewsfeedFitSurvey from 'components/landing/newsfeed/MelodyNewsfeedFitSurvey';
import { newsfeedDismissal, selectWidget } from 'actions/landing/newsfeed';

import css from 'styles/components/landing/newsfeed/melodyNewsfeed.scss';

export class MelodyNewsfeed extends Component {

  componentDidMount() {
    const { slotDetails: { data }, selectWidget } = this.props;
    selectWidget(data);
  }

  onNewsfeedCardDismiss = data => {
    const { newsfeedDismissal } = this.props;
    newsfeedDismissal(data);
  };

  makeNewsfeedWidget() {
    const { newsfeed: { randomWidget }, shouldLazyLoad } = this.props;
    if (randomWidget) {
      const { type, eventId, item } = randomWidget;
      return (type === 'fitSurvey') &&
        <MelodyNewsfeedFitSurvey
          onNewsfeedCardDismiss={this.onNewsfeedCardDismiss}
          data={item}
          eventId={eventId}
          shouldLazyLoad={shouldLazyLoad} />;
    }
  }

  render() {
    const { slotDetails: { monetateId }, slotName } = this.props;
    return (
      <div className={css.newsfeed} data-slot-id={slotName} data-monetate-id={monetateId}>
        {this.makeNewsfeedWidget()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  newsfeed: state.newsfeed
});

export default connect(mapStateToProps, {
  selectWidget,
  newsfeedDismissal
})(MelodyNewsfeed);
