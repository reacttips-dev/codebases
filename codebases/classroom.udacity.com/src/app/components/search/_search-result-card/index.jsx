import {
  IconCheck,
  IconCode,
  IconConcept,
  IconImage,
  IconLocked,
  IconVideo,
} from '@udacity/veritas-icons';
import Breadcrumbs from './_breadcrumbs';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import Tag from './_tag';
import { __ } from 'services/localization-service';
import styles from './index.scss';

export const ResultPropTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  breadcrumbTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  semanticType: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locked: PropTypes.bool,
};

const ResultTypeTagKey = {
  get [SemanticTypes.WORKSPACE_ATOM]() {
    return {
      text: __('workspace'),
      icon: <IconCode title={__('workspace')} size="sm" />,
    };
  },
  get [SemanticTypes.QUIZ_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
  get [SemanticTypes.RADIO_QUIZ_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
  get [SemanticTypes.MATCHING_QUIZ_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
  get [SemanticTypes.CHECKBOX_QUIZ_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
  get [SemanticTypes.TASKLIST_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
  get [SemanticTypes.IMAGE_ATOM]() {
    return {
      text: __('image'),
      icon: <IconImage title={__('image')} size="sm" />,
    };
  },
  get [SemanticTypes.TEXT_ATOM]() {
    return {
      text: __('text'),
      icon: <IconConcept title={__('text')} size="sm" />,
    };
  },
  get [SemanticTypes.VIDEO_ATOM]() {
    return {
      text: __('video'),
      icon: <IconVideo title={__('video')} size="sm" />,
    };
  },
  get [SemanticTypes.EMBEDDED_FRAME_ATOM]() {
    return {
      text: __('image'),
      icon: <IconImage title={__('image')} size="sm" />,
    };
  },
  get [SemanticTypes.VALIDATED_QUIZ_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
  get [SemanticTypes.REFLECT_ATOM]() {
    return {
      text: __('quiz'),
      icon: <IconCheck title={__('quiz')} size="sm" />,
    };
  },
};

@cssModule(styles)
export default class SearchResultCard extends React.Component {
  static displayName = 'search/_result-card';

  static propTypes = {
    ...ResultPropTypes,
    onNavigate: PropTypes.func.isRequired,
    locked: PropTypes.bool.isRequired,
  };

  render() {
    const {
      title,
      description,
      path,
      breadcrumbTitles,
      semanticType,
      onNavigate,
      locked,
    } = this.props;
    const { text: tagText, icon: tagIcon } = ResultTypeTagKey[semanticType];

    return (
      <div styleName={locked ? 'card-container-locked' : 'card-container'}>
        <div styleName="info">
          <Link to={path} onClick={onNavigate} styleName="curtain">
            {title}
          </Link>
          <Breadcrumbs breadcrumbTitles={breadcrumbTitles} />
          <div styleName="introduction">
            <div styleName="title">
              <Link to={path} onClick={onNavigate}>
                <p dangerouslySetInnerHTML={{ __html: title }} />
              </Link>
            </div>
            <Tag text={tagText} icon={tagIcon} />
          </div>
          <p
            styleName="details"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div styleName="locked-section">
          <div styleName="lock">
            <IconLocked glyph="locked-md" size="sm" />{' '}
            <h5 styleName="locked-text">{__('Locked')}</h5>
          </div>
          <h6>{__('Unavailable until term opens')}</h6>
        </div>
      </div>
    );
  }
}
