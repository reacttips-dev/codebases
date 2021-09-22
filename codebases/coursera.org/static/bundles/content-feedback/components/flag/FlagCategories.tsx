import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';

import Icon from 'bundles/iconfont/Icon';
// [react-16-todo] migrate to react-bootstrap-33
import { Accordion, Panel } from 'react-bootstrap';
import { getCategoriesForLearnerItemType } from 'bundles/content-feedback/utils/ItemFeedbackUtils';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import { Box, SvgButton, color } from '@coursera/coursera-ui';
import { SvgClose } from '@coursera/coursera-ui/svg';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import type CourseStoreClass from 'bundles/ondemand/stores/CourseStore';

import _t from 'i18n!nls/content-feedback';
import 'css!./__styles__/FlagCategories';

import type { Item } from 'bundles/learner-progress/types/Item';
import type { CmlContent } from 'bundles/cml/types/Content';
import type { FlagCategory } from 'bundles/authoring/course-content-feedback/types/courseContentFeedback';

function getTranslatedStrings() {
  return {
    label: _t('Submit Feedback'),
    sent: _t('Sent'),
  };
}

type PropsFromCaller = {
  comments: CmlContent;
  onSend: (comments: CmlContent) => void;
  onRemove: (comments: CmlContent) => void;
  onCancel: () => void;
  computedItem: Item;
  itemFeedbackType: ItemType;
};

type PropsFromStores = {
  courseId: string;
};

type Props = PropsFromCaller & PropsFromStores;

type Stores = {
  CourseStore: CourseStoreClass;
};

type State = {
  comments: CmlContent;
  activeKey: number;
  categories: Array<FlagCategory>;
};

class FlagCategories extends React.Component<Props, State> {
  feedbackCategoryEditor: HTMLElement | null;

  closeButton: HTMLElement | null;

  constructor(props: Props) {
    super(props);

    this.feedbackCategoryEditor = null;
    this.closeButton = null;

    const comments = props.comments || {};
    const categories = getCategoriesForLearnerItemType(props.itemFeedbackType, props.courseId);
    let activeKey = -1;

    _(categories).find((category, index) => {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (comments[category.id]) {
        activeKey = index;
        return true;
      } else {
        return false;
      }
    });

    this.state = {
      categories,
      activeKey,
      comments,
    };
  }

