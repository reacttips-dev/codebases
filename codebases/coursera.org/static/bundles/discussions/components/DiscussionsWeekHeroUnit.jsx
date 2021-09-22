import PropTypes from 'prop-types';
import React from 'react';
import WeekStats from 'bundles/discussions/components/WeekStats';
import CML from 'bundles/cml/components/CML';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';
import { getWeekDiscussionsUrl } from 'bundles/discussions/utils/discussionsUrl';
import cmlPropType from 'bundles/cml/propTypes/cml';
import _t from 'i18n!nls/discussions';
import 'css!bundles/discussions/components/__styles__/DiscussionsWeekHeroUnit';

class DiscussionsWeekHeroUnit extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: cmlPropType.isRequired,
    weekNumber: PropTypes.number,
    isLoading: PropTypes.bool,
    lastAnsweredAt: PropTypes.number,
    forumQuestionCount: PropTypes.number,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  goToForum = () => {
    const { router } = this.context;
    router.push(getWeekDiscussionsUrl(this.props.weekNumber));
  };

  render() {
    const { weekNumber, isLoading, lastAnsweredAt, forumQuestionCount, title, description } = this.props;

    if (!weekNumber) {
      return null;
    }

    return (
      <div className="rc-CalloutBox card-no-action rc-DiscussionsWeekHeroUnit">
        {isLoading ? (
          <div className="message align-horizontal-center">
            <i className="cif-spinner cif-spin cif-2x" />
          </div>
        ) : (
          <div className="horizontal-box vertical-when-mobile">
            <div className="flex-1 left-column">
              {/* This aria-label here is redundant, however it is necessary for the Chromevox reader on Chromebook to properly read and announce the text */}
              <h2 aria-label={title} className="card-headline-text">
                {title}
              </h2>
              <CML cml={description} className="forum-description" />
              <WeekStats lastAnsweredAt={lastAnsweredAt} forumQuestionCount={forumQuestionCount} />
            </div>

            <div className="align-self-center">
              <TrackedLink2
                className="link-button secondary cozy"
                href={getWeekDiscussionsUrl(weekNumber)}
                trackingName="discussions_hero_unit"
              >
                {_t('Go to forum')}
              </TrackedLink2>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DiscussionsWeekHeroUnit;
