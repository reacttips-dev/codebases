/** @jsx jsx */
import React from 'react';
import _ from 'underscore';
import { compose } from 'recompose';

import type { Theme } from '@coursera/cds-core';
import { Typography, withTheme } from '@coursera/cds-core';
import { css, jsx } from '@emotion/react';

import { RadioGroup, Radio } from '@coursera/coursera-ui';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import { getCategoriesForLearnerItemType } from 'bundles/content-feedback/utils/ItemFeedbackUtils';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';
import type { Item } from 'bundles/learner-progress/types/Item';
import type { CmlContent } from 'bundles/cml/types/Content';
import type { FlagCategory } from 'bundles/authoring/course-content-feedback/types/courseContentFeedback';
import type CourseStoreClass from 'bundles/ondemand/stores/CourseStore';

import _t from 'i18n!nls/content-feedback';

function getTranslatedStrings() {
  return {
    label: _t('Submit Feedback'),
    sent: _t('Sent'),
  };
}

const styles = {
  flagCategories: (theme: Theme) => css`
    padding: ${theme.spacing(48)};
    /* Ensure that flag categories display above page content (including videos and code evaluators) */
    z-index: 1001;
    position: absolute;
    padding: ${theme.spacing(24)};
    width: 372px;
    bottom: ${theme.spacing(32)};
    right: 0;
    background: white;
    border-radius: 3px;
    border: 1px solid #e1e1e1;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);

    /* Custom media query to cater for iPhone X/8/7/6 at 375px */
    @media (max-width: 390px) {
      left: 0;
    }

    ${theme.breakpoints.down('sm')} {
      width: 350px;
      height: 350px;
      right: -30px;
      overflow: scroll;
    }
  `,
};

type Comments = Record<string, CmlContent>;

type PropsFromCaller = {
  comments: Comments;
  onSend: (comments: Comments) => void;
  onRemove: (comments: Comments) => void;
  onCancel: () => void;
  computedItem: Item;
  itemFeedbackType: ItemType;
};

type PropsFromCDS = {
  theme: Theme;
};

type PropsFromStores = {
  courseId: string;
};

type Props = PropsFromCaller & PropsFromStores & PropsFromCDS;

type Stores = {
  CourseStore: CourseStoreClass;
};

type State = {
  comments: Comments;
  activeKey: number;
  categories: Array<FlagCategory>;
  isFocused: boolean;
  selectedCategory: FlagCategory;
  initialCml: $TSFixMe;
};

class FlagCategories extends React.Component<Props, State> {
  feedbackCategoryEditor: HTMLElement | null;

  constructor(props: Props) {
    super(props);

    this.feedbackCategoryEditor = null;

    const comments = props.comments || {};
    const categories = getCategoriesForLearnerItemType(props.itemFeedbackType, props.courseId);
    let activeKey = 0;

    _(categories).find((category, index) => {
      if (comments[category.id]) {
        activeKey = index;
        return true;
      } else {
        return false;
      }
    });

    const defaultCategory = categories[activeKey];

    const initialCml = comments[defaultCategory.id];

    this.state = {
      categories,
      activeKey,
      comments,
      isFocused: false,
      selectedCategory: categories[activeKey],
      initialCml,
    };
  }

  componentDidMount() {
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

  handleRemove = (category: FlagCategory) => {
    const { onRemove } = this.props;
    const { comments: currentComments } = this.state;

    const comments = { ...currentComments };
    delete comments[category.id];

    this.setState({ comments });
    onRemove(comments);
  };

  handleSend = (category: FlagCategory, cml: CmlContent) => {
    const { onSend } = this.props;
    const { comments: currentComments } = this.state;

    const comments = { ...currentComments };

    comments[category.id] = cml;

    this.setState({ comments });
    onSend(comments);
  };

  handleClose = () => {
    const { onCancel } = this.props;
    this.setState({
      activeKey: 0,
    });
    onCancel();
  };

  escFunction = ({ keyCode }: React.KeyboardEvent<HTMLElement>) => {
    if (keyCode === 27) {
      this.handleClose();
    }
  };

  setEditorRef = (node: HTMLElement | null) => {
    this.feedbackCategoryEditor = node;
  };

  onChange = (event: React.ChangeEvent<HTMLButtonElement>) => {
    const { activeKey, comments } = this.state;
    const { value } = event.target;

    const [id, categoryIndex] = value.split('-');

    const isFocused = activeKey === Number(categoryIndex);
    const { categories } = this.state;

    const selectedCategory = categories.find((category) => category.id === id) as FlagCategory;

    const initialCml = comments[selectedCategory.id];
    this.setState({ isFocused, selectedCategory, activeKey: Number(categoryIndex), initialCml });
  };

  render() {
    const { itemFeedbackType, computedItem, courseId } = this.props;
    const { activeKey, isFocused, selectedCategory, initialCml } = this.state;
    const categories = getCategoriesForLearnerItemType(itemFeedbackType, courseId);
    const strings = getTranslatedStrings();

    const { Component } = selectedCategory;
    return (
      <div
        css={styles.flagCategories}
        onKeyDown={(keyPressed) => this.escFunction(keyPressed)}
        role="none"
        ref={this.setEditorRef}
      >
        <Typography
          css={css`
            margin-bottom: ${this.props.theme.spacing(32)};
          `}
          id="reportProblemId"
          variant="h1semibold"
        >
          {_t('Report an issue')}
        </Typography>

        <Typography
          css={css`
            margin-bottom: ${this.props.theme.spacing(16)};
          `}
          id="reportProblemId"
          variant="h3semibold"
        >
          {_t("Select an issue you'd like to report")}
        </Typography>

        <div>
          <RadioGroup onChange={this.onChange} value={`${this.state.selectedCategory.id}-${activeKey}`}>
            {categories?.map((category, categoryIndex) => {
              const { id, label, example } = category;
              const ariaId = `${id}-feedback`;

              return (
                <div
                  key={id}
                  css={css`
                    padding-bottom: ${this.props.theme.spacing(24)};
                  `}
                >
                  <span className="screenreader-only" id={ariaId}>
                    {label} {example}
                  </span>
                  <Radio value={`${id}-${categoryIndex}`}>{label}</Radio>
                </div>
              );
            })}
          </RadioGroup>

          <Typography
            css={css`
              margin-bottom: ${this.props.theme.spacing(16)};
            `}
            id="reportProblemId"
            variant="h3semibold"
          >
            {_t('Describe the issue')}
          </Typography>

          <Component
            isFocused={isFocused}
            categoryId={selectedCategory.id}
            computedItem={computedItem}
            placeholder={selectedCategory.example}
            initialCML={initialCml}
            onSend={(cml: CmlContent) => this.handleSend(selectedCategory, cml)}
            onRemove={() => this.handleRemove(selectedCategory)}
            onCancel={this.handleClose}
            ariaLabel={strings.label}
            ariaDescribedBy={`${selectedCategory.id}-feedback`}
          />
        </div>
      </div>
    );
  }
}

export default compose<Props, PropsFromCaller>(
  connectToStores<PropsFromCaller, PropsFromCaller, Stores>(['CourseStore'], ({ CourseStore }) => {
    return {
      courseId: CourseStore.getCourseId(),
    };
  }),
  withTheme
)(FlagCategories);
