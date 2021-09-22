import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'bundles/phoenix/components/Modal';

import path from 'js/lib/path';
import config from 'js/app/config';
import Imgix from 'js/components/Imgix';

import _t from 'i18n!nls/interactive-transcript';

import 'css!./__styles__/TranslationModal';

const GTC_PORTAL_URI = 'https://translate-coursera.org';

export class TranslationModal extends React.Component {
  static propTypes = {
    courseId: PropTypes.string,
    trackingName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseId' does not exist on type 'Readon... Remove this comment to see the full error message
    const { courseId, trackingName, onClose } = this.props;
    const courseTranslationLink = courseId
      ? `${GTC_PORTAL_URI}/new_gtc/app/#/app/course_detail/${courseId}`
      : `${GTC_PORTAL_URI}/new_gtc/app/#/overview`;

    return (
      <Modal
        handleClose={onClose}
        className="rc-TranslationModal"
        modalName={_t('Help Us Translate')}
        trackingName={trackingName}
      >
        <div className="content align-horizontal-center">
          <Imgix
            height={88}
            width={202}
            alt={_t('Help us translate')}
            src={path.join(config.url.assets, '/interactive-transcript/images/translate.png')}
          />

          <div className="display-4-text m-t-2">
            <h2>{_t('Help Us Translate')}</h2>
          </div>

          <div className="body-1-text">
            {_t('Coursera video subtitles are translated by passionate learners like yourself.')}
            <br />
            {_t(
              'Join the Global Translator Community (GTC) to help make the world’s best education accessible to anyone, anywhere.'
            )}
          </div>

          <a
            href={GTC_PORTAL_URI}
            rel="noopener noreferrer"
            target="_blank"
            className="link-button primary cozy primary-cta"
          >
            {_t('Sign up for the Global Translator Community')}
          </a>

          <div className="body-1-text m-t-3">
            <h4>{_t('Already a GTC translator?')}</h4>
          </div>

          <a
            href={courseTranslationLink}
            rel="noopener noreferrer"
            target="_blank"
            className="link-button primary cozy secondary-cta"
          >
            {_t('View my language community')}
          </a>
        </div>
      </Modal>
    );
  }
}

export default TranslationModal;