  componentDidMount() {
    if (this.closeButton) {
      this.closeButton.focus();
    }
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick = (event: MouseEvent) => {
    const { target } = event;

    if (this.feedbackCategoryEditor && !this.feedbackCategoryEditor.contains(target as HTMLElement)) {
      event.preventDefault();
      this.handleClose();
    }
  };

  handleSelect = (selectedKey: number) => {
    const { activeKey } = this.state;
    if (selectedKey === activeKey) {
      this.handleCancel();
    } else {
      this.setState({
        activeKey: selectedKey,
      });
    }
  };

  handleCancel = () => {
    const { categories, activeKey } = this.state;
    this.setState({
      activeKey: -1,
    });
    if (categories.length - 1 === activeKey && this.closeButton) {
      this.closeButton.focus();
    }
  };

  handleRemove = (category: FlagCategory) => {
    const { onRemove } = this.props;
    const { comments: currentComments } = this.state;

    const comments = { ...currentComments };
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete comments[category.id];

    this.setState({ comments });
    onRemove(comments);
  };

  handleSend = (category: FlagCategory, cml: CmlContent) => {
    const { onSend } = this.props;
    const { comments: currentComments } = this.state;

    const comments = { ...currentComments };
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    comments[category.id] = cml;

    this.setState({ comments });
    onSend(comments);
  };

  handleClose = () => {
    const { onCancel } = this.props;
    this.setState({
      activeKey: -1,
    });

    onCancel();
  };

  handleKeyDown = (e: $TSFixMe, selected: $TSFixMe, categoryIndex: $TSFixMe) => {
    const { categories, activeKey } = this.state;
    if (e.key === 'Tab' && !e.shiftKey) {
      if (categories.length - 1 === categoryIndex && categoryIndex !== activeKey && this.closeButton) {
        e.preventDefault();
        this.closeButton.focus();
      }
    }

    // expand flag category on Space Bar key press
    if (e.keyCode === 32) {
      e.preventDefault();
      if (activeKey === categoryIndex) {
        this.setState({
          activeKey: -1,
        });
      } else {
        this.setState({
          activeKey: categoryIndex,
        });
      }
    }
  };

  escFunction = ({ keyCode }: React.KeyboardEvent<HTMLElement>) => {
    if (keyCode === 27) {
      this.handleClose();
    }
  };

  setEditorRef = (node: HTMLElement | null) => {
    this.feedbackCategoryEditor = node;
  };

  setCloseBtnRef = (node: $TSFixMe) => {
    this.closeButton = node;
  };

  renderPanelHeader = (category: FlagCategory, selected: boolean, categoryIndex: number) => {
    const { comments } = this.state;
    const arrowIcon = selected ? 'chevron-down' : 'chevron-right';
    const arrowIconClasses = classNames('c-flag-category-arrow', {
      down: selected,
      right: !selected,
    });
    const strings = getTranslatedStrings();

    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const comment = comments[category.id];

    return (
      <div
        role="none"
        className="c-flag-category-header"
        onKeyDown={(e) => this.handleKeyDown(e, selected, categoryIndex)}
      >
        <Icon className={arrowIconClasses} name={arrowIcon} />

        {category.label}

        {comment && (
          <span className="c-flag-category-sent">
            <span className="text">{strings.sent}</span>
            <Icon name="circle" className="icon" />
          </span>
        )}
      </div>
    );
  };

  render() {
    const { itemFeedbackType, computedItem, courseId } = this.props;
    const { activeKey, comments } = this.state;
    const categories = getCategoriesForLearnerItemType(itemFeedbackType, courseId);
    const strings = getTranslatedStrings();

    return (
      <div
        className="rc-FlagCategories"
        onKeyDown={(keyPressed) => this.escFunction(keyPressed)}
        role="none"
        ref={this.setEditorRef}
      >
        <Box justifyContent="between" rootClassName="share-feedback-header">
          <div id="reportProblemId" className="header-text">
            {_t('Report problem')}
          </div>
          <SvgButton
            rootClassName="close-button"
            type="icon"
            size="zero"
            _refAlt={this.setCloseBtnRef}
            htmlAttributes={{
              'aria-label': _t('Close Report Problem Dialog'),
            }}
            svgElement={<SvgClose color={color.bgGrayThemeDark} />}
            onClick={this.handleClose}
          />
        </Box>

        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
        <Accordion activeKey={activeKey} onSelect={this.handleSelect} id="accord">
          {categories?.map((category, categoryIndex) => {
            const isFocused = activeKey === categoryIndex;
            const header = this.renderPanelHeader(category, isFocused, categoryIndex);
            const { Component, id, label, example } = category;
            const ariaId = `${id}-feedback`;

            return (
              // @ts-expect-error TODO: header property does not exist in Panel component
              <Panel key={id} header={header} eventKey={categoryIndex}>
                <span className="screenreader-only" id={ariaId}>
                  {label} {example}
                </span>

                <Component
                  isFocused={isFocused}
                  categoryId={id}
                  computedItem={computedItem}
                  placeholder={example}
                  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  initialCML={comments[id]}
                  onSend={(cml: CmlContent) => this.handleSend(category, cml)}
                  onRemove={() => this.handleRemove(category)}
                  onCancel={this.handleCancel}
                  ariaLabel={strings.label}
                  ariaDescribedBy={ariaId}
                />
              </Panel>
            );
          })}
        </Accordion>
      </div>
    );
  }
}

export default connectToStores<Props, PropsFromCaller, Stores>(['CourseStore'], ({ CourseStore }) => {
  return {
    courseId: CourseStore.getCourseId(),
  };
})(FlagCategories);
